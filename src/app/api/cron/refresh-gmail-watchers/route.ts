import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startGmailWatch } from "@/lib/gmail/watch";
import loggerServer from "@/loggerServer";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel cron request
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    loggerServer.debug(
      `[REFRESH-GMAIL-WATCHERS] Starting Gmail watcher refresh cron job...`
    );

    // Find all users with Gmail integrations that are currently watching
    const gmailIntegrations = await prisma.gmailIntegration.findMany({
      where: {
        isWatching: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    loggerServer.debug(
      `[REFRESH-GMAIL-WATCHERS] Found ${gmailIntegrations.length} users with active Gmail watchers`
    );

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Refresh watchers for each user
    for (const integration of gmailIntegrations) {
      try {
        loggerServer.debug(
          `[REFRESH-GMAIL-WATCHERS] Refreshing Gmail watcher for user: ${integration.user.email}`
        );

        // Use the existing startGmailWatch function with stopCurrentWatch option
        await startGmailWatch(integration.userId, { stopCurrentWatch: true });

        successCount++;
        loggerServer.debug(
          `[REFRESH-GMAIL-WATCHERS] Successfully refreshed watcher for user: ${integration.user.email}`
        );
      } catch (error) {
        errorCount++;
        const errorMessage = `Failed to refresh watcher for user ${
          integration.user.email
        }: ${error instanceof Error ? error.message : "Unknown error"}`;
        errors.push(errorMessage);
        loggerServer.error(errorMessage, { error, userId: integration.userId });

        // Update the integration to mark it as not watching if there's an error
        try {
          await prisma.gmailIntegration.update({
            where: { userId: integration.userId },
            data: { isWatching: false },
          });
        } catch (updateError) {
          loggerServer.error(
            `[REFRESH-GMAIL-WATCHERS] Failed to update integration status for user ${integration.user.email}:`,
            { updateError, userId: integration.userId }
          );
        }
      }
    }

    const result = {
      success: true,
      message: "Gmail watcher refresh completed",
      totalUsers: gmailIntegrations.length,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    };

    loggerServer.debug(
      `[REFRESH-GMAIL-WATCHERS] Gmail watcher refresh cron job completed:`,
      { ...result, userId: "cron" }
    );

    return NextResponse.json(result);
  } catch (error) {
    loggerServer.error(
      `[REFRESH-GMAIL-WATCHERS] Gmail watcher refresh cron job failed:`,
      { error, userId: "cron" }
    );

    return NextResponse.json(
      {
        success: false,
        error: "Cron job failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
