import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { EligibleUpdates } from '@/lib/updates/placements';
import { UpdateEvent } from '@/lib/validations/updates';

interface UseUpdatesOptions {
  path?: string;
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseUpdatesReturn {
  updates: EligibleUpdates;
  isLoading: boolean;
  error: string | null;
  recordEvent: (updateId: string, event: UpdateEvent, meta?: Record<string, any>) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage eligible updates for the current user and path
 */
export const useUpdates = (options: UseUpdatesOptions = {}): UseUpdatesReturn => {
  const pathname = usePathname();
  const currentPath = options.path || pathname;
  
  const [updates, setUpdates] = useState<EligibleUpdates>({
    modal: [],
    slidein: [],
    banner: [],
    feed: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async () => {
    if (!options.enabled && options.enabled !== undefined) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        path: currentPath,
      });

      const response = await fetch(`/api/updates/eligible?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch updates: ${response.statusText}`);
      }

      const data = await response.json();
      setUpdates(data);
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch updates');
    } finally {
      setIsLoading(false);
    }
  }, [currentPath, options.enabled]);

  const recordEvent = useCallback(async (
    updateId: string, 
    event: UpdateEvent, 
    meta?: Record<string, any>
  ) => {
    try {
      const response = await fetch('/api/updates/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updateId,
          event,
          meta: {
            ...meta,
            path: currentPath,
            timestamp: new Date().toISOString(),
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to record event: ${response.statusText}`);
      }

      // If the event was a dismissal or CTA click, remove the update from current state
      if (event === 'DISMISSED' || event === 'CTA_CLICK') {
        setUpdates(prev => ({
          modal: prev.modal.filter(u => u.id !== updateId),
          slidein: prev.slidein.filter(u => u.id !== updateId),
          banner: prev.banner.filter(u => u.id !== updateId),
          feed: prev.feed.filter(u => u.id !== updateId),
        }));
      }
    } catch (err) {
      console.error('Error recording update event:', err);
      // Don't throw here to avoid breaking the UI
    }
  }, [currentPath]);

  // Fetch updates on mount and when path changes
  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  // Set up refetch interval if specified
  useEffect(() => {
    if (!options.refetchInterval || options.refetchInterval <= 0) {
      return;
    }

    const interval = setInterval(fetchUpdates, options.refetchInterval);
    return () => clearInterval(interval);
  }, [fetchUpdates, options.refetchInterval]);

  return {
    updates,
    isLoading,
    error,
    recordEvent,
    refetch: fetchUpdates,
  };
};

/**
 * Hook specifically for getting the highest priority modal update
 */
export const useModalUpdate = (options: UseUpdatesOptions = {}) => {
  const { updates, isLoading, error, recordEvent } = useUpdates(options);
  
  return {
    update: updates.modal[0] || null,
    isLoading,
    error,
    recordEvent,
  };
};

/**
 * Hook specifically for getting banner updates
 */
export const useBannerUpdate = (options: UseUpdatesOptions = {}) => {
  const { updates, isLoading, error, recordEvent } = useUpdates(options);
  
  return {
    update: updates.banner[0] || null,
    isLoading,
    error,
    recordEvent,
  };
};

/**
 * Hook specifically for getting slide-in updates
 */
export const useSlideInUpdates = (options: UseUpdatesOptions = {}) => {
  const { updates, isLoading, error, recordEvent } = useUpdates(options);
  
  return {
    updates: updates.slidein,
    isLoading,
    error,
    recordEvent,
  };
};

/**
 * Hook specifically for getting feed updates
 */
export const useFeedUpdates = (options: UseUpdatesOptions = {}) => {
  const { updates, isLoading, error, recordEvent } = useUpdates(options);
  
  return {
    updates: updates.feed,
    isLoading,
    error,
    recordEvent,
  };
};
