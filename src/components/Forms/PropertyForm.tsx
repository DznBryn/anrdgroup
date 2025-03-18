'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Property,
	PropertyDocument,
	PropertyType,
	PropertyUnit,
} from '@/lib/classes/Property';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2 } from 'lucide-react';
import { User } from '@/types/user';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const propertyFormSchema = z.object({
	address: z.object({
		street: z.string().min(1, 'Street is required'),
		city: z.string().min(1, 'City is required'),
		state: z.string().min(1, 'State is required'),
		zipCode: z.string().min(1, 'Zip code is required'),
		country: z.string().min(1, 'Country is required'),
	}),
	features: z.object({
		squareFeet: z.coerce.number().min(1, 'Square footage is required'),
		yearBuilt: z.coerce.number().optional(),
		hasParking: z.boolean().default(false),
		hasAC: z.boolean().default(false),
		hasHeating: z.boolean().default(false),
		petsAllowed: z.boolean().default(false),
		amenities: z.array(z.string()).default([]),
	}),
	financials: z.object({
		purchasePrice: z.coerce.number().optional(),
		currentValue: z.coerce.number().optional(),
		propertyTaxes: z.coerce.number().optional(),
		insuranceCost: z.coerce.number().optional(),
		maintenanceReserve: z.coerce.number().optional(),
	}),
	units: z
		.array(
			z.object({
				unitNumber: z.string().min(1, 'Unit number is required'),
				bedrooms: z.coerce.number().min(0, 'Bedrooms must be 0 or more'),
				bathrooms: z.coerce.number().min(0, 'Bathrooms must be 0 or more'),
				squareFeet: z.coerce.number().min(1, 'Square footage is required'),
				monthlyRent: z.coerce.number().min(0, 'Monthly rent must be 0 or more'),
				securityDeposit: z.coerce
					.number()
					.min(0, 'Security deposit must be 0 or more'),
				leaseTermMonths: z.coerce
					.number()
					.min(0, 'Lease term must be 0 or more'),
				leaseType: z.enum(['month-to-month', 'lease']).optional(),
				isActive: z.boolean().default(true),
				tenantId: z.string().optional(),
			})
		)
		.min(1, 'At least one unit is required'),
	propertyType: z
		.enum([
			'single-family',
			'duplex',
			'triplex',
			'quadplex',
			'multi-family',
			'condo',
			'townhouse',
			'apartment-building',
			'commercial',
		])
		.optional(),
	notes: z.string().optional(),
	isActive: z.boolean().default(true),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
	initialData?: PropertyDocument;
	landlordId: string;
	onSubmit?: (property: Property) => void;
}

export default function PropertyForm({
	initialData,
	landlordId,
	onSubmit,
}: PropertyFormProps) {
	const [activeTab, setActiveTab] = useState<'address' | 'features' | 'financials' | 'units'>('units');
	const [tenants, setTenants] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);

	const form = useForm<PropertyFormValues>({
		resolver: zodResolver(propertyFormSchema),
		defaultValues: initialData
			? {
					address: initialData.address,
					features: initialData.features,
					financials: initialData.financials,
					units: initialData.units,
					propertyType: initialData.propertyType,
					notes: initialData.notes || '',
					isActive: initialData.isActive,
			  }
			: {
					address: {
						street: '',
						city: '',
						state: '',
						zipCode: '',
						country: 'USA',
					},
					features: {
						squareFeet: 0,
						yearBuilt: undefined,
						hasParking: false,
						hasAC: false,
						hasHeating: false,
						petsAllowed: false,
						amenities: [],
					},
					financials: {
						purchasePrice: undefined,
						currentValue: undefined,
						propertyTaxes: undefined,
						insuranceCost: undefined,
						maintenanceReserve: undefined,
					},
					units: [
						{
							unitNumber: '1',
							bedrooms: 0,
							bathrooms: 0,
							squareFeet: 0,
							monthlyRent: 0,
							securityDeposit: 0,
							leaseTermMonths: 12,
							leaseType: 'lease',
							isActive: true,
							tenantId: undefined,
						},
					],
					notes: '',
					isActive: true,
			  },
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'units',
	});

	useEffect(() => {
		const fetchTenants = async () => {
			setLoading(true);
			try {
				const response = await fetch('/api/users?accountType=tenant');
				const data = await response.json();
				
				if (data.success) {
					setTenants(data.users);
				}
			} catch (error) {
				console.error('Failed to fetch tenants:', error);
			} finally {
				setLoading(false);
			}
		};
		
		fetchTenants();
	}, []);

	const handleSubmit = (values: PropertyFormValues) => {
    console.log('values', values);
		const unitsWithLeaseType = values.units.map((unit) => ({
			...unit,
			leaseType: unit.leaseType || 'lease',
		}));

		const propertyData: PropertyDocument = {
			...values,
			units: unitsWithLeaseType as PropertyUnit[],
			landlordId,
			createdAt: initialData?.createdAt || new Date(),
			updatedAt: new Date(),
			address: {
				street: values.address.street,
				city: values.address.city,
				state: values.address.state,
				zipCode: values.address.zipCode,
				country: values.address.country,
			},
			features: {
				squareFeet: values.features.squareFeet,
				yearBuilt: values.features.yearBuilt,
				hasParking: values.features.hasParking,
				hasAC: values.features.hasAC,
				hasHeating: values.features.hasHeating,
				petsAllowed: values.features.petsAllowed,
				amenities: values.features.amenities,
			},
			financials: {
				purchasePrice: values.financials.purchasePrice,
				currentValue: values.financials.currentValue,
				propertyTaxes: values.financials.propertyTaxes,
				insuranceCost: values.financials.insuranceCost,
				maintenanceReserve: values.financials.maintenanceReserve,
			},
			isActive: values.isActive,
			propertyType: values.propertyType,
			notes: values.notes,
		};

		const property = new Property(propertyData);

		console.log('Property submitted:', property.toDocument());

		if (onSubmit) {
			onSubmit(property);
		}
	};

	const propertyTypes: { value: PropertyType; label: string }[] = [
		{ value: 'single-family', label: 'Single Family' },
		{ value: 'duplex', label: 'Duplex' },
		{ value: 'triplex', label: 'Triplex' },
		{ value: 'quadplex', label: 'Quadplex' },
		{ value: 'multi-family', label: 'Multi-Family' },
		{ value: 'condo', label: 'Condo' },
		{ value: 'townhouse', label: 'Townhouse' },
		{ value: 'apartment-building', label: 'Apartment Building' },
		{ value: 'commercial', label: 'Commercial' },
	];

  const tabsList = ['address', 'features', 'financials', 'units'];

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
				<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'address' | 'features' | 'financials' | 'units')} className='w-full'>
					<TabsList className='flex gap-4'>
						<TabsTrigger
							value='address'
							className='bg-white w-auto cursor-pointer hover:bg-gray-800 hover:text-white'>
							Address
						</TabsTrigger>
						<TabsTrigger
							value='features'
							className='bg-white w-auto cursor-pointer hover:bg-gray-800 hover:text-white'>
							Features
						</TabsTrigger>
						<TabsTrigger
							value='financials'
							className='bg-white w-auto cursor-pointer hover:bg-gray-800 hover:text-white'>
							Financials
						</TabsTrigger>
						<TabsTrigger
							value='units'
							className='bg-white w-auto cursor-pointer hover:bg-gray-800 hover:text-white'>
							Units
						</TabsTrigger>
					</TabsList>

					<TabsContent value='address' className='space-y-6 '>
						<Card className='bg-white border-none'>
							<CardHeader>
								<CardTitle>Property Address</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<FormField
									control={form.control}
									name='address.street'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Street Address</FormLabel>
											<FormControl>
												<Input
													placeholder='123 Main St'
													className='bg-white border-gray-200'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='grid grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='address.city'
										render={({ field }) => (
											<FormItem>
												<FormLabel>City</FormLabel>
												<FormControl>
													<Input
														placeholder='City'
														className='bg-white border-gray-200'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='address.state'
										render={({ field }) => (
											<FormItem>
												<FormLabel>State</FormLabel>
												<FormControl>
													<Input
														placeholder='State'
														className='bg-white border-gray-200'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='address.zipCode'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Zip Code</FormLabel>
												<FormControl>
													<Input
														placeholder='12345'
														className='bg-white border-gray-200'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='address.country'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Country</FormLabel>
												<FormControl>
													<Input
														placeholder='Country'
														disabled
														className='bg-white disabled:bg-gray-100 border-gray-200'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name='propertyType'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Property Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger className='bg-white border-gray-200'>
														<SelectValue placeholder='Select property type' />
													</SelectTrigger>
												</FormControl>
												<SelectContent className='bg-white border-none'>
													{propertyTypes.map((type) => (
														<SelectItem key={type.value} value={type.value}>
															{type.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormDescription className='text-sm text-gray-500'>
												This will be automatically determined based on units,
												but you can override it.
											</FormDescription>
											<FormMessage className='text-red-500'/>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='isActive'
									render={({ field }) => (
										<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md '>
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className='space-y-1 leading-none'>
												<FormLabel>Active Property</FormLabel>
												<FormDescription className='text-sm text-gray-500'>
													Inactive properties won&apos;t appear in reports and
													dashboards.
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='features' className='space-y-6'>
						<Card className='bg-white border-none'>
							<CardHeader>
								<CardTitle>Property Features</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='features.squareFeet'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Total Square Feet</FormLabel>
												<FormControl>
													<Input type='number' className='bg-white border-gray-200' {...field} />
												</FormControl>
												<FormMessage className='text-red-500'/>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='features.yearBuilt'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Year Built</FormLabel>
												<FormControl>
													<Input type='number' className='bg-white border-gray-200' {...field} />
												</FormControl>
												<FormMessage className='text-red-500'/>
											</FormItem>
										)}
									/>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='features.hasParking'
										render={({ field }) => (
											<FormItem className='flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4 bg-white border-gray-200'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className='space-y-1 leading-none'>
													<FormLabel>Parking Available</FormLabel>
												</div>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='features.hasAC'
										render={({ field }) => (
											<FormItem className='flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4 bg-white border-gray-200'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className='space-y-1 leading-none'>
													<FormLabel>Air Conditioning</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='features.hasHeating'
										render={({ field }) => (
											<FormItem className='flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4 bg-white border-gray-200'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className='space-y-1 leading-none'>
													<FormLabel>Heating System</FormLabel>
												</div>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='features.petsAllowed'
										render={({ field }) => (
											<FormItem className='flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4 bg-white border-gray-200'>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className='space-y-1 leading-none'>
													<FormLabel>Pets Allowed</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='financials' className='space-y-6'>
						<Card className='bg-white border-none'>
							<CardHeader>
								<CardTitle>Financial Details</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='financials.purchasePrice'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Purchase Price ($)</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='financials.currentValue'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Current Value ($)</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='grid grid-cols-3 gap-4'>
									<FormField
										control={form.control}
										name='financials.propertyTaxes'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Annual Property Taxes ($)</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='financials.insuranceCost'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Annual Insurance ($)</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='financials.maintenanceReserve'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Monthly Maintenance ($)</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='units' className='space-y-6'>
						<Card className='bg-white border-none'>
							<CardHeader className='flex flex-row items-center justify-between'>
								<CardTitle>Property Units</CardTitle>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => {
										append({
											unitNumber: `${fields.length + 1}`,
											bedrooms: 0,
											bathrooms: 0,
											squareFeet: 0,
											monthlyRent: 0,
											securityDeposit: 0,
											leaseTermMonths: 12,
											leaseType: 'lease',
											isActive: true,
											tenantId: undefined,
										});
									}}>
									<PlusCircle className='mr-2 h-4 w-4' />
									Add Unit
								</Button>
							</CardHeader>
							<CardContent className='space-y-6'>
								{fields.map((field, index) => (
									<Card
										key={field.id}
										className='relative bg-white border-none'>
										<CardHeader className='pb-2'>
											<div className='flex justify-between items-center'>
												<CardTitle className='text-lg'>
													Unit {index + 1}
												</CardTitle>
												{fields.length > 1 && (
													<Button
														type='button'
														variant='ghost'
														size='sm'
														onClick={() => remove(index)}
														className='text-red-500 hover:text-red-700'>
														<Trash2 className='h-4 w-4' />
													</Button>
												)}
											</div>
										</CardHeader>
										<CardContent className='space-y-4'>
											<FormField
												control={form.control}
												name={`units.${index}.unitNumber`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Unit Number/Name</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div className='grid grid-cols-3 gap-4'>
												<FormField
													control={form.control}
													name={`units.${index}.bedrooms`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Bedrooms</FormLabel>
															<FormControl>
																<Input type='number' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name={`units.${index}.bathrooms`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Bathrooms</FormLabel>
															<FormControl>
																<Input type='number' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name={`units.${index}.squareFeet`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Square Feet</FormLabel>
															<FormControl>
																<Input type='number' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className='grid grid-cols-3 gap-4'>
												<FormField
													control={form.control}
													name={`units.${index}.monthlyRent`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Monthly Rent ($)</FormLabel>
															<FormControl>
																<Input type='number' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name={`units.${index}.securityDeposit`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Security Deposit ($)</FormLabel>
															<FormControl>
																<Input type='number' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name={`units.${index}.leaseTermMonths`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Lease Term (months)</FormLabel>
															<FormControl>
																<Input type='number' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<FormField
												control={form.control}
												name={`units.${index}.tenantId`}
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel>Tenant</FormLabel>
														<Popover >
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant="outline"
																		role="combobox"
																		className={`w-auto max-w-sm justify-between bg-white border-gray-200 ${!field.value && "text-muted-foreground"}`}
																	>
																		{field.value ? 
																			tenants.find((tenant) => tenant.id === field.value)?.firstName + ' ' + 
																			tenants.find((tenant) => tenant.id === field.value)?.lastName
																			: "Select tenant"}
																		<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent className="bg-white border-gray-200" align='start'>
																<Command>
																	<CommandInput disabled={loading || tenants.length === 0} placeholder="Search tenant..." />
																	<CommandEmpty>No tenant found.</CommandEmpty>
																	<CommandGroup>
																		{tenants.map((tenant) => (
																			<CommandItem
																				key={tenant.id}
																				value={tenant.id}
																				onSelect={() => {
																					form.setValue(`units.${index}.tenantId`, tenant.id);
																				}}
																			>
																				<Avatar className="h-6 w-6 mr-2">
																					<AvatarFallback>{tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}</AvatarFallback>
																				</Avatar>
																				{tenant.firstName} {tenant.lastName}
																				<Check
																					className={`ml-auto h-4 w-4 ${
																						tenant.id === field.value ? "opacity-100" : "opacity-0"
																					}`}
																				/>
																			</CommandItem>
																		))}
																	</CommandGroup>
																</Command>
															</PopoverContent>
														</Popover>
														<FormDescription className='text-xs text-gray-500'>
															Assign a tenant to this unit
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name={`units.${index}.isActive`}
												render={({ field }) => (
													<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<div className='space-y-1 leading-none'>
															<FormLabel>Active Unit</FormLabel>
															<FormDescription>
																Inactive units won&apos;t be included in vacancy
																calculations.
															</FormDescription>
														</div>
													</FormItem>
												)}
											/>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				<FormField
					control={form.control}
					name='notes'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Add any additional notes about this property...'
									className='min-h-[100px] bg-white border-gray-200'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-between'>
					<Button
						type='button'
						variant='outline'
						className='disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed border-gray-200'
						onClick={() => {
							const currentIndex = tabsList.indexOf(activeTab);
							const prevTab = tabsList[
								Math.max(0, currentIndex - 1)
							];
							setActiveTab(prevTab as 'address' | 'features' | 'financials' | 'units');
						}}
						disabled={activeTab === 'address'}>
						Previous
					</Button>

					{activeTab !== 'units' ? (
						<Button
							type='button'
							className='bg-gray-800 text-white cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
							onClick={() => {
								const currentIndex = tabsList.indexOf(activeTab);

								const nextTab = tabsList[
									Math.min(tabsList.length - 1, currentIndex + 1)
								];
								setActiveTab(nextTab as 'address' | 'features' | 'financials' | 'units');
							}}>
							Next
						</Button>
					) : (
						<Button type='submit' className='bg-green-500 hover:bg-green-600 text-white font-bold cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'>
							{initialData ? 'Update Property' : 'Create Property'}
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}
