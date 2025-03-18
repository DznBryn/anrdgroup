import { getInvoices } from '@/utils/api/quickbooks';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('qb_access_token')?.value;
    const refreshToken = cookieStore.get('qb_refresh_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const customerEmail = searchParams.get('customerEmail');
    console.log('CUSTOMER EMAIL:', customerEmail);

    const invoices = await getInvoices(accessToken, refreshToken);
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching QuickBooks invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
} 