import { google, gmail_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { getGmailOAuthClient, setCredentials } from "./oauth";

export class GmailService {
  private gmail: gmail_v1.Gmail;
  private oauth2Client: OAuth2Client;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.oauth2Client = getGmailOAuthClient();
    this.gmail = google.gmail({ version: "v1", auth: this.oauth2Client });
  }

  async initialize() {
    const integration = await prisma.gmailIntegration.findUnique({
      where: { userId: this.userId },
    });

    if (!integration) {
      throw new Error("Gmail integration not found");
    }

    // Set the refresh token
    setCredentials(this.oauth2Client, {
      refresh_token: integration.refreshToken,
    });

    this.gmail = google.gmail({ version: "v1", auth: this.oauth2Client });
  }

  async setupWatch() {
    const topicName = `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/topics/${process.env.GMAIL_PUBSUB_TOPIC}`;

    const res = await this.gmail.users.watch({
      userId: "me",
      requestBody: {
        topicName,
      },
    });

    if (!res.data.historyId || !res.data.expiration) {
      throw new Error("Failed to setup Gmail watch");
    }

    // Update the watch expiry in database
    await prisma.gmailIntegration.update({
      where: { userId: this.userId },
      data: {
        historyId: res.data.historyId,
        watchExpiry: new Date(parseInt(res.data.expiration)),
      },
    });

    return res.data;
  }

  async getMessageDetails(messageId: string) {
    const res = await this.gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    return res.data;
  }

  async getHistory(startHistoryId: string) {
    const res = await this.gmail.users.history.list({
      userId: "me",
      startHistoryId,
      historyTypes: ["messageAdded"],
    });

    return res.data;
  }

  async getMessagesByQuery(query: string, maxResults: number = 10) {
    const res = await this.gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults,
    });

    return res.data.messages || [];
  }

  async renewWatchIfNeeded() {
    const integration = await prisma.gmailIntegration.findUnique({
      where: { userId: this.userId },
    });

    if (!integration?.watchExpiry) {
      await this.setupWatch();
      return;
    }

    // Renew if expiring within 24 hours
    const expiryThreshold = new Date();
    expiryThreshold.setHours(expiryThreshold.getHours() + 24);

    if (integration.watchExpiry < expiryThreshold) {
      await this.setupWatch();
    }
  }
}
