import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (session) {
      return NextResponse.json({ hasToken: true, type: 'auth' });
    }

    // Check if they have a guest token
    const cookieStore = await cookies();
    const guestToken = cookieStore.get('guest_token');

    if (guestToken) {
      return NextResponse.json({ hasToken: true, type: 'guest' });
    }

    return NextResponse.json({ hasToken: false });
  } catch (error) {
    console.error('Check token error:', error);
    return NextResponse.json({ hasToken: false });
  }
}
