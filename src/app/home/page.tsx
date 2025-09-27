"use client";

import { Poppins } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  useDashboard,
  useRecentActivity,
  useDashboardMetrics,
  useIntegrationStatus,
  useSyncStatus,
} from "@/lib/hooks/useDashboard";

// Import modular components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SubscriberFlow } from "@/components/dashboard/SubscriberFlow";
import { RecentActivityPanel } from "@/components/dashboard/RecentActivityPanel";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "react-toastify";

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const animationProps = {
  initial: { opacity: 0, scale: 1, y: 20 },
  whileInView: "visible",
  viewport: { once: true },
  transition: { duration: 0.6 },
  variants: {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: { opacity: 0, scale: 0 },
  },
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const { authenticateGmail } = useAuth();

  // Dashboard hooks
  const {
    data: dashboardData,
    loading: dashboardLoading,
    syncNow,
    connectKit,
  } = useDashboard();
  const { recentActivity, handleRetrySync, canRetry } = useRecentActivity();
  const { metrics } = useDashboardMetrics();
  const { integrationStatus } = useIntegrationStatus();
  const { syncStatus } = useSyncStatus();

  const handleReconnect = () => {
    // Navigate to connections page or trigger reconnection flow
    window.location.href = "/connections";
  };

  const handleManualSync = () => {
    syncNow();
  };

  const handleAddIntegration = () => {
    window.location.href = "/connections";
  };

  const handleSyncSettings = () => {
    window.location.href = "/settings";
  };

  const handleViewFailures = () => {
    // TODO: Implement failure view modal or page
    console.log("View failures clicked");
  };

  const handleDocumentation = () => {
    window.open("https://docs.substacksync.com", "_blank");
  };

  const handleLiveChat = () => {
    // TODO: Implement live chat
    console.log("Live chat clicked");
  };

  const handleKitConnect = async (apiKey: string, apiSecret?: string) => {
    try {
      await connectKit(apiKey, apiSecret);
    } catch (error) {
      console.error("Kit connection error:", error);
      throw error;
    }
  };

  const handleGmailConnect = async () => {
    try {
      await authenticateGmail();
    } catch (error) {
      console.error("Gmail connect error:", error);
      toast.error("Failed to connect Gmail");
    }
  };

  if (status === "loading") {
    return (
      <div
        className={cn(
          "min-h-screen bg-background flex items-center justify-center",
          Poppins.className
        )}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className={cn(
          "min-h-screen bg-background flex items-center justify-center",
          Poppins.className
        )}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access this page.
          </p>
          <a href="/login">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded">
              Sign In
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground",
        Poppins.className
      )}
    >
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* <motion.section {...fadeInAnimation}>
              <SyncStatusPanel
                syncStatus={syncStatus}
                onReconnect={handleReconnect}
              />
            </motion.section> */}

            <motion.section {...animationProps}>
              <SubscriberFlow
                integrationStatus={integrationStatus}
                onKitConnect={handleKitConnect}
                onGmailConnect={handleGmailConnect}
              />
            </motion.section>

            <motion.section {...animationProps}>
              <RecentActivityPanel
                activities={recentActivity}
                onRetrySync={handleRetrySync}
                canRetry={canRetry}
                loading={dashboardLoading}
              />
            </motion.section>

            {/* <motion.section {...animationProps}>
              <QuickActions
                onAddIntegration={handleAddIntegration}
                onSyncSettings={handleSyncSettings}
                onSyncNow={handleManualSync}
                loading={dashboardLoading}
              />
            </motion.section> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.section {...animationProps}>
              <MetricsPanel
                metrics={metrics}
                onViewFailures={handleViewFailures}
              />
            </motion.section>
{/* 
            <motion.section {...animationProps}>
              <ComingSoon
                integrations={dashboardData?.upcomingIntegrations || []}
              />
            </motion.section> */}
          </div>
        </div>
      </div>
    </div>
  );
}
