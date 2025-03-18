'use client';

import { useEffect, type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { User } from '@/types/user';
import { UserState, useStore } from '@/utils/zustand/store';

type Props = {
	children?: ReactNode;
	initialUser: User | null;
};

export default function Layout({ initialUser, children }: Props) {
	const { setUser } = useStore<UserState>((state) => state.user);

	useEffect(() => {
		if (initialUser) {
			setUser(initialUser);
		}
	}, [initialUser, setUser]);
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
