'use client';
import { Invoice } from "intuit-oauth";
import Link from "next/link";

export default function Invoices({ invoices }: { invoices: Invoice[] }) {
	return <div className="grid grid-cols-1 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <p className="text-gray-500">No invoices found</p>
            ) : (
              invoices.map((invoice) => (
                <Link 
                  key={invoice.Id} 
                  href={`/dashboard/invoices/${invoice.Id}`}
                  className="block hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Invoice #{invoice.DocNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(invoice.DueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${invoice.Balance.toFixed(2)}</p>
                      <p className={`text-sm ${invoice.Balance === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {invoice.Balance === 0 ? 'Paid' : 
                        new Date(invoice.DueDate) > new Date() ? 'Due' : 'Overdue'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>;
}
