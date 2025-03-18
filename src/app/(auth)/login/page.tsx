import LoginPage from '@/components/Pages/Login';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { CALLBACK_URL } from '@/lib/conts';

export default async function Login() {
	const cookieStore = await cookies();

	const authToken = cookieStore.get('auth_token');
	if (authToken) {
		redirect(CALLBACK_URL);
	}
	return <LoginPage />;
}
