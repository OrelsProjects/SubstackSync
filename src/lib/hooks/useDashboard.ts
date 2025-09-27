import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { RootState } from "@/lib/store";
import {
  setLoading,
  setError,
  setData,
  clearError,
  updateMetrics,
  updateRecentActivity,
  updateIntegrationStatus,
  updateSyncStatus,
  updateActivityItem,
  resetDashboard,
  selectDashboard,
} from "@/lib/features/dashboard/dashboardSlice";
import {
  DashboardData,
  DashboardMetrics,
  RecentActivity,
  IntegrationStatus,
  SyncStatus,
} from "@/types/dashboard";

export const useDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error, lastUpdated } = useSelector(selectDashboard);

  // Fetch dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const dashboardData = await response.json();
      dispatch(setData(dashboardData));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Retry failed sync
  const retrySync = useCallback(
    async (subscriberLogId: string) => {
      try {
        dispatch(setLoading(true));

        const response = await fetch("/api/dashboard/retry-sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscriberLogId }),
        });

        if (!response.ok) {
          throw new Error("Failed to retry sync");
        }

        const result = await response.json();

        // Update the specific activity item
        dispatch(
          updateActivityItem({
            id: subscriberLogId,
            updates: {
              addedToKit: result.addedToKit,
              error: result.error,
              processedAt: result.processedAt,
            },
          })
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Trigger manual sync
  const syncNow = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await fetch("/api/dashboard/manual-sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to trigger manual sync");
      }

      const result = await response.json();

      // Refresh dashboard data after manual sync
      await loadDashboardData();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, loadDashboardData]);

  // Connect ConvertKit
  const connectKit = useCallback(
    async (apiKey: string, apiSecret?: string) => {
      try {
        dispatch(setLoading(true));

        const response = await fetch("/api/kit/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiKey, apiSecret }),
        });

        if (!response.ok) {
          throw new Error("Failed to connect ConvertKit");
        }

        const result = await response.json();

        // Refresh dashboard data after connection
        await loadDashboardData();

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        dispatch(setError(errorMessage));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, loadDashboardData]
  );

  // Clear error
  const clearDashboardError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Update specific data
  const updateDashboardMetrics = useCallback(
    (metrics: DashboardMetrics) => {
      dispatch(updateMetrics(metrics));
    },
    [dispatch]
  );

  const updateDashboardRecentActivity = useCallback(
    (activity: RecentActivity[]) => {
      dispatch(updateRecentActivity(activity));
    },
    [dispatch]
  );

  const updateDashboardIntegrationStatus = useCallback(
    (status: IntegrationStatus) => {
      dispatch(updateIntegrationStatus(status));
    },
    [dispatch]
  );

  const updateDashboardSyncStatus = useCallback(
    (status: SyncStatus) => {
      dispatch(updateSyncStatus(status));
    },
    [dispatch]
  );

  // Reset dashboard
  const resetDashboardData = useCallback(() => {
    dispatch(resetDashboard());
  }, [dispatch]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    loadDashboardData,
    retrySync,
    syncNow,
    connectKit,
    clearError: clearDashboardError,
    updateMetrics: updateDashboardMetrics,
    updateRecentActivity: updateDashboardRecentActivity,
    updateIntegrationStatus: updateDashboardIntegrationStatus,
    updateSyncStatus: updateDashboardSyncStatus,
    resetDashboard: resetDashboardData,
  };
};

// Hook for recent activity with retry logic
export const useRecentActivity = () => {
  const { data, retrySync } = useDashboard();

  const recentActivity = data?.recentActivity || [];

  const handleRetrySync = useCallback(
    (subscriberLogId: string) => {
      retrySync(subscriberLogId);
    },
    [retrySync]
  );

  const canRetry = useCallback((activity: RecentActivity) => {
    return !activity.addedToKit;
  }, []);

  return {
    recentActivity,
    handleRetrySync,
    canRetry,
  };
};

// Hook for metrics
export const useDashboardMetrics = () => {
  const { data } = useDashboard();

  return {
    metrics: data?.metrics || {
      totalSynced: 0,
      thisMonth: 0,
      failures: 0,
      syncedToday: 0,
      lastSyncTime: null,
    },
  };
};

// Hook for integration status
export const useIntegrationStatus = () => {
  const { data } = useDashboard();

  return {
    integrationStatus: data?.integrationStatus || {
      gmailConnected: false,
      kitConnected: false,
      gmailWatchExpiry: null,
    },
  };
};

// Hook for sync status
export const useSyncStatus = () => {
  const { data } = useDashboard();

  return {
    syncStatus: data?.syncStatus || {
      status: "error" as const,
      lastSync: "Never",
      syncedToday: 0,
    },
  };
};
