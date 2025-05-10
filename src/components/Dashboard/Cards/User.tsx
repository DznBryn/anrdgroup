'use client';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Customer as CustomerType, Vendor } from 'intuit-oauth';
import { useStore } from '@/utils/zustand/store';
import { AccountType } from '@/types/user';
import { useEffect } from 'react';
import UserDetail from './UserDetail';
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
			<UserDetail
				displayName={displayName}
				companyName={companyName}
				email={email}
				phone={phone}
				fullAddress={fullAddress}
				handleEdit={handleEdit}
			/>
		</div>
	);
}
