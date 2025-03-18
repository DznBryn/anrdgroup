declare module 'intuit-oauth' {
  export interface DefaultTaxCodeRef {
    value: string;
  }

  export interface Address {
    Id?: string;
    Line1: string;
    City: string;
    PostalCode: string;
    Lat?: string;
    Long?: string;
    Country?: string;
    CountrySubDivisionCode: string;
  }

  export interface CustomerEmail {
    Address: string;
  }

  export interface Customer {
    Id?: string;
    domain?: string;
    SyncToken?: string;
    DisplayName: string;
    FullyQualifiedName: string;
    Suffix?: string;
    Title?: string;
    GivenName?: string;
    MiddleName?: string;
    FamilyName?: string;
    CompanyName?: string;
    PrintOnCheckName?: string;
    Active?: boolean;
    DefaultTaxCodeRef?: DefaultTaxCodeRef;
    PrimaryEmailAddr: CustomerEmail;
    PrimaryPhone?: {
      FreeFormNumber: string;
    };
    BillAddr?: Address;
    ShipAddr?: Address;
    Balance?: number;
    BalanceWithJobs?: number;
    PreferredDeliveryMethod?: string;
    Taxable?: boolean;
    Job?: boolean;
    BillWithParent?: boolean;
    sparse?: boolean;
    Notes?: string;
    MetaData?: {
      CreateTime?: string;
      LastUpdatedTime?: string;
    };
  }
}
