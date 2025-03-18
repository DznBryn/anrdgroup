import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.css';
import Layout from '@/components/Layouts/Layout';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/utils/api/mongodb';

const lato = Lato({
	subsets: ['latin'],
	weight: ['100', '300', '400', '700', '900'],
	variable: '--font-lato',
});

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#262626',
};

export const metadata: Metadata = {
	metadataBase: new URL('https://anrdhomes.com'),
	title: {
		default: 'Best Real Estate Home Buyers in Your Area',
		template: '%s | ANRD Homes',
	},
	description:
		'ANRD Homes buys all types of homes quickly and easily. Receive a fair cash offer and enjoy a seamless closing process. Contact us to learn more.',
	keywords:
		'ANRD Homes, real estate, sell my house, sell my property, cash offer, distressed property, foreclosure, structural issues, property in disrepair, fair cash offer, quick closing, stress-free transaction, ANRD Group Inc',
	authors: [{ name: 'ANRD Group Inc' }],
	publisher: 'ANRD Group Inc',
	robots: 'index, follow',
	manifest: '/site.webmanifest',
	openGraph: {
		type: 'website',
		siteName: 'anrdhomes.com',
		title: 'Best Real Estate Home Buyers in Your Area',
		description:
			'ANRD Homes buys all types of homes quickly and easily. Receive a fair cash offer and enjoy a seamless closing process. Contact us to learn more.',
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const authToken = cookieStore.get('auth_token');

	let initialUser = null;
	if (authToken) {
		const userData = await getUserFromToken(authToken.value);
		if (userData) {
			initialUser = userData;
		}
	}
	return (
		<html lang='en'>
			<head>
				<Script
					src='https://www.googletagmanager.com/gtag/js?id=G-F2RGHYQ3XF'
					strategy='afterInteractive'
				/>
				<Script id='google-analytics' strategy='afterInteractive'>
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F2RGHYQ3XF');
          `}
				</Script>
			</head>
			<body
				className={`${lato.variable} border-none bg-gray-100 font-sans antialiased w-full min-h-screen grid grid-cols-1`}>
				<Layout initialUser={initialUser}>{children}</Layout>
			</body>
		</html>
	);
}
