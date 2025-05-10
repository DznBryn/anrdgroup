'use client';

import { CSSProperties, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Dashboard/Sidebar';
import { UserState, useStore } from '@/utils/zustand/store';
import { User } from '@/types/user';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Modals from '@/components/Modals/Modals';

export default function DashboardLayout({
	children,
	initialUser,
}: {
	children: React.ReactNode;
	initialUser: User;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const { setUser } = useStore<UserState>((state) => state.user);

	const handleUserRedirect = useCallback((user: User) => {
		if (user.accountType === 'tenant' && !pathname.includes('/dashboard/tenant')) {
			router.push(`/dashboard/tenant/${user.intuitCustomerId}`);
		} else if (user.accountType === 'landlord' && !pathname.includes('/dashboard/landlord')) {
			router.push(`/dashboard/landlord/${user.intuitCustomerId}`);
		}
	}, [pathname, router]);


	useEffect(() => {
		if (initialUser) {
			setUser(initialUser);
			handleUserRedirect(initialUser);
		}
	}, []);

	return (
		<SidebarProvider
			className='bg-gray-100 border-none'
			style={{
				'--sidebar-background': '#111827',
				'--sidebar-width': '14rem',
			} as CSSProperties}>
			<Sidebar />
			<main className='flex-1 p-8'>
				<SidebarTrigger />
				{children}
			</main>
			<Modals />
		</SidebarProvider>
	);
}
