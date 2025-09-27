"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SyncStatus } from "@/types/dashboard";

interface SyncStatusPanelProps {
  syncStatus: SyncStatus;
  onReconnect: () => void;
  className?: string;
}

export const SyncStatusPanel = ({ syncStatus, onReconnect, className }: SyncStatusPanelProps) => {
  const getStatusConfig = () => {
    switch (syncStatus.status) {
      case "connected":
        return {
          bgClass: "bg-gradient-to-r from-green-50 to-green-100 border-green-200",
          iconBg: "bg-green-500",
          icon: <CheckCircle className="h-8 w-8 text-white" />,
          textColor: "text-green-600",
          statusText: "Connected"
        };
      case "warning":
        return {
          bgClass: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200",
          iconBg: "bg-yellow-500",
          icon: <AlertTriangle className="h-8 w-8 text-white" />,
          textColor: "text-yellow-600",
          statusText: "Needs Attention"
        };
      case "error":
        return {
          bgClass: "bg-gradient-to-r from-red-50 to-red-100 border-red-200",
          iconBg: "bg-red-500",
          icon: <XCircle className="h-8 w-8 text-white" />,
          textColor: "text-red-600",
          statusText: "Error"
        };
      default:
        return {
          bgClass: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200",
          iconBg: "bg-gray-500",
          icon: <XCircle className="h-8 w-8 text-white" />,
          textColor: "text-gray-600",
          statusText: "Unknown"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={cn("border-2", config.bgClass, className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn("p-3 rounded-full", config.iconBg)}>
              {config.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Sync Status</h2>
              <p className={cn("font-medium", config.textColor)}>
                {config.statusText}
              </p>
            </div>
          </div>
          <Button
            onClick={onReconnect}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reconnect
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-sm mb-1">Last Sync</p>
            <p className="text-2xl font-bold">
              {syncStatus.lastSync}
            </p>
          </div>
          <div>
            <p className="text-sm mb-1">Synced Today</p>
            <p className="text-2xl font-bold">
              {syncStatus.syncedToday} subscribers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
