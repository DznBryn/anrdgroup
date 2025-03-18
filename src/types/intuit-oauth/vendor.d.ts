declare module 'intuit-oauth' {
  interface VendorAddress {
    City: string;
    Line1: string;
    PostalCode: string;
    Lat?: string;
    Long?: string;
    CountrySubDivisionCode: string;
    Id?: string;
  }

  interface VendorEmail {
    Address: string;
  }

  interface VendorPhone {
    FreeFormNumber: string;
  }

  interface VendorWebsite {
    URI: string;
  }

  interface VendorMetadata {
    CreateTime: string;
    LastUpdatedTime: string;
  }

  export interface Vendor {
    Id?: string;
    SyncToken?: string;
    DisplayName: string;
    GivenName: string;
    FamilyName: string;
    CompanyName: string;
    PrintOnCheckName: string;
    AcctNum?: string;
    Active?: boolean;
    Balance?: number;
    Vendor1099?: boolean;
    domain?: string;
    sparse?: boolean;
    PrimaryEmailAddr: VendorEmail;
    PrimaryPhone?: VendorPhone;
    WebAddr?: VendorWebsite;
    BillAddr?: VendorAddress;
    MetaData?: VendorMetadata;
  }

  export interface VendorResponse {
    Vendor: Vendor;
    time: string;
  }
}
