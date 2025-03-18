'use client';

import { Invoice as InvoiceType } from "intuit-oauth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useState } from "react";

export default function Invoice({ id }: { id: string }) {
  const router = useRouter();
	const [invoice, setInvoice] = useState<InvoiceType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		async function fetchInvoice() {
			try {
				const response = await fetch(`/api/quickbooks/invoices/${id}`);
				if (!response.ok) {
					throw new Error('Failed to fetch invoice');
				}
				const data = await response.json();
				setInvoice(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		}

		fetchInvoice();
	}, [id]);

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
			</div>
		);
	}

	if (error || !invoice) {
		return (
			<div className='p-4 text-red-600'>
				Error: {error || 'Invoice not found'}
			</div>
		);
	}

	return (
		<div className='max-w-4xl mx-auto p-6 space-y-8'>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-3xl font-bold'>Invoice #{invoice.DocNumber}</h1>
					<p className='text-gray-600'>
						Due Date: {new Date(invoice.DueDate).toLocaleDateString()}
					</p>
				</div>
				<div className='text-right'>
					<div className='text-2xl font-bold'>
						${invoice.TotalAmt.toFixed(2)}
					</div>
					<span
						className={`inline-block px-3 py-1 rounded-full text-sm ${
							invoice.Balance === 0
								? 'bg-green-100 text-green-800'
								: 'bg-orange-100 text-orange-800'
						}`}>
						{invoice.Balance === 0 ? 'Paid' : 'Due'}
					</span>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow p-6'>
				<h2 className='text-xl font-semibold mb-4'>Customer Details</h2>
				<p className='text-gray-700'>{invoice.CustomerRef.name}</p>
			</div>

			<div className='bg-white rounded-lg shadow overflow-hidden'>
				<h2 className='text-xl font-semibold p-6 border-b'>Line Items</h2>
				<table className='w-full'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
								Description
							</th>
							<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
								Amount
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{invoice.Line.map((item) => (
							<tr key={item.Id}>
								<td className='px-6 py-4 text-sm text-gray-900'>
									{item.Description || 'No description'}
								</td>
								<td className='px-6 py-4 text-sm text-gray-900 text-right'>
									${item.Amount.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
					<tfoot className='bg-gray-50'>
						<tr>
							<td className='px-6 py-4 text-sm font-medium text-gray-900'>
								Total
							</td>
							<td className='px-6 py-4 text-sm font-medium text-gray-900 text-right'>
								${invoice.TotalAmt.toFixed(2)}
							</td>
						</tr>
						<tr>
							<td className='px-6 py-4 text-sm font-medium text-gray-900'>
								Balance Due
							</td>
							<td className='px-6 py-4 text-sm font-medium text-gray-900 text-right'>
								${invoice.Balance.toFixed(2)}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div className='flex justify-end space-x-4'>
				<button
					onClick={() => router.back()}
					className='px-4 py-2 text-gray-600 hover:text-gray-800'>
					Back
				</button>
				<button
					onClick={() => window.print()}
					className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
					Print Invoice
				</button>
			</div>
		</div>
	);
}
