import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getGmailOAuthClient } from "./oauth";
import { google } from "googleapis";
import { GmailService } from "@/lib/gmail/service";

export async function startGmailWatch(userId: string, options: {
    stopCurrentWatch?: boolean;
} = {}) {
  if (options.stopCurrentWatch) {
    await stopGmailWatch(userId);
  }
  const gmailService = new GmailService(userId);
  await gmailService.initialize();
  await gmailService.setupWatch();
  await prisma.gmailIntegration.update({
    where: { userId: userId },
    data: { isWatching: true },
  });
}

export async function stopGmailWatch(userId: string) {
  const integration = await prisma.gmailIntegration.findUnique({
    where: { userId: userId },
  });

  if (!integration || !integration.refreshToken) {
    return NextResponse.json(
      { error: "No refresh token found for user" },
      { status: 400 }
    );
  }

  const oauth2Client = getGmailOAuthClient();
  oauth2Client.setCredentials({
    refresh_token: integration.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  await gmail.users.stop({ userId: "me" });
  await prisma.gmailIntegration.update({
    where: { userId: userId },
    data: { isWatching: false },
  });
}
