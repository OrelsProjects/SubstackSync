'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink } from 'lucide-react';
import { UpdateWithPlacement } from '@/lib/updates/placements';
import { UpdateEvent } from '@/lib/validations/updates';
import { cn } from '@/lib/utils';

interface UpdateBannerProps {
  update: UpdateWithPlacement;
  isVisible: boolean;
  onClose: () => void;
  onEvent: (updateId: string, event: UpdateEvent, meta?: Record<string, any>) => Promise<void>;
  position?: 'top' | 'bottom';
  variant?: 'default' | 'announcement' | 'warning';
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({
  update,
  isVisible,
  onClose,
  onEvent,
  position = 'top',
  variant = 'default',
}) => {
  const [hasRecordedSeen, setHasRecordedSeen] = useState(false);

  useEffect(() => {
    if (isVisible && update && !hasRecordedSeen) {
      onEvent(update.id, 'SEEN');
      setHasRecordedSeen(true);
    }
  }, [isVisible, update, onEvent, hasRecordedSeen]);

  const handleDismiss = () => {
    onEvent(update.id, 'DISMISSED');
    onClose();
  };

  const handleCtaClick = async (isSecondary = false) => {
    const event = isSecondary ? 'SECONDARY_CTA_CLICK' : 'CTA_CLICK';
    await onEvent(update.id, event);
    
    if (isSecondary && update.secondaryCtaUrl) {
      window.open(update.secondaryCtaUrl, '_blank');
    } else if (update.ctaUrl) {
      window.open(update.ctaUrl, '_blank');
    }
    
    onClose();
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'announcement':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-background border-border';
    }
  };

  const getPositionClasses = () => {
    const base = 'fixed left-0 right-0 z-40 transition-all duration-300 ease-in-out border-b';
    
    if (!isVisible) {
      return position === 'top'
        ? `${base} top-0 -translate-y-full opacity-0`
        : `${base} bottom-0 translate-y-full opacity-0`;
    }

    return position === 'top'
      ? `${base} top-0 translate-y-0 opacity-100`
      : `${base} bottom-0 translate-y-0 opacity-100`;
  };

  if (!update) return null;

  return (
    <div className={cn(getPositionClasses(), getVariantClasses())}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {update.label && (
              <Badge 
                variant="secondary" 
                className="shrink-0 text-xs"
              >
                {update.label}
              </Badge>
            )}
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm truncate">
                  {update.title}
                </h3>
                {update.summaryTitle && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    • {update.summaryTitle}
                  </span>
                )}
              </div>
              
              {update.summary && (
                <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                  {update.summary}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {update.ctaText && (
              <Button
                onClick={() => handleCtaClick(false)}
                size="sm"
                className="text-xs h-8 hidden sm:flex"
              >
                {update.ctaText}
                {update.ctaUrl && <ExternalLink className="h-3 w-3 ml-1" />}
              </Button>
            )}
            
            {update.secondaryCtaText && (
              <Button
                variant="outline"
                onClick={() => handleCtaClick(true)}
                size="sm"
                className="text-xs h-8 hidden md:flex"
              >
                {update.secondaryCtaText}
                {update.secondaryCtaUrl && <ExternalLink className="h-3 w-3 ml-1" />}
              </Button>
            )}

            {/* Mobile CTA */}
            {(update.ctaText || update.secondaryCtaText) && (
              <Button
                onClick={() => handleCtaClick(false)}
                size="sm"
                className="text-xs h-8 sm:hidden"
              >
                {update.ctaText || update.secondaryCtaText}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8 shrink-0"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile content */}
        <div className="sm:hidden mt-2 space-y-2">
          {update.summaryTitle && (
            <p className="text-xs text-muted-foreground">
              {update.summaryTitle}
            </p>
          )}
          
          {update.summary && (
            <p className="text-xs text-muted-foreground">
              {update.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
