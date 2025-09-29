import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { prisma } from "@/lib/prisma";
import loggerServer from "@/loggerServer";

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: "Email address is required",
        },
        { status: 400 }
      );
    }

    // Verify email matches session
    if (email !== session.user.email) {
      return NextResponse.json(
        {
          error: "Email address does not match your account",
        },
        { status: 400 }
      );
    }

    loggerServer.info(`[DELETE-ACCOUNT] User requesting account deletion`, {
      email,
      userId: session.user.email,
    });

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        gmailIntegration: true,
        kitIntegration: true,
        subscriberLogs: true,
        userMetadata: true,
        Settings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Start transaction to delete all user data
    await prisma.$transaction(async (tx) => {
      // Delete subscriber logs
      if (user.subscriberLogs && user.subscriberLogs.length > 0) {
        await tx.subscriberLog.deleteMany({
          where: { userId: user.id },
        });
        loggerServer.debug(
          `[DELETE-ACCOUNT] Deleted ${user.subscriberLogs.length} subscriber logs`,
          { userId: user.id }
        );
      }

      // Delete Gmail integration
      if (user.gmailIntegration) {
        await tx.gmailIntegration.delete({
          where: { userId: user.id },
        });
        loggerServer.debug(`[DELETE-ACCOUNT] Deleted Gmail integration`, {
          userId: user.id,
        });
      }

      // Delete Kit integration
      if (user.kitIntegration) {
        await tx.kitIntegration.delete({
          where: { userId: user.id },
        });
        loggerServer.debug(`[DELETE-ACCOUNT] Deleted Kit integration`, {
          userId: user.id,
        });
      }

      // Delete user metadata
      if (user.userMetadata) {
        await tx.userMetadata.delete({
          where: { userId: user.id },
        });
        loggerServer.debug(`[DELETE-ACCOUNT] Deleted user metadata`, {
          userId: user.id,
        });
      }

      // Delete settings
      if (user.Settings) {
        await tx.settings.delete({
          where: { userId: user.id },
        });
        loggerServer.debug(`[DELETE-ACCOUNT] Deleted user settings`, {
          userId: user.id,
        });
      }

      // Delete all sessions
      await tx.session.deleteMany({
        where: { userId: user.id },
      });
      loggerServer.debug(`[DELETE-ACCOUNT] Deleted all user sessions`, {
        userId: user.id,
      });

      // Delete all accounts
      await tx.account.deleteMany({
        where: { userId: user.id },
      });
      loggerServer.debug(`[DELETE-ACCOUNT] Deleted all user accounts`, {
        userId: user.id,
      });

      // Delete any authenticators
      await tx.authenticator.deleteMany({
        where: { userId: user.id },
      });
      loggerServer.debug(`[DELETE-ACCOUNT] Deleted all authenticators`, {
        userId: user.id,
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: user.id },
      });
      loggerServer.debug(`[DELETE-ACCOUNT] Deleted user record`, {
        userId: user.id,
      });
    });

    loggerServer.info(`[DELETE-ACCOUNT] Account successfully deleted`, {
      email,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    loggerServer.error(`[DELETE-ACCOUNT] Failed to delete account:`, {
      error,
      email: session?.user?.email,
      userId: session?.user?.id,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete account",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
