import { Invoice } from "./invoice";
import { Customer } from "./customer";

declare module 'intuit-oauth' {
  export interface TokenResponse {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    x_refresh_token_expires_in: number,
    realmId: string;
    id_token: string;
    createdAt: number;
    latency: number;
  }

  export interface QuickBooksResponse<T> {
    QueryResponse: {
      Invoice?: T[];
      Customer?: T[];
      Vendor?: T[];
      startPosition?: number;
      maxResults?: number;
      totalCount?: number;
    };
    time: string;
  }

  export default class OAuthClient {
    constructor(config: {
      clientId: string;
      clientSecret: string;
      environment: string;
      redirectUri: string;
      logging?: boolean;
      token?: string | null;
    });

    static scopes: {
      Accounting: string;
      OpenId: string;
      Profile: string;
      Email: string;
    };

    environment: {
      apiUrl: string;
    };

    authorizeUri(options: {
      scope: string[];
      state: string;
      realmId?: string;
    }): string;

    createToken(url: string): Promise<{
      getJson(): TokenResponse;
      getToken(): TokenResponse;
    }>;

    isAccessTokenValid(): boolean;
    
    refresh(): Promise<{
      getJson(): TokenResponse;
      getToken(): TokenResponse;
    }>;

    refreshUsingToken(refreshToken: string): Promise<{
      getJson(): TokenResponse;
      getToken(): TokenResponse;
    }>;

    token: {
      getToken(): TokenResponse;
      setToken(token: TokenResponse): void;
    };

    setToken(token: TokenResponse): void;

    makeApiCall(options: {
      url: string;
      method: string;
      headers?: Record<string, string>;
      params?: Record<string, string>;
      body?: string;
    }): Promise<{
      token: {
        realmId: string;
        token_type: string;
        access_token: string;
        refresh_token: string;
        expires_in: number;
        x_refresh_token_expires_in: number;
        id_token: string;
        latency: number;
        createdAt: number;
      };
      response: Response;
      json: QuickBooksResponse<Invoice | Customer | Vendor>;
      intuit_tid: string;
    }>;
  }
} 