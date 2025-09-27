"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardMetrics } from "@/types/dashboard";

interface MetricsPanelProps {
  metrics: DashboardMetrics;
  onViewFailures?: () => void;
  className?: string;
}

export const MetricsPanel = ({ metrics, onViewFailures, className }: MetricsPanelProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Synced</span>
          </div>
          <span className="font-bold text-lg">{metrics.totalSynced}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">This Month</span>
          </div>
          <span className="font-bold text-lg">{metrics.thisMonth}</span>
        </div>
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">Failures</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-red-600">
              {metrics.failures}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={onViewFailures}
            >
              View
            </Button>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};
