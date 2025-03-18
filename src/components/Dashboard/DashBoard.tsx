'use client';

import { Customer, Invoice, Vendor } from 'intuit-oauth';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';
import {
	Card,
	CardTitle,
	CardHeader,
	CardContent,
	CardDescription,
} from '../ui/card';
import { Button } from '../ui/button';
import { useStore } from '@/utils/zustand/store';
import { DataTable } from './DataTable/DataTable';
import { columns } from './DataTable/Columns/Columns';
import { Plus } from 'lucide-react';

export default function DashBoard({
	customers,
	invoices,
	vendors,
	error,
	loading,
}: {
	customers: Customer[];
	invoices: Invoice[];
	vendors: Vendor[];
	error: string;
	loading: boolean;
}) {
	const { onChange } = useStore((state) => state.entries.modal);
	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error}</div>;
	}
	if (customers.length === 0 && invoices.length === 0 && vendors.length === 0) {
		return <div>No data found</div>;
	}

	return (
		<div className='flex flex-col gap-4'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card className='gap-2 border-0 bg-white'>
					<CardHeader>
						<div className='flex justify-between items-center'>
							<CardTitle>Tenants</CardTitle>
							<Button
								className='bg-green-500 hover:bg-green-600 font-bold text-white'
								onClick={() => onChange('create-user')}>
								<Plus className='w-4 h-4' />
								Add New
							</Button>
						</div>
						<CardDescription>
							Total Tenants:{' '}
							<span className='text-md font-bold'>{customers.length}</span>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<DataTable columns={columns} data={customers} />
					</CardContent>
					{/* <CardFooter>
					<p>Card Footer</p>
				</CardFooter> */}
				</Card>
				<Card className='gap-2 border-0 bg-white'>
					<CardHeader>
						<CardTitle>Owners</CardTitle>
						{/* <CardDescription>
						${balance?.toFixed(2) ?? 0.0}
					</CardDescription> */}
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-72 w-full'>
							{vendors.map((vendor) => (
								<Link
									key={vendor.Id}
									href={`/dashboard/landlord/${vendor.Id}`}
									className='block hover:bg-gray-400 transition-colors'>
									<div className='flex justify-between items-center p-4'>
										<div>
											<p className='font-medium'>{vendor.DisplayName}</p>
										</div>
									</div>
								</Link>
							))}
						</ScrollArea>
					</CardContent>
					{/* <CardFooter>
					<p>Card Footer</p>
				</CardFooter> */}
				</Card>
			</div>
			<Card className='gap-2 border-0 bg-white'>
				<CardHeader>
					<CardTitle>Invoices</CardTitle>
					<CardDescription>
						Total Balance:{' '}
						<span className='text-md font-bold text-red-500'>
							$
							{invoices
								.reduce((acc, invoice) => acc + invoice.Balance, 0)
								.toFixed(2)}
						</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className='h-72 w-full'>
						{invoices.map((invoice) => (
							<Link
								key={invoice.Id}
								href={`/dashboard/invoices/${invoice.Id}`}
								className='block hover:bg-gray-200 transition-colors'>
								<div className='flex justify-between items-center p-4'>
									<div>
										<p className='font-medium'>Invoice #{invoice.DocNumber}</p>
										<p className='text-sm text-gray-500'>
											{new Date(invoice.DueDate).toLocaleDateString()}
										</p>
									</div>
									<div className='text-right'>
										<p className='font-medium'>${invoice.Balance.toFixed(2)}</p>
										<p
											className={`text-sm ${
												invoice.Balance === 0
													? 'text-green-600'
													: 'text-orange-600'
											}`}>
											{invoice.Balance === 0 ? 'Paid' : 'Due'}
										</p>
									</div>
								</div>
							</Link>
						))}
					</ScrollArea>
				</CardContent>
				{/* <CardFooter>
					<p>Card Footer</p>
				</CardFooter> */}
			</Card>
		</div>
	);
}
