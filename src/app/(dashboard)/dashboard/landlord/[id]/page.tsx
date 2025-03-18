import { getUserFromToken, checkAccountType } from '@/utils/api/mongodb';
import { getVendors, validateAccessToken } from '@/utils/api/quickbooks';
import { Vendor } from 'intuit-oauth';
import LandlordComponent from '@/components/Dashboard/Cards/User';
export default async function LandlordPage({
	params,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { id } = await params;
	const route = `/dashboard/landlord/${id}`;
	const { accessToken, refreshToken, authToken } = await validateAccessToken(
		route
	);
	const userData = await getUserFromToken(authToken!);
	await checkAccountType(userData, route, { access_token: accessToken!, refresh_token: refreshToken! });

	try {
		let vendor : Vendor | null = null;
		try {
			const vendorsRes = (await getVendors(
				accessToken,
				refreshToken
			)) as Vendor[];

			if (vendorsRes.length > 0) {
				vendor = vendorsRes.find(v => v.Id === id) || null;
			}

			console.log({ vendor });
		} catch (error) {
			console.error(error);
		}

		return (
			<div>
				<LandlordComponent vendor={vendor as Vendor} />
			</div>
		);
	} catch (error) {
		console.error(error);
	}
}
