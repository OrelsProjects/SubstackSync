import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  // "https://www.googleapis.com/auth/gmail.metadata",
];

export function getGmailOAuthClient(): OAuth2Client {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_AUTH_CLIENT_ID,
    process.env.GOOGLE_AUTH_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/gmail/callback`
  );

  return oauth2Client;
}

export function getAuthUrl(state: string): string {
  const oauth2Client = getGmailOAuthClient();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state: state,
    prompt: "consent", // Force consent to ensure we get a refresh token
  });

  return authUrl;
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getGmailOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function setCredentials(oauth2Client: OAuth2Client, tokens: any) {
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}
