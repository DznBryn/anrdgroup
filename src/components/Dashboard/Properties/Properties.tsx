'use client';

import { useEffect, useState } from 'react';
import { Property, PropertyDocument } from '@/lib/classes/Property';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/utils/zustand/store';
import PropertyForm from '@/components/Forms/PropertyForm';
import { ArrowLeft, Plus } from 'lucide-react';
import PropertyCard from '@/components/Dashboard/Cards/PropertyCard';

export default function Properties() {
	const { account } = useStore((state) => state.user);
	const isLandlord = account?.accountType === 'landlord';
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [properties, setProperties] = useState<Property[]>([]);
	const [showAddForm, setShowAddForm] = useState(false);
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
	const [activeTab, setActiveTab] = useState('all');

	const fetchProperties = async () => {
		setLoading(true);
		try {
			const result = await fetch('/api/properties');
			const data = await result.json();

			if (data.success) {
				setError(null);
				const properties = isLandlord
					? data.properties
					: data.properties.filter(
							(property: PropertyDocument) =>
								property.landlordId === account?.intuitCustomerId
					  );

				const propertiesInstance = await properties.map(
					(property: PropertyDocument) => {
						return new Property(property);
					}
				);
				console.log('propertiesInstance', propertiesInstance);
				setProperties(propertiesInstance);
			} else {
				setError(data.error);
			}
		} catch (err) {
			setError('Failed to load properties');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleAddProperty = async (property: Property) => {
		try {
			const result = await fetch('/api/properties', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(property.toDocument()),
			});

			const data = await result.json();

			if (data.success) {
				setError(null);
				setShowAddForm(false);
				setSelectedProperty(null);
				fetchProperties();
			} else {
				setError('Failed to add property');
			}
		} catch (err) {
			setError('Failed to add property');
			console.error(err);
		}
	};

	const handleUpdateProperty = async (property: Property) => {
		try {
			const result = await fetch(`/api/properties/${property._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(property.toDocument()),
			});

			const data = await result.json();

			if (data.success) {
				setError(null);
				setShowAddForm(false);
				setSelectedProperty(null);
				fetchProperties();
			} else {
				setError('Failed to update property');
			}
		} catch (err) {
			setError('Failed to update property');
			console.error(err);
		}
	};

	const handlePropertyClick = (property: Property) => {
		setSelectedProperty(property);
		setShowAddForm(true);
	};

	useEffect(() => {
		fetchProperties();
	}, []);

	if (showAddForm) {
		return (
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<Button
						variant='outline'
						onClick={() => {
							setShowAddForm(false);
							setSelectedProperty(null);
						}}
						className='flex items-center gap-2 bg-white hover:bg-gray-50 border-none cursor-pointer'>
						<ArrowLeft className='h-4 w-4' />
						Back to Properties
					</Button>
					<h2 className='text-2xl font-bold'>
						{selectedProperty ? 'Edit Property' : 'Add New Property'}
					</h2>
				</div>

				<Card className='bg-white border-none'>
					<CardContent>
						<PropertyForm
							landlordId={account?.intuitCustomerId || ''}
							initialData={selectedProperty?.toDocument()}
							onSubmit={selectedProperty ? handleUpdateProperty : handleAddProperty}
						/>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Properties</h2>
				{!isLandlord && (
					<Button
						onClick={() => setShowAddForm(true)}
						className='flex items-center gap-2 font-bold bg-green-500 text-white hover:bg-green-600 cursor-pointer'>
						<Plus className='h-4 w-4' />
						Add Property
					</Button>
				)}
			</div>

			<Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab}>
				<TabsList className='w-full flex justify-between gap-4'>
					<TabsTrigger value='all' className='bg-white w-auto cursor-pointer'>
						All Properties
					</TabsTrigger>
					<TabsTrigger
						value='occupied'
						className='bg-white w-auto cursor-pointer'>
						Occupied
					</TabsTrigger>
					<TabsTrigger
						value='vacant'
						className='bg-white w-auto cursor-pointer'>
						Vacant
					</TabsTrigger>
					<TabsTrigger
						value='expiring'
						className='bg-white w-auto cursor-pointer'>
						Expiring Leases
					</TabsTrigger>
				</TabsList>

				<TabsContent value='all' className='space-y-4 mt-4'>
					{loading ? (
						<div className='text-center py-8'>Loading properties...</div>
					) : error ? (
						<div className='text-center py-8 text-red-500'>{error}</div>
					) : properties.length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-12'>
								<p className='text-muted-foreground mb-4'>
									No properties found
								</p>
								{!isLandlord && (
									<Button onClick={() => setShowAddForm(true)}>
										Add Your First Property
									</Button>
								)}
							</CardContent>
						</Card>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{properties.map((property) => (
								<div 
									key={property._id?.toString()} 
									onClick={() => handlePropertyClick(property)}
									className="cursor-pointer transition-transform hover:scale-103"
								>
									<PropertyCard property={property} />
								</div>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value='occupied' className='space-y-4 mt-4'>
					{/* Filtered properties */}
				</TabsContent>

				<TabsContent value='vacant' className='space-y-4 mt-4'>
					{/* Filtered properties */}
				</TabsContent>

				<TabsContent value='expiring' className='space-y-4 mt-4'>
					{/* Filtered properties */}
				</TabsContent>
			</Tabs>
		</div>
	);
}
