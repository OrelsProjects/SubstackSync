"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface HelpSupportProps {
  onDocumentation?: () => void;
  onLiveChat?: () => void;
  className?: string;
}

export const HelpSupport = ({ onDocumentation, onLiveChat, className }: HelpSupportProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Get support from our team or browse our documentation.
        </p>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onDocumentation}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Documentation
          </Button>
          <Button 
            className="w-full justify-start bg-blue-600 hover:bg-blue-700"
            onClick={onLiveChat}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Live Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
