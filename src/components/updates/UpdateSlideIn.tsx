'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { X, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { UpdateWithPlacement } from '@/lib/updates/placements';
import { UpdateEvent } from '@/lib/validations/updates';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface UpdateSlideInProps {
  update: UpdateWithPlacement;
  isVisible: boolean;
  onClose: () => void;
  onEvent: (updateId: string, event: UpdateEvent, meta?: Record<string, any>) => Promise<void>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const UpdateSlideIn: React.FC<UpdateSlideInProps> = ({
  update,
  isVisible,
  onClose,
  onEvent,
  position = 'bottom-right',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const getPositionClasses = () => {
    const base = 'fixed z-50 transition-all duration-300 ease-in-out';
    const size = 'w-96 max-w-[calc(100vw-2rem)]';
    
    if (!isVisible) {
      switch (position) {
        case 'bottom-right':
          return `${base} ${size} bottom-4 right-4 translate-y-full opacity-0`;
        case 'bottom-left':
          return `${base} ${size} bottom-4 left-4 translate-y-full opacity-0`;
        case 'top-right':
          return `${base} ${size} top-4 right-4 -translate-y-full opacity-0`;
        case 'top-left':
          return `${base} ${size} top-4 left-4 -translate-y-full opacity-0`;
      }
    }

    switch (position) {
      case 'bottom-right':
        return `${base} ${size} bottom-4 right-4 translate-y-0 opacity-100`;
      case 'bottom-left':
        return `${base} ${size} bottom-4 left-4 translate-y-0 opacity-100`;
      case 'top-right':
        return `${base} ${size} top-4 right-4 translate-y-0 opacity-100`;
      case 'top-left':
        return `${base} ${size} top-4 left-4 translate-y-0 opacity-100`;
      default:
        return `${base} ${size} bottom-4 right-4 translate-y-0 opacity-100`;
    }
  };

  if (!update) return null;

  return (
    <Card className={getPositionClasses()}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            {update.label && (
              <Badge variant="secondary" className="mb-2 text-xs">
                {update.label}
              </Badge>
            )}
            <h3 className="font-semibold text-sm leading-tight">
              {update.title}
            </h3>
            {update.summaryTitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {update.summaryTitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6"
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Summary or Media (always visible) */}
        <div className="space-y-3">
          {update.summary && !isExpanded && (
            <p className="text-sm text-muted-foreground">{update.summary}</p>
          )}

          {update.mediaUrl && (isExpanded || !update.summary) && (
            <div className="relative">
              {update.mediaUrl.includes('.mp4') ? (
                <video
                  src={update.mediaUrl}
                  controls
                  className="w-full rounded-md max-h-32 object-cover"
                  poster={update.mediaAlt}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={update.mediaUrl}
                  alt={update.mediaAlt || update.title}
                  className="w-full rounded-md max-h-32 object-cover"
                />
              )}
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-3">
              <div className="prose prose-xs max-w-none dark:prose-invert max-h-32 overflow-y-auto">
                <ReactMarkdown>{update.bodyJson}</ReactMarkdown>
              </div>

              {/* Tags */}
              {update.tags && update.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {update.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.tag}
                    </Badge>
                  ))}
                  {update.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{update.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {update.ctaText && (
              <Button
                onClick={() => handleCtaClick(false)}
                size="sm"
                className="w-full text-xs h-8"
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
                className="w-full text-xs h-8"
              >
                {update.secondaryCtaText}
                {update.secondaryCtaUrl && <ExternalLink className="h-3 w-3 ml-1" />}
              </Button>
            )}
            
            {!update.ctaText && (
              <Button 
                onClick={handleDismiss} 
                variant="outline" 
                size="sm"
                className="w-full text-xs h-8"
              >
                Got it!
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
