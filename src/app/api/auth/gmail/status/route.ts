import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integration = await prisma.gmailIntegration.findUnique({
      where: { userId: session.user.id },
    });

    if (!integration) {
      return NextResponse.json({ integration: null });
    }

    return NextResponse.json({
      integration: {
        email: integration.email,
        connected: true,
        watchExpiry: integration.watchExpiry,
      }
    });
  } catch (error: any) {
    console.error('Gmail status error:', error);
    return NextResponse.json(
      { error: 'Failed to get Gmail status' },
      { status: 500 }
    );
  }
}
