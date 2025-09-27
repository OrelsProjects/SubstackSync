'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Monitor, Smartphone, Moon, Sun } from 'lucide-react';
import { UpdateWithPlacement } from '@/lib/updates/placements';
import { UpdateModal } from './UpdateModal';
import { UpdateSlideIn } from './UpdateSlideIn';
import { UpdateBanner } from './UpdateBanner';
import { UpdateFeedCard } from './UpdateFeedCard';
import { cn } from '@/lib/utils';

interface UpdatePreviewProps {
  update: Partial<UpdateWithPlacement>;
  className?: string;
}

export const UpdatePreview: React.FC<UpdatePreviewProps> = ({
  update,
  className,
}) => {
  const [selectedPlacement, setSelectedPlacement] = useState<string>('MODAL');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSlideIn, setShowSlideIn] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Create a mock update with placement for preview
  const mockUpdate: UpdateWithPlacement = {
    id: 'preview',
    title: update.title || 'Preview Title',
    summaryTitle: update.summaryTitle,
    label: update.label,
    summary: update.summary,
    bodyJson: update.bodyJson || 'Preview content',
    mediaUrl: update.mediaUrl,
    mediaAlt: update.mediaAlt,
    ctaText: update.ctaText,
    ctaUrl: update.ctaUrl,
    secondaryCtaText: update.secondaryCtaText,
    secondaryCtaUrl: update.secondaryCtaUrl,
    publishAt: new Date(),
    tags: update.tags || [],
    currentPlacement: {
      kind: selectedPlacement as any,
      priority: 100,
      showOnce: true,
      pinned: false,
    }
  };

  const mockEvent = async () => {
    // Mock event handler for preview
  };

  const placements = [
    { id: 'MODAL', label: 'Modal' },
    { id: 'SLIDEIN', label: 'Slide-in' },
    { id: 'BANNER', label: 'Banner' },
    { id: 'FEED_CARD', label: 'Feed Card' },
  ];

  const renderPreview = () => {
    switch (selectedPlacement) {
      case 'MODAL':
        return (
          <div className="relative">
            <div className="p-4 text-center">
              <Button onClick={() => setShowModal(true)}>
                Show Modal Preview
              </Button>
            </div>
            <UpdateModal
              update={mockUpdate}
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onEvent={mockEvent}
            />
          </div>
        );
        
      case 'SLIDEIN':
        return (
          <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden">
            <div className="p-4">
              <Button onClick={() => setShowSlideIn(true)}>
                Show Slide-in Preview
              </Button>
            </div>
            <UpdateSlideIn
              update={mockUpdate}
              isVisible={showSlideIn}
              onClose={() => setShowSlideIn(false)}
              onEvent={mockEvent}
              position="bottom-right"
            />
          </div>
        );
        
      case 'BANNER':
        return (
          <div className="relative">
            <div className="p-4 text-center">
              <Button onClick={() => setShowBanner(true)}>
                Show Banner Preview
              </Button>
            </div>
            <UpdateBanner
              update={mockUpdate}
              isVisible={showBanner}
              onClose={() => setShowBanner(false)}
              onEvent={mockEvent}
              position="top"
            />
          </div>
        );
        
      case 'FEED_CARD':
        return (
          <div className="space-y-4">
            <UpdateFeedCard
              update={mockUpdate}
              onEvent={mockEvent}
              variant="featured"
            />
            <UpdateFeedCard
              update={mockUpdate}
              onEvent={mockEvent}
              variant="default"
            />
            <UpdateFeedCard
              update={mockUpdate}
              onEvent={mockEvent}
              variant="compact"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Preview</h3>
          
          <div className="flex items-center gap-2">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {placements.map((placement) => (
            <Badge
              key={placement.id}
              variant={selectedPlacement === placement.id ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedPlacement(placement.id)}
            >
              {placement.label}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div 
          className={cn(
            'border rounded-lg transition-all duration-200',
            deviceMode === 'mobile' && 'max-w-sm mx-auto',
            darkMode && 'dark bg-background'
          )}
        >
          {renderPreview()}
        </div>
        
        {/* Preview Context Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Preview Context</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Placement: {selectedPlacement}</p>
            <p>Device: {deviceMode}</p>
            <p>Theme: {darkMode ? 'Dark' : 'Light'}</p>
            <p className="text-yellow-600">
              ⚠️ This is a preview. Actual behavior may vary based on user targeting and placement rules.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
