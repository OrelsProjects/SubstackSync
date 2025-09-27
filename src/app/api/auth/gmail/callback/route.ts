import { NextRequest, NextResponse } from "next/server";
import { getTokensFromCode } from "@/lib/gmail/oauth";
import { prisma } from "@/lib/prisma";
import { GmailService } from "@/lib/gmail/service";
import { google } from "googleapis";
import { getUserById } from "@/utils/dal/user";
import { startGmailWatch, stopGmailWatch } from "@/lib/gmail/watch";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/home?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/home?error=missing_parameters", request.url)
      );
    }

    // Decode state to get userId
    const stateData = JSON.parse(
      Buffer.from(state, "base64").toString("utf-8")
    );
    const userId = stateData.userId;

    if (!userId) {
      return NextResponse.redirect(
        new URL("/home?error=invalid_state", request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL("/home?error=no_refresh_token", request.url)
      );
    }

    // Get user email from Google
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_AUTH_CLIENT_ID,
      process.env.GOOGLE_AUTH_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/gmail/callback`
    );
    oauth2Client.setCredentials(tokens);

    const user = await getUserById(userId);
    if (!user || !user.email) {
      return NextResponse.redirect(
        new URL("/home?error=user_not_found", request.url)
      );
    }
    // Save or update Gmail integration
    await prisma.gmailIntegration.upsert({
      where: { userId },
      update: {
        email: user.email,
        refreshToken: tokens.refresh_token,
        updatedAt: new Date(),
      },
      create: {
        userId,
        email: user.email,
        refreshToken: tokens.refresh_token,
      },
    });

    // Set up Gmail watch
    try {
      await startGmailWatch(userId, { stopCurrentWatch: true });
    } catch (watchError) {
      console.error("Failed to setup Gmail watch:", watchError);
      // Continue anyway - we can retry later
    }

    return NextResponse.redirect(
      new URL("/home?success=gmail_connected", request.url)
    );
  } catch (error: any) {
    console.error("Gmail callback error:", error);
    return NextResponse.redirect(
      new URL(`/home?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
