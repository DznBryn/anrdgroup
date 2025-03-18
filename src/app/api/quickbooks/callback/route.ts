import { CALLBACK_URL } from '@/lib/conts';
import { initializeToken } from '@/lib/quickbooks-server';
import { updateQuickBooksToken } from '@/utils/api/mongodb';
import { oauthClient } from '@/utils/api/quickbooks';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    const url = request.url;
    const authResponse = await oauthClient.createToken(url);
    const token = await authResponse.getToken();
    // console.log('TOKEN', token);
    token.realmId = process.env.QUICKBOOKS_REALM_ID || '';

    await initializeToken(token);
    await updateQuickBooksToken(token);
    
    if (oauthClient.isAccessTokenValid()) {

      const response = NextResponse.redirect(new URL(CALLBACK_URL, request.url));

      // Store token in cookies
      response.cookies.set('qb_access_token', token.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2 // 2 hours
      });

      response.cookies.set('qb_refresh_token', token.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return response;
    } else {
      const refreshResponse = await oauthClient.refreshUsingToken(token.refresh_token);
      const { access_token, refresh_token } = refreshResponse.getToken();
      const response = NextResponse.redirect(new URL(CALLBACK_URL, request.url));

      response.cookies.set('qb_access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2 // 2 hours
      });

      response.cookies.set('qb_refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return response;
    }
  } catch (error) {
    console.error('Error handling QuickBooks callback:', error);
    return NextResponse.redirect(new URL('/dashboard/tenant?error=auth_failed', request.url));
  }
} 