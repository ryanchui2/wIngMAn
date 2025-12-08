import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function POST() {
  const guestToken = randomBytes(32).toString('hex');
  const cookieStore = await cookies();

  // Set cookie that expires in 1 hour
  cookieStore.set('guest_token', guestToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  return NextResponse.json({
    success: true,
    token: guestToken,
    expiresIn: '1 hour'
  });
}
