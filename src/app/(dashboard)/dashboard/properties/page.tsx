import Properties from "@/components/Dashboard/Properties/Properties";
import { checkAccountType } from "@/utils/api/mongodb";
import { getUserFromToken } from "@/utils/api/mongodb";
import { validateAccessToken } from "@/utils/api/quickbooks";

export default async function PropertiesPage() {
  const route = '/dashboard/properties';
  const { authToken, accessToken, refreshToken } = await validateAccessToken(
		route
	);
  const userData = await getUserFromToken(authToken!);
  await checkAccountType(userData, route, { access_token: accessToken!, refresh_token: refreshToken! });
  
	return <Properties />;
}