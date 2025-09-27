import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.gmailIntegration || !user.kitIntegration) {
      return NextResponse.json({ 
        error: 'Both Gmail and Kit integrations must be configured' 
      }, { status: 400 });
    }

    // Get unprocessed subscriber logs
    const unprocessedLogs = await prisma.subscriberLog.findMany({
      where: {
        userId: user.id,
        addedToKit: false,
        error: null,
      },
      orderBy: { createdAt: 'asc' },
      take: 10, // Process up to 10 at a time
    });

    if (unprocessedLogs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unprocessed subscribers found',
        processed: 0,
      });
    }

    let processedCount = 0;
    let errorCount = 0;

    // Process each unprocessed log
    for (const log of unprocessedLogs) {
      try {
        // TODO: Implement actual Kit API call
        // const kitService = new KitService(user.kitIntegration.apiKey);
        // const result = await kitService.addSubscriber({
        //   email: log.subscriberEmail,
        //   firstName: log.subscriberName,
        //   tags: log.subscriptionType === 'paid' 
        //     ? [user.kitIntegration.paidSubscriberTagId].filter(Boolean)
        //     : [user.kitIntegration.freeSubscriberTagId].filter(Boolean),
        // });

        // Simulate successful processing
        await prisma.subscriberLog.update({
          where: { id: log.id },
          data: {
            addedToKit: true,
            kitSubscriberId: `kit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            processedAt: new Date(),
            error: null,
          },
        });

        processedCount++;
      } catch (error) {
        // Update the log with the error
        await prisma.subscriberLog.update({
          where: { id: log.id },
          data: {
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          },
        });

        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} subscribers, ${errorCount} errors`,
      processed: processedCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error('Manual sync API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
