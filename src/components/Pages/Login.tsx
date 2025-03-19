'use client';

import { useRouter } from 'next/navigation';
import { CALLBACK_URL } from '@/lib/conts';
import { UserState, useStore } from '@/utils/zustand/store';
import UserForm, { GenericFormValues } from '@/components/Forms/UserForm';
import { toast } from 'sonner';

export default function LoginPage() {
	const router = useRouter();
	const { setUser } = useStore<UserState>((state) => state.user);

	const handleLogin = async (formData: GenericFormValues) => {
		console.log('formData', formData);
		
		// Ensure password exists before proceeding
		if (!formData.password) {
			toast.error('Password is required');
			throw new Error('Password is required');
		}
		
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
				}),
			});

			if (!response.ok) {
				throw new Error('Login failed');
			}
			
			const data = await response.json();
			console.log('data', data);
			setUser(data.user);
			router.push(CALLBACK_URL);
		} catch (error) {
			console.error('Login error:', error);
			toast.error('Login failed. Please check your credentials.');
			throw error; 
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='w-full max-w-md'>
				<UserForm 
					isSignUp={false} 
					onSubmit={handleLogin}
					defaultValues={{
						email: '',
						password: '',
						firstName: '',
						lastName: '',
						accountType: 'tenant',
					}} 
				/>
			</div>
		</div>
	);
}
