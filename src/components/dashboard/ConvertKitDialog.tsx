"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConvertKitDialogProps {
  children: React.ReactNode;
  onConnect?: (apiKey: string, apiSecret?: string) => Promise<void>;
  loading?: boolean;
}

export const ConvertKitDialog = ({ children, onConnect, loading = false }: ConvertKitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!apiKey.trim()) return;
    
    setIsConnecting(true);
    try {
      await onConnect?.(apiKey, apiSecret);
      setOpen(false);
      setApiKey("");
      setApiSecret("");
    } catch (error) {
      console.error("Failed to connect ConvertKit:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">CK</span>
            </div>
            <span>Connect ConvertKit</span>
          </DialogTitle>
          <DialogDescription>
            Connect your ConvertKit account to start syncing subscribers
            automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                How to get your API credentials
              </CardTitle>
              <CardDescription className="text-xs">
                You&apos;ll need your API Key and API Secret from ConvertKit
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  window.open(
                    "https://app.convertkit.com/account_settings/developer_settings",
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open ConvertKit Settings
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                type="text"
                placeholder="Enter your ConvertKit API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isConnecting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret (Optional)</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter your ConvertKit API Secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                disabled={isConnecting}
              />
              <p className="text-xs text-muted-foreground">
                API Secret is optional but recommended for enhanced security
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!apiKey.trim() || isConnecting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect ConvertKit"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
