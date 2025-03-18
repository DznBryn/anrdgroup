import { validateAccessToken } from '@/utils/api/quickbooks';
import { checkAccountType, getUserFromToken } from '@/utils/api/mongodb';

export default async function OwnerDashboard() {
	const route = '/dashboard/landlord';
  const { authToken, accessToken, refreshToken } = await validateAccessToken(
		route
	);
  const userData = await getUserFromToken(authToken!);
  await checkAccountType(userData, route, { access_token: accessToken!, refresh_token: refreshToken! });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Properties Overview</h2>
          {/* Add properties summary */}
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Total Rent Roll</h2>
          {/* Add rent roll summary */}
        </div>
      </div>
    </div>
  );
} 