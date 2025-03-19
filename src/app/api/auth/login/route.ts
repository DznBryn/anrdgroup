import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '@/utils/api/mongodb';
import { sign } from 'jsonwebtoken';
import { getQuickBooksToken } from '@/utils/api/mongodb';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await validateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = sign(
      { 
        userId: user._id?.toString() ?? '',
        email: user.email,
        accountType: user.accountType 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Get QB tokens immediately after successful login
    const qbAuthData = await getQuickBooksToken();
    
    const response = NextResponse.json({ success: true });

    // Set all necessary cookies
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    if (qbAuthData) {

      response.cookies.set('qb_refresh_token', qbAuthData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 