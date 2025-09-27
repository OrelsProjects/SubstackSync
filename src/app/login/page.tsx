"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Poppins } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import useAuth from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle("/home");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted text-foreground flex flex-col items-center justify-center relative overflow-x-hidden",
        Poppins.className
      )}
    >
      {/* Abstract background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to home link */}
      <motion.div
        {...fadeInAnimation}
        className="absolute top-8 left-8 z-10"
      >
        <Link
          href="/"
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <motion.div
          {...fadeInAnimation}
          className="text-center mb-8"
        >
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
            <span className="text-3xl font-bold text-primary">SubstackSync</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your automated subscriber management
          </p>
        </motion.div>

        <motion.div {...fadeInAnimation}>
          <Card className="bg-card/20 backdrop-filter backdrop-blur-lg bg-opacity-20 border border-border shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-primary">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Get started with SubstackSync in just one click
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-background hover:bg-background/90 text-foreground border border-border h-12 text-base font-medium"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features preview */}
        <motion.div
          {...fadeInAnimation}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            What you'll get access to:
          </p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Automated subscriber management</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Real-time sync with Substack</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Integration with email marketing tools</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
