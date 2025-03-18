'use client';
import { useEffect } from 'react';

import { Customer } from 'intuit-oauth';

export default function Customers({
	customers,
	error,
	loading,
}: {
	customers: Customer[];
	error: string | null;
	loading: boolean;
}) {

	useEffect(() => {}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<h1>Customers</h1>
			<ul>
				{customers.map((customer) => (
					<li key={customer.Id}>{customer.DisplayName}</li>
				))}
			</ul>
		</div>
	);
}
