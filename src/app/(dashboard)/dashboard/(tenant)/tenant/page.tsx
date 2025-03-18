import { redirect } from 'next/navigation';
import { validateAccessToken } from '@/utils/api/quickbooks';
import { getUserFromToken, checkAccountType } from '@/utils/api/mongodb';
export default async function TenantDashboard() {
  const { authToken, accessToken, refreshToken } = await validateAccessToken(
		'/dashboard/tenant'
	);
	const userData = await getUserFromToken(authToken!);
	await checkAccountType(userData, '/dashboard/tenant', { access_token: accessToken!, refresh_token: refreshToken! });
  return redirect('/dashboard');
}
