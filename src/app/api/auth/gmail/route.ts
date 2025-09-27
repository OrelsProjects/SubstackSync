import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/authOptions';
import { getAuthUrl } from '@/lib/gmail/oauth';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a random state parameter for security
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state in session or temporary storage
    // For now, we'll include userId in state (in production, use proper session storage)
    const stateData = Buffer.from(JSON.stringify({
      userId: session.user.id,
      timestamp: Date.now(),
    })).toString('base64');

    const authUrl = getAuthUrl(stateData);
    
    return NextResponse.json({ authUrl });
  } catch (error: any) {
    console.error('Gmail auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
