import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { KitService } from '@/lib/kit/service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and their ConvertKit integration
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        kitIntegration: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.kitIntegration) {
      return NextResponse.json({ error: 'ConvertKit not connected' }, { status: 400 });
    }

    // Initialize KitService with the user's API key
    const kitService = new KitService(user.kitIntegration.apiKey);

    // Fetch tags from ConvertKit
    const tags = await kitService.fetchTags();

    // Return tags along with current configuration
    return NextResponse.json({
      tags,
      currentConfig: {
        freeSubscriberTagIds: user.kitIntegration.freeSubscriberTagIds,
        paidSubscriberTagIds: user.kitIntegration.paidSubscriberTagIds,
        defaultTagIds: user.kitIntegration.defaultTagIds,
      },
    });
  } catch (error) {
    console.error('Error fetching ConvertKit tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// Update tag configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { freeSubscriberTagIds, paidSubscriberTagIds } = await request.json();

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update tag configuration
    const updatedIntegration = await prisma.kitIntegration.update({
      where: { userId: user.id },
      data: {
        freeSubscriberTagIds: freeSubscriberTagIds || [],
        paidSubscriberTagIds: paidSubscriberTagIds || [],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tag configuration updated successfully',
      integration: updatedIntegration,
    });
  } catch (error) {
    console.error('Error updating tag configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update tag configuration' },
      { status: 500 }
    );
  }
}
