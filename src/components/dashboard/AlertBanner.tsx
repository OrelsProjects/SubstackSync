"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AlertBannerProps {
  message: string;
  onFix?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const AlertBanner = ({ message, onFix, onDismiss, className }: AlertBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-16 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
          <p className="text-sm text-yellow-800">{message}</p>
        </div>
        <div className="flex items-center space-x-2">
          {onFix && (
            <Button
              size="sm"
              variant="outline"
              className="text-yellow-800 border-yellow-400 hover:bg-yellow-100"
              onClick={onFix}
            >
              Fix Now →
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            ×
          </Button>
        </div>
      </div>
    </div>
  );
};
