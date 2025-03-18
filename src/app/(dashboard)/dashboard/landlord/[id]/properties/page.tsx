import Properties from '@/components/Dashboard/Properties/Properties';
import { checkAccountType } from '@/utils/api/mongodb';
import { getUserFromToken } from '@/utils/api/mongodb';
import { validateAccessToken } from '@/utils/api/quickbooks';

export default async function PropertiesPage({
	params,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { id } = await params;
	const route = `/dashboard/landlord/${id}/properties`;
	const { authToken, accessToken, refreshToken } = await validateAccessToken(route);
	const userData = await getUserFromToken(authToken!);
	await checkAccountType(userData, route, { access_token: accessToken!, refresh_token: refreshToken! });

	return <Properties />;
}
