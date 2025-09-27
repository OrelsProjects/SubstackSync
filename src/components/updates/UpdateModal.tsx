'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink } from 'lucide-react';
import { UpdateWithPlacement } from '@/lib/updates/placements';
import { UpdateEvent } from '@/lib/validations/updates';
import ReactMarkdown from 'react-markdown';

interface UpdateModalProps {
  update: UpdateWithPlacement;
  isOpen: boolean;
  onClose: () => void;
  onEvent: (updateId: string, event: UpdateEvent, meta?: Record<string, any>) => Promise<void>;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  update,
  isOpen,
  onClose,
  onEvent,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && update) {
      setIsVisible(true);
      // Record seen event
      onEvent(update.id, 'SEEN');
    }
  }, [isOpen, update, onEvent]);

  const handleDismiss = () => {
    onEvent(update.id, 'DISMISSED');
    setIsVisible(false);
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
    
    setIsVisible(false);
    onClose();
  };

  if (!update || !isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={handleDismiss}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              {update.label && (
                <Badge variant="secondary" className="mb-2">
                  {update.label}
                </Badge>
              )}
              <DialogTitle className="text-xl font-bold text-left">
                {update.title}
              </DialogTitle>
              {update.summaryTitle && (
                <p className="text-muted-foreground mt-1">{update.summaryTitle}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Media */}
          {update.mediaUrl && (
            <div className="relative">
              {update.mediaUrl.includes('.mp4') ? (
                <video
                  src={update.mediaUrl}
                  controls
                  className="w-full rounded-lg"
                  poster={update.mediaAlt}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={update.mediaUrl}
                  alt={update.mediaAlt || update.title}
                  className="w-full rounded-lg object-cover"
                />
              )}
            </div>
          )}

          {/* Body Content */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{update.bodyJson}</ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {update.ctaText && (
              <Button
                onClick={() => handleCtaClick(false)}
                className="flex items-center gap-2"
                size="lg"
              >
                {update.ctaText}
                {update.ctaUrl && <ExternalLink className="h-4 w-4" />}
              </Button>
            )}
            
            {update.secondaryCtaText && (
              <Button
                variant="outline"
                onClick={() => handleCtaClick(true)}
                className="flex items-center gap-2"
                size="lg"
              >
                {update.secondaryCtaText}
                {update.secondaryCtaUrl && <ExternalLink className="h-4 w-4" />}
              </Button>
            )}
            
            {!update.ctaText && (
              <Button onClick={handleDismiss} variant="outline" size="lg">
                Got it, thanks!
              </Button>
            )}
          </div>

          {/* Tags */}
          {update.tags && update.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {update.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
