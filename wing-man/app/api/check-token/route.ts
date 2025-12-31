import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { GUEST_LIMITS } from '@/lib/guestLimits';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (session) {
      return NextResponse.json({
        hasToken: true,
        type: 'auth',
        messagesRemaining: null // Unlimited for authenticated users
      });
    }

    // Check if they have a guest token
    const cookieStore = await cookies();
    const guestCookie = cookieStore.get(GUEST_LIMITS.COOKIE_NAME);

    if (guestCookie) {
      try {
        const sessionData = JSON.parse(guestCookie.value);
        const messagesRemaining = GUEST_LIMITS.MAX_MESSAGES - sessionData.messagesUsed;

        return NextResponse.json({
          hasToken: true,
          type: 'guest',
          messagesRemaining,
          messagesUsed: sessionData.messagesUsed
        });
      } catch (parseError) {
        console.error('Failed to parse guest session:', parseError);
        return NextResponse.json({ hasToken: false });
      }
    }

    return NextResponse.json({ hasToken: false });
  } catch (error) {
    console.error('Check token error:', error);
    return NextResponse.json({ hasToken: false });
  }
}
