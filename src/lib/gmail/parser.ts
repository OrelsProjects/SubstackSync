import { gmail_v1 } from "googleapis";
import * as cheerio from "cheerio";

export interface SubstackSubscriber {
  email: string;
  name?: string;
  isPaid: boolean;
  plan?: string;
  source?: string;
  newsletterName?: string;
}

export class SubstackEmailParser {
  private static decodeBase64(data: string): string {
    return Buffer.from(
      data.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8");
  }

  private static getEmailBody(message: gmail_v1.Schema$Message): string | null {
    const payload = message.payload;
    if (!payload) return null;

    // Check for HTML body
    let htmlBody = "";

    const findHtmlPart = (part: gmail_v1.Schema$MessagePart): string => {
      if (part.mimeType === "text/html" && part.body?.data) {
        return this.decodeBase64(part.body.data);
      }

      if (part.parts) {
        for (const subPart of part.parts) {
          const html = findHtmlPart(subPart);
          if (html) return html;
        }
      }

      return "";
    };

    htmlBody = findHtmlPart(payload);
    return htmlBody || null;
  }

  private static getEmailHeader(
    message: gmail_v1.Schema$Message,
    headerName: string
  ): string | null {
    const headers = message.payload?.headers || [];
    const header = headers.find(
      (h) => h.name?.toLowerCase() === headerName.toLowerCase()
    );
    return header?.value || null;
  }

  static isSubstackSubscriberEmail(message: gmail_v1.Schema$Message): boolean {
    const from = this.getEmailHeader(message, "from");
    const subject = this.getEmailHeader(message, "subject");

    // Check if email is from Substack
    if (!from?.includes("substack.com")) return false;
    return true;
  }

  static parseSubscriberEmail(
    message: gmail_v1.Schema$Message
  ): SubstackSubscriber | null {
    const body = this.getEmailBody(message);
    if (!body) return null;

    const $ = cheerio.load(body);
    const subscriber: SubstackSubscriber = {
      email: "",
      isPaid: false,
    };

    // Check if it's a paid subscriber
    const isPaidSubscriber =
      body.includes("New paid subscriber") ||
      $('h2:contains("New paid subscriber")').length > 0;
    subscriber.isPaid = isPaidSubscriber;

    // Extract newsletter name from subject
    const subject = this.getEmailHeader(message, "subject");
    if (subject) {
      const match = subject.match(/to (.+?)(?:\s*!)?$/);
      if (match) {
        subscriber.newsletterName = match[1].trim();
      }
    }

    // Extract email
    const emailMatch = body.match(/Email:\s*<a[^>]*href="mailto:([^"]+)"/);
    if (emailMatch) {
      subscriber.email = emailMatch[1];
    } else {
      // Fallback: look for email pattern
      const emailPattern =
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emails = body.match(emailPattern);
      if (emails && emails.length > 0) {
        // Filter out substack emails
        const nonSubstackEmail = emails.find(
          (email) => !email.includes("substack.com")
        );
        if (nonSubstackEmail) {
          subscriber.email = nonSubstackEmail;
        }
      }
    }

    // Extract subscriber name
    const nameElement = $("h3").first().text().trim();
    if (nameElement && nameElement !== subscriber.email) {
      subscriber.name = nameElement;
    }

    // Extract plan details for paid subscribers
    if (isPaidSubscriber) {
      const planMatch = body.match(/Plan:\s*([^<\n]+)/);
      if (planMatch) {
        subscriber.plan = planMatch[1].trim();
      }
    }

    // Extract source
    const sourceMatch = body.match(/Source:\s*([^<\n]+)/);
    if (sourceMatch) {
      subscriber.source = sourceMatch[1].trim();
    }

    // Validate we have at least an email
    if (!subscriber.email) {
      return null;
    }

    return subscriber;
  }
}
