import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";
import { Property } from "@/lib/classes/Property";

export default function PropertyCard({ property }: { property: Property }) {
	return (
		<Card className='overflow-hidden bg-white hover:bg-gray-50 border-none cursor-pointer'>
			{/* <div className='h-40 bg-gray-200'>
				{property.images && property.images.length > 0 ? (
					<Image
						src={property.images[0]}
						alt={property.address.street}
						fill
						className='object-cover'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
				) : (
					<div className='w-full h-full flex items-center justify-center text-gray-400'>
						No image
					</div>
				)}
			</div> */}

			<CardHeader className=''>
				<CardTitle className='text-lg mb-0'>{property.address.street}</CardTitle>
				<p className='text-sm text-gray-500'>
					{property.address.city}, {property.address.state}{' '}
					{property.address.zipCode}
				</p>
			</CardHeader>

			<CardContent>
				<div className='grid grid-cols-2 gap-2 text-sm'>
					<div>
						<p className='text-gray-500'>Type</p>
						<p>{property.propertyType.replace('-', ' ')}</p>
					</div>
					<div>
						<p className='text-gray-500'>Units</p>
						<p>{property.totalUnits}</p>
					</div>
					<div>
						<p className='text-gray-500'>Occupancy</p>
						<p>{property.occupancyRate.toFixed(0)}%</p>
					</div>
					<div>
						<p className='text-gray-500'>Monthly Income</p>
						<p>${property.monthlyGrossIncome.toLocaleString()}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}