import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/api/anthropic';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated OR has a valid guest token
    const session = await auth();
    const cookieStore = await cookies();
    const guestToken = cookieStore.get('guest_token');

    if (!session && !guestToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in or use as guest.' },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const reply = await generateChatResponse(message);

    return NextResponse.json({
      reply,
      isGuest: !session && !!guestToken
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}
