import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '@/utils/api/mongodb';
import { sign } from 'jsonwebtoken';

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
    console.log("user", user);
    const response = NextResponse.json({ success: true });

    // Set JWT cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 