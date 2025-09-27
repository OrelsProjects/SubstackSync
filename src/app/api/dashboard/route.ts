import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { DashboardData } from '@/types/dashboard';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        gmailIntegration: true,
        kitIntegration: true,
        subscriberLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate metrics
    const totalSynced = await prisma.subscriberLog.count({
      where: { userId: user.id, addedToKit: true },
    });

    const thisMonth = await prisma.subscriberLog.count({
      where: {
        userId: user.id,
        addedToKit: true,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const failures = await prisma.subscriberLog.count({
      where: { userId: user.id, error: { not: null } },
    });

    const syncedToday = await prisma.subscriberLog.count({
      where: {
        userId: user.id,
        addedToKit: true,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const lastSyncLog = await prisma.subscriberLog.findFirst({
      where: { userId: user.id, processedAt: { not: null } },
      orderBy: { processedAt: 'desc' },
    });

    // Determine sync status
    let syncStatus: "connected" | "error" | "warning" = "error";
    let lastSync = "Never";
    
    if (user.gmailIntegration && user.kitIntegration) {
      syncStatus = "connected";
      if (lastSyncLog?.processedAt) {
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - lastSyncLog.processedAt.getTime()) / (1000 * 60));
        
        if (diffMinutes < 60) {
          lastSync = `${diffMinutes} minutes ago`;
        } else if (diffMinutes < 1440) {
          const hours = Math.floor(diffMinutes / 60);
          lastSync = `${hours} hours ago`;
        } else {
          const days = Math.floor(diffMinutes / 1440);
          lastSync = `${days} days ago`;
        }
      }
    } else if (user.gmailIntegration || user.kitIntegration) {
      syncStatus = "warning";
    }

    // Check for token expiry warnings
    if (user.gmailIntegration?.watchExpiry) {
      const daysUntilExpiry = Math.floor(
        (user.gmailIntegration.watchExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilExpiry <= 7) {
        syncStatus = "warning";
      }
    }

    const dashboardData: DashboardData = {
      metrics: {
        totalSynced,
        thisMonth,
        failures,
        syncedToday,
        lastSyncTime: lastSyncLog?.processedAt || null,
      },
      recentActivity: user.subscriberLogs.map(log => ({
        id: log.id,
        subscriberEmail: log.subscriberEmail,
        subscriberName: log.subscriberName,
        subscriptionType: log.subscriptionType,
        subscriptionPlan: log.subscriptionPlan,
        source: log.source,
        processedAt: log.processedAt,
        addedToKit: log.addedToKit,
        kitSubscriberId: log.kitSubscriberId,
        error: log.error,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
      })),
      integrationStatus: {
        gmailConnected: !!user.gmailIntegration?.isWatching,
        kitConnected: !!user.kitIntegration,
        gmailWatchExpiry: user.gmailIntegration?.watchExpiry || null,
      },
      syncStatus: {
        status: syncStatus,
        lastSync,
        syncedToday,
      },
      upcomingIntegrations: [
        { name: "ActiveCampaign", initials: "AC", color: "bg-pink-500" },
        { name: "Drip", initials: "DR", color: "bg-red-500" },
      ],
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
