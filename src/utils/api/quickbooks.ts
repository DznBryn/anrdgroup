import { initializeToken, oauthClient, QB_API_URL } from '@/lib/quickbooks-server';

import { Customer, Vendor } from 'intuit-oauth';
import { cookies } from 'next/headers';
import { getQuickBooksToken } from './mongodb';
import { redirect } from 'next/navigation';

const MINOR_VERSION = 75;
export async function getCustomers(access_token: string, refreshToken: string ) {
  let accessToken = access_token;
  try {

    const isAccessTokenValid = oauthClient.isAccessTokenValid();

    if (!isAccessTokenValid) {
      const refreshResponse = await oauthClient.refreshUsingToken(refreshToken);
      const { access_token } = await refreshResponse.getToken();
      accessToken = access_token;
    }

    const query = 'select * from Customer';
    const response = await oauthClient.makeApiCall({
      url: `${QB_API_URL}/v3/company/${process.env.QUICKBOOKS_REALM_ID}/query?query=${query}&minorversion=${MINOR_VERSION}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain'
      }
    });
    // console.log('GET CUSTOMERS:', await response);
    const data = await response.json;

    return data.QueryResponse.Customer || [];
  } catch (error) {
    console.error('Error fetching QuickBooks customers:', error);
    throw error;
  }
}

export async function getInvoices(access_token: string, refreshToken: string) {
  let accessToken = access_token;
  try {
    const isAccessTokenValid = oauthClient.isAccessTokenValid();

    if (!isAccessTokenValid) {
      const refreshResponse = await oauthClient.refreshUsingToken(refreshToken);
      const { access_token } = await refreshResponse.getToken();
      accessToken = access_token;
    }

    const query = 'select * from Invoice';
    // if (customerEmail) {
    //   const escapedEmail = customerEmail.replace(/'/g, "\\'")
    //   query += ` BillEmail.Address = '${escapedEmail}'`;
    // }

    
    // console.log('OAUTH_CLIENT', { oauthClient, accessToken, isAccessTokenValid });
    const response = await oauthClient.makeApiCall({
      url: `${QB_API_URL}/v3/company/${process.env.QUICKBOOKS_REALM_ID}/query?query=${query}&minorversion=75`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/text'
      },
    });

    // console.log('GET INVOICES:', await response);
    const data = await response.json;
    return data.QueryResponse.Invoice || [];
  } catch (error) {
    console.error('Error fetching QuickBooks invoices:', error);
    throw error;
  }
}

export async function getVendors(access_token: string, refreshToken: string): Promise<Vendor[]> {
  let accessToken = access_token;
  try {
    const isAccessTokenValid = oauthClient.isAccessTokenValid();
    if (!isAccessTokenValid) {
      const refreshResponse = await oauthClient.refreshUsingToken(refreshToken);
      const { access_token } = await refreshResponse.getToken();
      accessToken = access_token;
    }

    const query = 'select * from Vendor';
    const response = await oauthClient.makeApiCall({
      url: `${QB_API_URL}/v3/company/${process.env.QUICKBOOKS_REALM_ID}/query?query=${query}&minorversion=75`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain'
      }
    });

    const data = await response.json;
    return data.QueryResponse.Vendor as Vendor[];
  } catch (error) {
    console.error('Error fetching QuickBooks vendors:', error);
    throw error;
  }
}

export async function validateAccessToken(redirectUrl: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('qb_access_token')?.value;
  const refreshToken = cookieStore.get('qb_refresh_token')?.value;
  const authToken = cookieStore.get('auth_token')?.value;

  if (!accessToken || !refreshToken) {
    const qbAuthData = await getQuickBooksToken();

    if (qbAuthData) {
      await initializeToken(qbAuthData);

      const returnUrl = encodeURIComponent(redirectUrl);
      redirect(`/api/quickbooks/set-cookies?returnUrl=${returnUrl}`);
    } else {
      redirect('/quickbooks');
    }
  }

  if (!oauthClient.isAccessTokenValid()) {
    console.log('ACCESS TOKEN INVALID', oauthClient.isAccessTokenValid());
    const returnUrl = encodeURIComponent(redirectUrl);
    redirect(`/api/quickbooks/refresh-token?returnUrl=${returnUrl}`);
  }
  return { accessToken, refreshToken, authToken };
}

export async function createCustomer(access_token: string, refreshToken: string, customer: Customer) {
  let accessToken = access_token;
  try {
    const isAccessTokenValid = oauthClient.isAccessTokenValid();

    if (!isAccessTokenValid) {
      const refreshResponse = await oauthClient.refreshUsingToken(refreshToken);
      const { access_token } = await refreshResponse.getToken();
      accessToken = access_token;
    }
    
    const response = await oauthClient.makeApiCall({
      url: `${QB_API_URL}/v3/company/${process.env.QUICKBOOKS_REALM_ID}/customer?minorversion=${MINOR_VERSION}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer),
    });

    const data = await response.json;
    return data;
  } catch (error) {
    console.error('Error creating QuickBooks customer:', error);
    throw error;
  }
}

export async function updateCustomer(access_token: string, refreshToken: string, customer: Customer) {
  let accessToken = access_token;
  try {
    const isAccessTokenValid = oauthClient.isAccessTokenValid();

    if (!isAccessTokenValid) {
      const refreshResponse = await oauthClient.refreshUsingToken(refreshToken);
      const { access_token } = await refreshResponse.getToken();
      accessToken = access_token;
    }

    const response = await oauthClient.makeApiCall({
      url: `${QB_API_URL}/v3/company/${process.env.QUICKBOOKS_REALM_ID}/customer/${customer.Id}?minorversion=${MINOR_VERSION}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...customer, sparse: true}),
    });

    const data = await response.json;
    return data;
  } catch (error) {
    console.error('Error updating QuickBooks customer:', error);
    throw error;
  }
}

export async function createVendor(access_token: string, refreshToken: string, vendor: Vendor) {
  let accessToken = access_token;
  try {
    const isAccessTokenValid = oauthClient.isAccessTokenValid();

    if (!isAccessTokenValid) {
      const refreshResponse = await oauthClient.refreshUsingToken(refreshToken);
      const { access_token } = await refreshResponse.getToken();
      accessToken = access_token;
    }

    const response = await oauthClient.makeApiCall({
      url: `${QB_API_URL}/v3/company/${process.env.QUICKBOOKS_REALM_ID}/vendor?minorversion=${MINOR_VERSION}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vendor),
    });

    const data = await response.json;
    return data;
  } catch (error) {
    console.error('Error creating QuickBooks vendor:', error);
    throw error;
  }
}



export { oauthClient }; 