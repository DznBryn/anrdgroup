import SellingPage from '@/components/Pages/SellingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Real Estate Home Buyers in Your Area',
  openGraph: {
    title: 'Best Real Estate Home Buyers in Your Area',
    description: 'ANRD Homes buys all types of homes quickly and easily. Receive a fair cash offer and enjoy a seamless closing process. Contact us to learn more.',
    siteName: 'anrdhomes.com',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'msapplication-TileColor': '#262626',
    'theme-color': '#262626',
  }
};

export default function Page() {
  return <SellingPage />;
}
