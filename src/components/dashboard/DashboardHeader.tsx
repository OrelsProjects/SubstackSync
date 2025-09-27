"use client";

import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useAuth from "@/lib/hooks/useAuth";

interface DashboardHeaderProps {
  className?: string;
}

export const DashboardHeader = ({ className }: DashboardHeaderProps) => {
  const { signOut, loading } = useAuth();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className={`w-full bg-background/80 backdrop-blur-md shadow-md z-50 fixed top-0 left-0 ${className || ''}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold text-primary">SubstackSync</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/home" className="text-primary font-medium">
            Dashboard
          </Link>
          <Link
            href="/connections"
            className="text-muted-foreground hover:text-foreground"
          >
            Connections
          </Link>
          <Link
            href="/settings"
            className="text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
          <Link
            href="/help"
            className="text-muted-foreground hover:text-foreground"
          >
            Help
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              {session?.user?.name?.charAt(0) ||
                session?.user?.email?.charAt(0) ||
                "U"}
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              {session?.user?.name || session?.user?.email}
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
