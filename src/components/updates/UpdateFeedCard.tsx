"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, Calendar, Pin } from "lucide-react";
import { UpdateWithPlacement } from "@/lib/updates/placements";
import { UpdateEvent } from "@/lib/validations/updates";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface UpdateFeedCardProps {
  update: UpdateWithPlacement;
  onEvent: (
    updateId: string,
    event: UpdateEvent,
    meta?: Record<string, any>
  ) => Promise<void>;
  variant?: "default" | "compact" | "featured";
  showActions?: boolean;
  className?: string;
}

export const UpdateFeedCard: React.FC<UpdateFeedCardProps> = ({
  update,
  onEvent,
  variant = "default",
  showActions = true,
  className,
}) => {
  const [hasRecordedSeen, setHasRecordedSeen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(variant === "featured");

  useEffect(() => {
    if (update && !hasRecordedSeen) {
      // Use Intersection Observer to track when card becomes visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasRecordedSeen) {
              onEvent(update.id, "SEEN");
              setHasRecordedSeen(true);
            }
          });
        },
        { threshold: 0.5 }
      );

      const element = document.getElementById(`update-card-${update.id}`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }
  }, [update, onEvent, hasRecordedSeen]);

  const handleCtaClick = async (isSecondary = false) => {
    const event = isSecondary ? "SECONDARY_CTA_CLICK" : "CTA_CLICK";
    await onEvent(update.id, event);

    if (isSecondary && update.secondaryCtaUrl) {
      window.open(update.secondaryCtaUrl, "_blank");
    } else if (update.ctaUrl) {
      window.open(update.ctaUrl, "_blank");
    }
  };

  const getCardContent = () => {
    if (variant === "compact") {
      return (
        <div className="flex items-start gap-3">
          {update.mediaUrl && (
            <div className="shrink-0">
              {update.mediaUrl.includes(".mp4") ? (
                <video
                  src={update.mediaUrl}
                  className="w-16 h-16 rounded-md object-cover"
                  poster={update.mediaAlt}
                />
              ) : (
                <img
                  src={update.mediaUrl}
                  alt={update.mediaAlt || update.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
              )}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {update.label && (
                  <Badge variant="secondary" className="mb-1 text-xs">
                    {update.label}
                  </Badge>
                )}
                <h3 className="font-medium text-sm leading-tight truncate">
                  {update.title}
                </h3>
                {update.summary && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {update.summary}
                  </p>
                )}
              </div>

              {update.currentPlacement.pinned && (
                <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {update.publishAt &&
                  formatDistanceToNow(new Date(update.publishAt), {
                    addSuffix: true,
                  })}
              </div>

              {showActions && update.ctaText && (
                <Button
                  onClick={() => handleCtaClick(false)}
                  size="sm"
                  variant="ghost"
                  className="text-xs h-6 px-2"
                >
                  {update.ctaText}
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {update.label && (
                <Badge variant="secondary" className="text-xs">
                  {update.label}
                </Badge>
              )}
              {update.currentPlacement.pinned && (
                <Pin className="h-3 w-3 text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {update.publishAt &&
                formatDistanceToNow(new Date(update.publishAt), {
                  addSuffix: true,
                })}
            </div>
          </div>

          <h3 className="font-semibold text-lg leading-tight mb-1">
            {update.title}
          </h3>

          {update.summaryTitle && (
            <p className="text-muted-foreground text-sm">{update.summaryTitle}</p>
          )}
        </div>

        {update.mediaUrl && (
          <div className="relative">
            {update.mediaUrl.includes(".mp4") ? (
              <video
                src={update.mediaUrl}
                controls
                className="w-full rounded-lg max-h-64 object-cover"
                poster={update.mediaAlt}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={update.mediaUrl}
                alt={update.mediaAlt || update.title}
                className="w-full rounded-lg max-h-64 object-cover"
              />
            )}
          </div>
        )}

        <div className="space-y-3">
          {isExpanded ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{update.bodyJson.content}</ReactMarkdown>
            </div>
          ) : (
            <div>
              {update.summaryTitle && (
                <p className="text-muted-foreground">{update.summary}</p>
              )}
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(true)}
                className="text-sm p-0 h-auto text-primary hover:bg-transparent"
              >
                Read more
              </Button>
            </div>
          )}

          {showActions && (update.ctaText || update.secondaryCtaText) && (
            <div className="flex flex-col sm:flex-row gap-2">
              {update.ctaText && (
                <Button
                  onClick={() => handleCtaClick(false)}
                  className="flex items-center gap-2"
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
                >
                  {update.secondaryCtaText}
                  {update.secondaryCtaUrl && (
                    <ExternalLink className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          )}

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
      </div>
    );
  };

  return (
    <Card
      id={`update-card-${update.id}`}
      className={cn(
        variant === "featured" && "border-primary/20 bg-primary/5",
        variant === "compact" && "p-3",
        className
      )}
    >
      {variant === "compact" ? (
        <CardContent className="p-0">{getCardContent()}</CardContent>
      ) : (
        <>
          <CardHeader className="pb-4">{getCardContent()}</CardHeader>
        </>
      )}
    </Card>
  );
};
