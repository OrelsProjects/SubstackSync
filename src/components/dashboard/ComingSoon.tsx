"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingIntegration } from "@/types/dashboard";

interface ComingSoonProps {
  integrations: UpcomingIntegration[];
  className?: string;
}

export const ComingSoon = ({ integrations, className }: ComingSoonProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Coming Soon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map((integration, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 ${integration.color} rounded flex items-center justify-center`}
              >
                <span className="text-white font-bold text-sm">
                  {integration.initials}
                </span>
              </div>
              <span className="text-sm font-medium">{integration.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
