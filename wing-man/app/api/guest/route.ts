import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import { GUEST_LIMITS } from '@/lib/guestLimits';

export async function POST() {
  const guestToken = randomBytes(32).toString('hex');
  const cookieStore = await cookies();

  // Create session data with message tracking
  const sessionData = {
    token: guestToken,
    messagesUsed: 0,
    createdAt: Date.now(),
  };

  // Set cookie with session data
  cookieStore.set(GUEST_LIMITS.COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: GUEST_LIMITS.SESSION_DURATION,
    path: '/',
  });

  return NextResponse.json({
    success: true,
    messagesRemaining: GUEST_LIMITS.MAX_MESSAGES,
    expiresIn: `${GUEST_LIMITS.SESSION_DURATION / 60} minutes`
  });
}
