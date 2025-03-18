import SignUpPage from '@/components/Pages/SignUp';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { CALLBACK_URL } from '@/lib/conts';

export default async function SignUp() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');
  
  if (authToken) {
    redirect(CALLBACK_URL);
  }
  
  return <SignUpPage />;
}