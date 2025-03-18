import Dashboard from '@/components/Dashboard/DashBoard';
import { getUserFromToken } from '@/utils/api/mongodb';
import {
	getCustomers,
	getInvoices,
	getVendors,
	validateAccessToken,
} from '@/utils/api/quickbooks';
import { checkAccountType } from '@/utils/api/mongodb';
import { Customer, Invoice, Vendor } from 'intuit-oauth';

export default async function DashboardPage() {
	const route = '/dashboard';
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
			let vendors: Vendor[] = [];
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

				const vendorsRes = (await getVendors(
					accessToken,
					refreshToken
				)) as Vendor[];

				if (customersRes.length > 0) {
					loading = false;
					customers = customersRes;
				}

				if (invoicesRes.length > 0) {
					invoices = invoicesRes;
				}

				if (vendorsRes.length > 0) {
					vendors = vendorsRes;
				}
				// console.log('CUSTOMERS:', cusRes);
				return { customers, invoices, vendors, error, loading };
			} catch (err) {
				console.error('Error initializing QuickBooks:', err);
				error =
					err instanceof Error ? err.message : 'Error initializing QuickBooks';
				return { customers, error, loading };
			} finally {
				loading = false;
			}
		}

		const { customers, invoices, vendors, error, loading } =
			await initializeQuickBooks(accessToken!, refreshToken!);
		// console.log('CUSTOMERS:', customers);
		// console.log('INVOICES:', invoices);
		// console.log('VENDORS:', vendors);
		return (
			<Dashboard
				customers={customers}
				invoices={invoices || []}
				vendors={vendors || []}
				error={error || ''}
				loading={loading}
			/>
		);
	} catch (error) {
		console.error('Error fetching QuickBooks data:', error);
		return <div>Error fetching QuickBooks data</div>;
	}
}
