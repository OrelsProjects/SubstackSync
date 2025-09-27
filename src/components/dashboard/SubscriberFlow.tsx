"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntegrationStatus } from "@/types/dashboard";
import { KitDialog } from "./KitDialog";
import { TagsManager } from "./TagsManager";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SubscriberFlowProps {
  integrationStatus: IntegrationStatus;
  onGmailConnect?: () => void;
  onKitConnect?: (apiKey: string, apiSecret?: string) => Promise<void>;
  className?: string;
}

export const SubscriberFlow = ({
  integrationStatus,
  onGmailConnect,
  onKitConnect,
  className,
}: SubscriberFlowProps) => {
  return (
    <div className="space-y-6">
      <Card className={className}>
        <CardHeader>
          <CardTitle>Subscriber Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8">
            {/* Gmail */}
            <div
              className="text-center cursor-pointer flex flex-col items-center"
              onClick={onGmailConnect}
            >
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <p className="font-medium">Gmail</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    integrationStatus.gmailConnected
                      ? "bg-green-500"
                      : "bg-red-500"
                  )}
                ></div>
                <span
                  className={cn(
                    "text-sm",
                    integrationStatus.gmailConnected
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {integrationStatus.gmailConnected
                    ? "Connected"
                    : "Not Connected"}
                </span>
              </div>
            </div>

            <ArrowRight className="h-6 w-6 text-muted-foreground self-start translate-y-[100%] -translate-x-[%]" />

            {/* Kit */}
            <KitDialog onConnect={onKitConnect}>
              <div className="text-center cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">CK</span>
                </div>
                <p className="font-medium">Kit</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      integrationStatus.kitConnected
                        ? "bg-green-500"
                        : "bg-red-500"
                    )}
                  ></div>
                  <span
                    className={cn(
                      "text-sm",
                      integrationStatus.kitConnected
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {integrationStatus.kitConnected
                      ? "Connected"
                      : "Not Connected"}
                  </span>
                </div>
              </div>
            </KitDialog>

            <ArrowRight className="h-6 w-6 text-muted-foreground self-start translate-y-[100%]" />

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <p className="font-medium">SubstackSync</p>
              <TooltipProvider>
                <Tooltip delayDuration={50}>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          integrationStatus.gmailConnected &&
                            integrationStatus.kitConnected
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        )}
                      ></div>
                      <span
                        className={cn(
                          "text-sm",
                          integrationStatus.gmailConnected &&
                            integrationStatus.kitConnected
                            ? "text-green-600"
                            : "text-yellow-600"
                        )}
                      >
                        {integrationStatus.gmailConnected &&
                        integrationStatus.kitConnected
                          ? "Listening"
                          : "Waiting"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {integrationStatus.gmailConnected &&
                    integrationStatus.kitConnected
                      ? "Listening to new emails from Substack"
                      : "Connect Gmail and Kit to start syncing"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show TagsManager when Kit is connected */}
      {integrationStatus.kitConnected && <TagsManager className={className} />}
    </div>
  );
};
