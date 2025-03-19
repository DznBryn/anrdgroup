import {
	getInvoices,
	getCustomers,
	validateAccessToken,
} from '@/utils/api/quickbooks';
import { Invoice } from 'intuit-oauth';
import { Customer } from 'intuit-oauth';
import Invoices from '@/components/Dashboard/Invoices/Invoices';
import TenantComponent from '@/components/Dashboard/Cards/User';
import { getUserFromToken, checkAccountType } from '@/utils/api/mongodb';
export default async function TenantPage({
	params,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { id } = await params;
	const route = `/dashboard/tenant/${id}`;
	const { accessToken, refreshToken, authToken } = await validateAccessToken(
		route
	);

	const userData = await getUserFromToken(authToken!);

	await checkAccountType(userData, route, { access_token: accessToken!, refresh_token: refreshToken! });
	try {
		async function initializeQuickBooks(
			accessToken: string,
			refreshToken: string
		) {
			let customers: Customer[] = [];
			let invoices: Invoice[] = [];

			let error: string | null = null;
			let loading = true;
			try {
				const customersRes = (await getCustomers(
					accessToken,
					refreshToken
				)) as Customer[];
				const invoicesRes = (await getInvoices(
					accessToken,
					refreshToken
				)) as Invoice[];

				if (customersRes.length > 0) {
					loading = false;
					customers = customersRes;
				}

				if (invoicesRes.length > 0) {
					invoices = invoicesRes;
				}

				// console.log('CUSTOMERS:', cusRes);
				return { customers, invoices, error, loading };
			} catch (err) {
				console.error('Error initializing QuickBooks:', err);
				error =
					err instanceof Error ? err.message : 'Error initializing QuickBooks';
				return { customers, error, loading };
			} finally {
				loading = false;
			}
		}

		const { customers, invoices, error, loading } = await initializeQuickBooks(
			accessToken!,
			refreshToken!
		);

		if (loading) {
			return <div>Loading...</div>;
		}

		if (error) {
			return <div>Error: {error}</div>;
		}

		const tenant = customers.find((customer) => customer.Id === id);
		const tenantInvoices = invoices?.filter(
			(invoice) => invoice.CustomerRef.value === tenant?.Id
		) as Invoice[];

		// console.log(tenant);
		// console.log(customers);
		// console.log(tenantInvoices);

		return (
			<div>
				<TenantComponent customer={tenant as Customer} />
				<Invoices invoices={tenantInvoices} />
			</div>
		);
	} catch (error) {
		console.error(error);
	}
}
