import { getInvoices } from '@/utils/api/quickbooks';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Invoice } from 'intuit-oauth';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('qb_access_token')?.value;
    const refreshToken = cookieStore.get('qb_refresh_token')?.value;
    
    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Fetch the specific invoice using the ID
    const invoices = await getInvoices(accessToken, refreshToken);
    const invoice = invoices.find((inv: Invoice) => inv.Id === id);
    
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching QuickBooks invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
} 