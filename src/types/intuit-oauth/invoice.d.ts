declare module 'intuit-oauth' {
  export interface Invoice {
    Id: string;
    DocNumber: string;
    DueDate: string;
    Balance: number;
    BillEmail?: {
      Address: {
        name: string;
      };
    };
    TotalAmt: number;
    CustomerRef: {
      value: string;
      name: string;
    };
    Line: Array<{
      Id: string;
      Amount: number;
      Description?: string;
      DetailType: string;
    }>;
    status?: 'Paid' | 'Due';
  }
}