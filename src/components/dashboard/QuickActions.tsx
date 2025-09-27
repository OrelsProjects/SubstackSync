"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Settings, Zap } from "lucide-react";

interface QuickActionsProps {
  onAddIntegration?: () => void;
  onSyncSettings?: () => void;
  onSyncNow?: () => void;
  loading?: boolean;
  className?: string;
}

export const QuickActions = ({ 
  onAddIntegration, 
  onSyncSettings, 
  onSyncNow, 
  loading = false,
  className 
}: QuickActionsProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={onAddIntegration}
            disabled={loading}
          >
            <Plus className="h-6 w-6" />
            <span>Add Integration</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={onSyncSettings}
            disabled={loading}
          >
            <Settings className="h-6 w-6" />
            <span>Sync Settings</span>
          </Button>
          <Button
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700"
            onClick={onSyncNow}
            disabled={loading}
          >
            <Zap className="h-6 w-6" />
            <span>Sync Now</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
