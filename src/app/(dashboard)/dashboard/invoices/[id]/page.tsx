import Invoice from '@/components/Dashboard/Invoices/Invoice';

interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
	const { id } = await params;

	return <Invoice id={id} />;
}
