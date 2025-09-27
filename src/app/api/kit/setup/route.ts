import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { KitService } from '@/lib/kit/service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { apiKey, freeTagName, paidTagName } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Test the API key
    const kitService = new KitService(session.user.id, apiKey);
    
    try {
      const tags = await kitService.getTags();
      
      // Find or create tags
      let freeTagId: string | null = null;
      let paidTagId: string | null = null;

      if (freeTagName) {
        let freeTag = tags.find(t => t.name === freeTagName);
        if (!freeTag) {
          freeTag = await kitService.createTag(freeTagName);
        }
        freeTagId = freeTag.id.toString();
      }

      if (paidTagName) {
        let paidTag = tags.find(t => t.name === paidTagName);
        if (!paidTag) {
          paidTag = await kitService.createTag(paidTagName);
        }
        paidTagId = paidTag.id.toString();
      }

      // Save Kit integration
      const integration = await prisma.kitIntegration.upsert({
        where: { userId: session.user.id },
        update: {
          apiKey,
          freeSubscriberTagId: freeTagId,
          paidSubscriberTagId: paidTagId,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          apiKey,
          freeSubscriberTagId: freeTagId,
          paidSubscriberTagId: paidTagId,
        },
      });

      return NextResponse.json({ 
        success: true, 
        integration: {
          id: integration.id,
          freeTagId: integration.freeSubscriberTagId,
          paidTagId: integration.paidSubscriberTagId,
        }
      });
    } catch (kitError: any) {
      return NextResponse.json(
        { error: 'Invalid API key or Kit API error', details: kitError.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Kit setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup Kit integration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integration = await prisma.kitIntegration.findUnique({
      where: { userId: session.user.id },
    });

    if (!integration) {
      return NextResponse.json({ integration: null });
    }

    // Don't send the API key to the client
    return NextResponse.json({
      integration: {
        id: integration.id,
        hasApiKey: !!integration.apiKey,
        freeTagId: integration.freeSubscriberTagId,
        paidTagId: integration.paidSubscriberTagId,
        createdAt: integration.createdAt,
      }
    });
  } catch (error: any) {
    console.error('Kit get error:', error);
    return NextResponse.json(
      { error: 'Failed to get Kit integration' },
      { status: 500 }
    );
  }
}
