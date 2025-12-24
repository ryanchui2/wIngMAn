import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const cookieStore = await cookies();
    const guestId = cookieStore.get('guestId')?.value;

    // Check if user is authenticated or has a guest ID
    if (!session?.user?.email && !guestId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For logged-in users, verify the conversation belongs to them
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Delete the conversation (cascade will delete messages)
      const deleted = await prisma.conversation.delete({
        where: {
          id,
          userId: user.id, // Ensure it belongs to the user
        },
      });

      return NextResponse.json({ success: true, deleted });
    }

    // For guests, just verify the conversation exists before deleting
    // Note: Guests shouldn't have conversations, but handle gracefully
    return NextResponse.json({ error: 'Guests cannot delete conversations' }, { status: 403 });

  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
