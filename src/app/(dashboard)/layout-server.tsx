import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserFromToken } from '@/utils/api/mongodb';
import DashboardLayout from './layout-client';


export default async function DashboardLayoutServer({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const authToken = cookieStore.get('auth_token');

	if (!authToken) {
		redirect('/login');
	}

	const userData = await getUserFromToken(authToken.value);

	if (!userData) {
		redirect('/login');
	}

	

	return <DashboardLayout initialUser={userData}>{children}</DashboardLayout>;
}
