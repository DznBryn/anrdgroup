import { oauthClient } from '@/lib/quickbooks-server';
import { NextResponse } from 'next/server';

export async function GET() {

  try {
    const authUri = oauthClient.authorizeUri({
      scope: [
        'com.intuit.quickbooks.accounting'
      ],
      state: 'testState',
    });

    return NextResponse.json({ authUrl: authUri });
  } catch (error) {
    console.error('Error initiating QuickBooks auth:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 