'use client';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Customer as CustomerType, Vendor } from 'intuit-oauth';
import { useStore } from '@/utils/zustand/store';
import { AccountType } from '@/types/user';
import { useEffect } from 'react';
interface TenantProps {
	customer?: CustomerType;
	vendor?: Vendor;
}

export default function Tenant({ customer, vendor }: TenantProps) {
	const entity = customer || vendor;
	const entityType = customer ? 'tenant' : 'landlord';
	const {
		modal: { onChange },
		setSelectedUser,
	} = useStore((state) => state.entries);

	const displayName = entity.DisplayName;
	const companyName = entity.CompanyName;
	const email =
		customer?.PrimaryEmailAddr?.Address || vendor?.PrimaryEmailAddr?.Address;
	const phone =
		customer?.PrimaryPhone?.FreeFormNumber ||
		vendor?.PrimaryPhone?.FreeFormNumber;
	const address = customer?.BillAddr || vendor?.BillAddr;
	const balance = customer?.Balance || vendor?.Balance;

	const fullAddress = address
		? `${address.Line1}, ${address.City}, ${address.CountrySubDivisionCode} ${address.PostalCode}`
		: 'No address available';

	const handleEdit = async () => {
		onChange('update-user');
	};

	useEffect(() => {
		if (entity) {
			setSelectedUser(entity, entityType as AccountType);
		}
		return () => {
			setSelectedUser(null, null);
		};
	}, [entity, entityType, setSelectedUser]);

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
			<Card className='gap-2 border-0 bg-white'>
				<CardHeader>
					<CardTitle>Current Balance</CardTitle>
					{/* <CardDescription>
						${balance?.toFixed(2) ?? 0.0}
					</CardDescription> */}
				</CardHeader>
				<CardContent>
					<p className='text-4xl font-bold'>${balance?.toFixed(2) ?? 0.0}</p>
				</CardContent>
				{/* <CardFooter>
					<p>Card Footer</p>
				</CardFooter> */}
			</Card>
			<Card className='gap-2 col-span-2 border-0 bg-white'>
				<CardHeader className='flex flex-row justify-between w-full items-center'>
					<div>
						<CardTitle>{displayName}</CardTitle>
						{companyName && (
							<div className='flex flex-col'>
								<p className='font-bold text-gray-800 m-0'>Company</p>
								<p className='font-medium m-0'>{companyName}</p>
							</div>
						)}
					</div>
					<Button
						variant='link'
						className='p-4 py-0 text-blue-500 underline cursor-pointer'
						onClick={handleEdit}>
						Edit
					</Button>
				</CardHeader>
				<CardContent>
					<div className='flex justify-between gap-1'>
						<div>
							{email && (
								<div className='flex gap-2'>
									<p className='font-bold text-gray-800 m-0'>Email</p>
									<p className='font-medium'>{email}</p>
								</div>
							)}
							{phone && (
								<div className='flex gap-2'>
									<p className='font-bold text-gray-800 m-0'>Phone</p>
									<p className='font-medium'>{phone}</p>
								</div>
							)}
						</div>
						<div className='flex gap-6'>
							<div>
								<p className=' font-bold text-gray-800 mb-0'>Billing address</p>
								<p className='text-gray-800'>{fullAddress}</p>
							</div>
						</div>
					</div>
				</CardContent>
				{/* <CardFooter>
					<p>Card Footer</p>
				</CardFooter> */}
			</Card>
		</div>
	);
}
