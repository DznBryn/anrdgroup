import { getCustomers } from '@/utils/api/quickbooks';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  console.log('CUSTOMERS ROUTE');
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log('SEARCH PARAMS:', searchParams);
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('qb_access_token')?.value;
    const refreshToken = cookieStore.get('qb_refresh_token')?.value;
    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await getCustomers(accessToken, refreshToken);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching QuickBooks customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
} 