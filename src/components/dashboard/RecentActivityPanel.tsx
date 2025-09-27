"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { RecentActivity } from "@/types/dashboard";

interface RecentActivityProps {
  activities: RecentActivity[];
  onRetrySync: (activityId: string) => void;
  canRetry: (activity: RecentActivity) => boolean;
  loading?: boolean;
  className?: string;
}

export const RecentActivityPanel = ({ 
  activities, 
  onRetrySync, 
  canRetry, 
  loading = false,
  className 
}: RecentActivityProps) => {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              </div>
              <p className="text-muted-foreground">
                No activity yet. Connect your accounts to start automating!
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const timeAgo = activity.createdAt
                ? getTimeAgo(new Date(activity.createdAt))
                : "Just now";
              const isSuccess = activity.addedToKit && !activity.error;
              const canRetryThis = canRetry(activity);

              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSuccess ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium">
                        {activity.subscriberName || activity.subscriberEmail}{" "}
                        {isSuccess ? "added to Kit" : "failed to sync"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {timeAgo}
                      </p>
                    </div>
                  </div>
                  {canRetryThis && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRetrySync(activity.id)}
                      disabled={loading}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
