import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GmailService } from "@/lib/gmail/service";
import { SubstackEmailParser } from "@/lib/gmail/parser";
import { KitService } from "@/lib/kit/service";

interface PubSubMessage {
  message: {
    data: string;
    messageId: string;
    publishTime: string;
  };
  subscription: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PubSubMessage = await request.json();

    // Decode the Pub/Sub message
    const decodedData = Buffer.from(body.message.data, "base64").toString(
      "utf-8"
    );
    const notification = JSON.parse(decodedData);

    // Gmail sends notifications with emailAddress and historyId
    const { emailAddress, historyId } = notification;

    if (!emailAddress || !historyId) {
      console.error("Invalid notification data:", notification);
      return NextResponse.json(
        { error: "Invalid notification" },
        { status: 400 }
      );
    }

    // Find the user by Gmail email
    const gmailIntegration = await prisma.gmailIntegration.findFirst({
      where: { email: emailAddress },
      include: { user: true },
    });

    if (!gmailIntegration) {
      console.error("No Gmail integration found for:", emailAddress);
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 200 }
      );
    }

    // Process the history changes
    processGmailHistory(gmailIntegration.userId, historyId);

    return NextResponse.json({ success: true });

    // Acknowledge the message
  } catch (error: any) {
    console.error("Gmail webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

async function processGmailHistory(userId: string, historyId: string) {
  try {
    const gmailService = new GmailService(userId);
    await gmailService.initialize();

    // Get the stored history ID
    const integration = await prisma.gmailIntegration.findUnique({
      where: { userId },
    });

    if (!integration?.historyId) {
      console.error("No stored history ID for user:", userId);
      return;
    }

    // Get history changes
    const history = await gmailService.getHistory(integration.historyId);
    // Update the history ID
    if (history.historyId) {
      await prisma.gmailIntegration.update({
        where: { userId },
        data: { historyId: history.historyId },
      });
    }

    if (!history.history) {
      // No new messages
      return;
    }

    // Process new messages
    for (const historyRecord of history.history) {
      if (historyRecord.messagesAdded) {
        for (const messageAdded of historyRecord.messagesAdded) {
          const messageId = messageAdded.message?.id;
          if (!messageId) continue;

          await processNewMessage(userId, messageId);
        }
      }
    }
  } catch (error) {
    console.error("Error processing Gmail history:", error);
    throw error;
  }
}

async function processNewMessage(userId: string, messageId: string) {
  try {
    const gmailService = new GmailService(userId);
    await gmailService.initialize();

    // Get the full message
    const message = await gmailService.getMessageDetails(messageId);

    // Check if it's a Substack subscriber email
    if (!SubstackEmailParser.isSubstackSubscriberEmail(message)) {
      return;
    }

    // Parse the subscriber information
    const subscriber = SubstackEmailParser.parseSubscriberEmail(message);
    if (!subscriber) {
      console.error("Failed to parse subscriber from message:", messageId);
      return;
    }

    // Log the subscriber
    const subscriberLog = await prisma.subscriberLog.upsert({
      where: { gmailMessageId: messageId },
      create: {
        userId,
        subscriberEmail: subscriber.email,
        subscriberName: subscriber.name,
        subscriptionType: subscriber.isPaid ? "paid" : "free",
        subscriptionPlan: subscriber.plan,
        source: subscriber.source,
        gmailMessageId: messageId,
        rawEmailData: message as any,
      },
      update: {
        userId,
        subscriberEmail: subscriber.email,
        subscriberName: subscriber.name,
        subscriptionType: subscriber.isPaid ? "paid" : "free",
        subscriptionPlan: subscriber.plan,
        source: subscriber.source,
        gmailMessageId: messageId,
        rawEmailData: message as any,
      },
    });

    // Check if Kit integration exists
    const kitIntegration = await prisma.kitIntegration.findUnique({
      where: { userId },
    });

    if (!kitIntegration) {
      console.log("No Kit integration found for user:", userId);
      return;
    }

    const tags = subscriber.isPaid
      ? kitIntegration.paidSubscriberTagIds
      : kitIntegration.freeSubscriberTagIds;

    // Add to Kit
    const kitService = new KitService(kitIntegration.apiKey);
    const result = await kitService.addSubscriber({
      email: subscriber.email,
      name: subscriber.name || "",
    });

    if (result) {
      for (const tag of tags) {
        await kitService.addTagToEmail({ email: subscriber.email, tag: tag });
      }
    }

    // Update the log with the result
    await prisma.subscriberLog.update({
      where: { id: subscriberLog.id },
      data: {
        processedAt: new Date(),
        addedToKit: result ? true : false,
        kitSubscriberId: result ? result.id.toString() : null,
        error: result ? null : "Failed to add subscriber to Kit",
      },
    });

    console.log(`Processed subscriber ${subscriber.email}:`, result);
  } catch (error) {
    console.error("Error processing new message:", error);
    throw error;
  }
}
