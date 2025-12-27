import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: user.profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();

    // Upsert profile (create if doesn't exist, update if it does)
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        age: body.age,
        location: body.location,
        gender: body.gender,
        interests: body.interests,
        datingGoals: body.datingGoals,
        datingStyle: body.datingStyle,
        budget: body.budget,
        outdoor: body.outdoor,
        social: body.social,
        dietaryRestrictions: body.dietaryRestrictions,
        additionalNotes: body.additionalNotes,
      },
      update: {
        age: body.age,
        location: body.location,
        gender: body.gender,
        interests: body.interests,
        datingGoals: body.datingGoals,
        datingStyle: body.datingStyle,
        budget: body.budget,
        outdoor: body.outdoor,
        social: body.social,
        dietaryRestrictions: body.dietaryRestrictions,
        additionalNotes: body.additionalNotes,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
