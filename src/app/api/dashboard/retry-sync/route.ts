import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { KitService } from "@/lib/kit/service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriberLogId } = await request.json();

    if (!subscriberLogId) {
      return NextResponse.json(
        { error: "Subscriber log ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        kitIntegration: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.kitIntegration) {
      return NextResponse.json(
        { error: "ConvertKit integration not configured" },
        { status: 400 }
      );
    }

    // Get the subscriber log
    const subscriberLog = await prisma.subscriberLog.findFirst({
      where: {
        id: subscriberLogId,
        userId: user.id,
      },
    });

    if (!subscriberLog) {
      return NextResponse.json(
        { error: "Subscriber log not found" },
        { status: 404 }
      );
    }

    if (subscriberLog.addedToKit) {
      return NextResponse.json(
        { error: "Subscriber already added to ConvertKit" },
        { status: 400 }
      );
    }

    // Here you would implement the actual ConvertKit API call
    // For now, we'll simulate a successful retry
    try {
      // TODO: Implement actual ConvertKit API call
      const kitService = new KitService(user.kitIntegration.apiKey);
      const result = await kitService.addSubscriber({
        email: subscriberLog.subscriberEmail,
        name: subscriberLog.subscriberName || "",
      });

      if (!result) {
        return NextResponse.json(
          { error: "Failed to add subscriber to ConvertKit" },
          { status: 500 }
        );
      }

      // Simulate successful retry
      const updatedLog = await prisma.subscriberLog.update({
        where: { id: subscriberLogId },
        data: {
          addedToKit: true,
          kitSubscriberId: result.id.toString(),
          processedAt: new Date(),
          error: null,
        },
      });

      return NextResponse.json({
        success: true,
        subscriberLogId,
        addedToKit: updatedLog.addedToKit,
        kitSubscriberId: updatedLog.kitSubscriberId,
        processedAt: updatedLog.processedAt,
        error: updatedLog.error,
      });
    } catch (error) {
      // Update the log with the error
      const updatedLog = await prisma.subscriberLog.update({
        where: { id: subscriberLogId },
        data: {
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      });

      return NextResponse.json(
        {
          success: false,
          subscriberLogId,
          addedToKit: updatedLog.addedToKit,
          error: updatedLog.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Retry sync API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
