import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey, apiSecret } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a ConvertKit integration
    const existingIntegration = await prisma.kitIntegration.findUnique({
      where: { userId: user.id },
    });

    if (existingIntegration) {
      // Update existing integration
      const updatedIntegration = await prisma.kitIntegration.update({
        where: { userId: user.id },
        data: {
          apiKey,
          apiSecret: apiSecret || null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'ConvertKit integration updated successfully',
        integration: updatedIntegration,
      });
    } else {
      // Create new integration
      const newIntegration = await prisma.kitIntegration.create({
        data: {
          userId: user.id,
          apiKey,
          apiSecret: apiSecret || null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'ConvertKit integration created successfully',
        integration: newIntegration,
      });
    }
  } catch (error) {
    console.error('ConvertKit connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
