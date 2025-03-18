import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getQuickBooksToken } from '@/utils/api/mongodb';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const returnUrl = searchParams.get('returnUrl') || '/dashboard';
	
	const qbAuthData = await getQuickBooksToken();
	
	if (!qbAuthData) {
		return NextResponse.redirect(new URL('/quickbooks', request.url));
	}
	
	const cookieStore = await cookies();
	
	
	cookieStore.set('qb_access_token', qbAuthData.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 2, // 2 hours
	});
	
	cookieStore.set('qb_refresh_token', qbAuthData.refresh_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
	
	// Redirect back to the original URL
	return NextResponse.redirect(new URL(returnUrl, request.url));
} 