"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Poppins } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  Loader, 
  Mail, 
  RefreshCw, 
  Settings, 
  Zap,
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

interface Integration {
  gmail?: {
    email: string;
    connected: boolean;
    watchExpiry?: string;
  };
  kit?: {
    connected: boolean;
    hasApiKey: boolean;
    freeTagId?: string;
    paidTagId?: string;
  };
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [integration, setIntegration] = useState<Integration>({});
  const [kitApiKey, setKitApiKey] = useState("");
  const [freeTagName, setFreeTagName] = useState("Substack Free Subscriber");
  const [paidTagName, setPaidTagName] = useState("Substack Paid Subscriber");
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchIntegrations();
    }
  }, [status]);

  const fetchIntegrations = async () => {
    try {
      // Fetch Gmail integration status
      const gmailRes = await axios.get("/api/auth/gmail/status");
      
      // Fetch Kit integration status
      const kitRes = await axios.get("/api/kit/setup");
      
      setIntegration({
        gmail: gmailRes.data.integration,
        kit: kitRes.data.integration,
      });
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
    }
  };

  const handleGmailConnect = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/auth/gmail");
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Gmail connect error:", error);
      setMessage({ type: 'error', text: 'Failed to connect Gmail' });
    } finally {
      setLoading(false);
    }
  };

  const handleKitSetup = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const response = await axios.post("/api/kit/setup", {
        apiKey: kitApiKey,
        freeTagName,
        paidTagName,
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Kit integration setup successfully!' });
        setKitApiKey(""); // Clear the API key
        fetchIntegrations(); // Refresh the status
      }
    } catch (error: any) {
      console.error("Kit setup error:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to setup Kit integration' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className={cn("min-h-screen bg-background flex items-center justify-center", Poppins.className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted text-foreground",
        Poppins.className
      )}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to home link */}
        <motion.div {...fadeInAnimation} className="mb-8">
          <Link
            href="/home"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to dashboard</span>
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div {...fadeInAnimation} className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your Gmail and Kit integrations to start automating your subscriber workflow.
          </p>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <motion.div
            {...fadeInAnimation}
            className={cn(
              "mb-6 p-4 rounded-lg flex items-center space-x-2",
              message.type === 'success' 
                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200" 
                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
            )}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* Gmail Integration */}
        <motion.div {...fadeInAnimation}>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Gmail Integration</CardTitle>
                    <CardDescription>
                      Connect your Gmail to monitor Substack subscriber emails
                    </CardDescription>
                  </div>
                </div>
                {integration.gmail?.connected && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {integration.gmail?.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connected Email:</span>
                    <span className="text-sm font-medium">{integration.gmail.email}</span>
                  </div>
                  <Button
                    onClick={handleGmailConnect}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reconnect Gmail
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGmailConnect}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Connect Gmail Account
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Kit Integration */}
        <motion.div {...fadeInAnimation}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Kit (ConvertKit) Integration</CardTitle>
                    <CardDescription>
                      Configure your Kit API key and tag settings
                    </CardDescription>
                  </div>
                </div>
                {integration.kit?.connected && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">Kit API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder={integration.kit?.hasApiKey ? "••••••••••••••••" : "Enter your Kit API key"}
                    value={kitApiKey}
                    onChange={(e) => setKitApiKey(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Find your API key in Kit under Account → Advanced → API
                  </p>
                </div>

                <div>
                  <Label htmlFor="freeTag">Free Subscriber Tag Name</Label>
                  <Input
                    id="freeTag"
                    type="text"
                    placeholder="e.g., Substack Free Subscriber"
                    value={freeTagName}
                    onChange={(e) => setFreeTagName(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This tag will be applied to free Substack subscribers
                  </p>
                </div>

                <div>
                  <Label htmlFor="paidTag">Paid Subscriber Tag Name</Label>
                  <Input
                    id="paidTag"
                    type="text"
                    placeholder="e.g., Substack Paid Subscriber"
                    value={paidTagName}
                    onChange={(e) => setPaidTagName(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This tag will be applied to paid Substack subscribers
                  </p>
                </div>

                <Button
                  onClick={handleKitSetup}
                  disabled={loading || (!kitApiKey && !integration.kit?.hasApiKey)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      {integration.kit?.connected ? 'Update Kit Settings' : 'Setup Kit Integration'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div {...fadeInAnimation} className="mt-8">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  Connect your Gmail account to allow SubstackSync to monitor for Substack emails
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  Add your Kit API key and configure the tags for free and paid subscribers
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  When new subscribers join your Substack, they&apos;ll automatically be added to Kit with the appropriate tags
                </li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
