import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear authentication cookies
  cookieStore.delete('auth_token');
  cookieStore.delete('qb_access_token');
  cookieStore.delete('qb_refresh_token');
  
  return NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );
} 