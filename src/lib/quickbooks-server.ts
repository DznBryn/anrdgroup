import OAuthClient, { TokenResponse } from 'intuit-oauth';

const oauthClient = new OAuthClient({
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/quickbooks/callback`,
  logging: true,
});

// Initialize token function for server-side use
export async function initializeToken(token?: TokenResponse) {
  if (typeof window === 'undefined' && token) {
    oauthClient.token.setToken(token);
  }
}

const QB_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://quickbooks.api.intuit.com'
  : 'https://sandbox-quickbooks.api.intuit.com';

export { oauthClient, QB_API_URL }; 