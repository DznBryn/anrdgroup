'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Footer() {
	const pathname = usePathname();
	const isDashboardPage = pathname.includes('/dashboard');
	return isDashboardPage ? null : (
		<div
			className={`w-full h-auto m-0 mt-auto bg-black p-12 text-white ${
				isDashboardPage ? 'bg-gray-900' : ''
			}`}>
			<p className='text-center text-white'>
				© Copyright {new Date().getFullYear()} | ANRD Group Inc. |{' '}
				<Link href='/terms' className='hover:underline'>
					Terms & Conditions
				</Link>
			</p>
		</div>
	);
}