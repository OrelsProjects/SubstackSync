import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardData, DashboardMetrics, RecentActivity, IntegrationStatus, SyncStatus } from '@/types/dashboard';
import { RootState } from '@/lib/store';

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setData: (state, action: PayloadAction<DashboardData>) => {
      state.data = action.payload;
      state.lastUpdated = new Date();
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      if (state.data) {
        state.data.metrics = action.payload;
      }
    },
    updateRecentActivity: (state, action: PayloadAction<RecentActivity[]>) => {
      if (state.data) {
        state.data.recentActivity = action.payload;
      }
    },
    updateIntegrationStatus: (state, action: PayloadAction<IntegrationStatus>) => {
      if (state.data) {
        state.data.integrationStatus = action.payload;
      }
    },
    updateSyncStatus: (state, action: PayloadAction<SyncStatus>) => {
      if (state.data) {
        state.data.syncStatus = action.payload;
      }
    },
    updateActivityItem: (state, action: PayloadAction<{ id: string; updates: Partial<RecentActivity> }>) => {
      if (state.data) {
        const activity = state.data.recentActivity.find(item => item.id === action.payload.id);
        if (activity) {
          Object.assign(activity, action.payload.updates);
        }
      }
    },
    resetDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const {
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
} = dashboardSlice.actions;

export const selectDashboard = (state: RootState): DashboardState => state.dashboard;

export default dashboardSlice.reducer;
