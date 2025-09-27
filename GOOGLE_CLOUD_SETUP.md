# Google Cloud Console Setup for SubstackSync

This guide will walk you through setting up Google Cloud Console for Gmail webhook integration.

## Prerequisites

- A Google Cloud Platform account
- A project in Google Cloud Console
- Gmail API enabled
- Pub/Sub API enabled

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "SubstackSync")
5. Click "Create"

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Gmail API**
   - **Cloud Pub/Sub API**

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "SubstackSync"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.metadata`
   - Add your email as a test user

4. After configuring consent screen, create OAuth client ID:
   - Application type: "Web application"
   - Name: "SubstackSync Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production URL
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/gmail/callback` (for development)
     - `https://your-domain.com/api/auth/gmail/callback` (for production)

5. Copy the Client ID and Client Secret

## Step 4: Set up Google Cloud Pub/Sub

1. Go to "Pub/Sub" in the Google Cloud Console
2. Click "Create Topic"
3. Topic ID: `gmail-push-notifications`
4. Click "Create"

5. After creating the topic, click on it
6. Click "Create Subscription"
7. Subscription ID: `gmail-push-subscription`
8. Delivery type: "Push"
9. Endpoint URL: `https://your-domain.com/api/webhooks/gmail`
10. Click "Create"

## Step 5: Grant Gmail API Permission to Publish

1. In the topic details page, click on "Permissions"
2. Click "Add Principal"
3. New principals: `gmail-api-push@system.gserviceaccount.com`
4. Select role: "Pub/Sub Publisher"
5. Click "Save"

## Step 6: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
GMAIL_PUBSUB_TOPIC=gmail-push-notifications

# NextAuth (if not already set)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Step 7: Domain Verification (Production Only)

For production deployment:

1. Go to "APIs & Services" > "Domain verification"
2. Add and verify your domain
3. This allows your app to request sensitive scopes

## Step 8: Set up Webhook Authentication (Optional but Recommended)

To secure your webhook endpoint:

1. In Pub/Sub subscription settings, expand "Advanced options"
2. Enable authentication
3. Create a service account for Pub/Sub
4. Grant it permission to invoke your webhook

## Testing the Integration

1. Start your development server
2. Navigate to `/settings` in your app
3. Click "Connect Gmail Account"
4. Authorize the application
5. Send a test email to your Gmail that mimics a Substack notification

## Troubleshooting

### Common Issues:

1. **"Access blocked" error during OAuth**
   - Make sure you've added your email as a test user in OAuth consent screen
   - Verify all required scopes are added

2. **Webhook not receiving notifications**
   - Check that the topic has the correct permissions
   - Verify the endpoint URL is publicly accessible
   - Check Cloud Logging for Pub/Sub delivery errors

3. **"Invalid grant" error**
   - The refresh token might be expired
   - User needs to re-authenticate

### Monitoring

Use Google Cloud Logging to monitor:
- Pub/Sub message delivery
- Gmail API quotas and errors
- OAuth token refreshes

## Security Best Practices

1. Keep your Client Secret secure
2. Use environment variables, never commit secrets
3. Implement webhook verification
4. Monitor for unusual activity
5. Regularly rotate credentials
6. Use least-privilege principles for API scopes

## Quotas and Limits

- Gmail API: 250 quota units per user per second
- Pub/Sub: 10,000 messages per second
- Watch expiration: 7 days (requires renewal)

## Next Steps

After completing this setup:
1. Deploy your application
2. Update redirect URIs for production
3. Submit OAuth consent screen for verification (if going public)
4. Set up monitoring and alerts
5. Implement automatic watch renewal
