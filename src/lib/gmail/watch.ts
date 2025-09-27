import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getGmailOAuthClient } from "./oauth";
import { google } from "googleapis";

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
}
