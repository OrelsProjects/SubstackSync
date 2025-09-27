// Dashboard types based on Prisma schema
export interface DashboardMetrics {
  totalSynced: number;
  thisMonth: number;
  failures: number;
  syncedToday: number;
  lastSyncTime: Date | null;
}

export interface RecentActivity {
  id: string;
  subscriberEmail: string;
  subscriberName: string | null;
  subscriptionType: string;
  subscriptionPlan: string | null;
  source: string | null;
  processedAt: Date | null;
  addedToKit: boolean;
  kitSubscriberId: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationStatus {
  gmailConnected: boolean;
  kitConnected: boolean;
  gmailWatchExpiry: Date | null;
}

export interface SyncStatus {
  status: "connected" | "error" | "warning";
  lastSync: string;
  syncedToday: number;
}

export interface UpcomingIntegration {
  name: string;
  initials: string;
  color: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: RecentActivity[];
  integrationStatus: IntegrationStatus;
  syncStatus: SyncStatus;
  upcomingIntegrations: UpcomingIntegration[];
}
