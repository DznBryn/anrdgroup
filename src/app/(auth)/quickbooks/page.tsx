'use client';
import { useEffect } from 'react';

export default function QuickBooksAuthPage() {
	useEffect(() => {
		initiateQuickBooksAuth();
	}, []);

	async function initiateQuickBooksAuth() {
		try {
			const response = await fetch('/api/quickbooks/auth');
			const data = await response.json();
			if (data.authUrl) {
				window.location.href = data.authUrl;
			}
		} catch (error) {
			console.error('Error initiating QuickBooks auth:', error);
		}
	}
	return null;
}
