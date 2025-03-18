import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { oauthClient } from '@/utils/api/quickbooks';
import { updateQuickBooksToken } from '@/utils/api/mongodb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('qb_refresh_token')?.value;
  
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/quickbooks', request.url));
  }
  
  try {
    const refreshResponse = await oauthClient.refreshUsingToken(refreshToken);
    const tokenData = await refreshResponse.getToken();
    tokenData.realmId = process.env.QUICKBOOKS_REALM_ID || '';
    console.log('TOKEN DATA:', tokenData);
    await updateQuickBooksToken(tokenData);
    
    cookieStore.set('qb_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 hours
    });
    
    if (tokenData.refresh_token) {
      cookieStore.set('qb_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    
    return NextResponse.redirect(new URL(returnUrl, request.url));
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.redirect(new URL('/quickbooks', request.url));
  }
}