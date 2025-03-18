'use client';

import { useRouter } from 'next/navigation';
import UserForm from '@/components/Forms/UserForm';
import { toast } from 'sonner';
export default function SignUpPage() {
	const router = useRouter();

	const handleSignUp = async (formData: {
		firstName?: string;
		lastName?: string;
		email: string;
		password: string;
		accountType: 'tenant' | 'landlord' | 'manager' | 'admin';
	}) => {
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create account');
			}

			router.push('/login');
		} catch (error) {
			console.error('Failed to sign up:', error);
			toast.error('Failed to sign up');
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md'>
				<UserForm isSignUp={true} onSubmit={handleSignUp} />
			</div>
		</div>
	);
}
