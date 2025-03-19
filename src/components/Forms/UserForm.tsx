'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building, Home } from 'lucide-react';
import { useStore } from '@/utils/zustand/store';
import { Customer as CustomerType, Vendor as VendorType } from 'intuit-oauth';

type GenericFormValues = {
	firstName?: string;
	lastName?: string;
	organization?: string;
	phoneNumber?: string;
	email: string;
	password?: string;
	accountType: 'tenant' | 'landlord' | 'manager' | 'admin';
	intuitCustomerId?: string;
	syncToken?: string;
};

interface UserFormProps {
	isSignUp?: boolean;
	isManager?: boolean;
	onSubmit: (values: GenericFormValues) => Promise<void>;
	defaultValues?: Partial<GenericFormValues>;
}

export default function UserForm({
	isSignUp = true,
	onSubmit,
	defaultValues,
	isManager = false,
}: UserFormProps) {
	const {
		entries: { selectedUser },
		user: { account },
	} = useStore((state) => state);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const userFormSchema = z.object({
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		organization: z.string().optional(),
		phoneNumber: z.string().optional(),
		email: z.string().email('Invalid email address'),
		password: z.string()
			.min(8, 'Password must be at least 8 characters')
			.optional()
			.refine(val => {
				if (selectedUser?.user) return true;
				return !!val;
			}, {
				message: 'Password is required when creating a new user'
			}),
		accountType: z.enum(['tenant', 'landlord', 'manager', 'admin'] as const),
		intuitCustomerId: z.string().optional(),
		syncToken: z.string().optional(),
	});

	type UserFormValues = z.infer<typeof userFormSchema>;

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: defaultValues || {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			accountType: 'tenant',
		},
	});

	const handleSubmit = async (values: UserFormValues) => {
		setIsSubmitting(true);
		setError(null);
		const updatedValues = {	
			...values,
			...(values.password ? { password: values.password } : {}),
			intuitCustomerId: selectedUser?.type === 'tenant' ? (selectedUser?.user as CustomerType)?.Id : selectedUser?.type === 'landlord' ? (selectedUser?.user as VendorType)?.Id : '',
			syncToken: selectedUser?.type === 'tenant' ? (selectedUser?.user as CustomerType)?.SyncToken : 
			selectedUser?.type === 'landlord' ? (selectedUser?.user as VendorType)?.SyncToken : '',
		};
		try {
			await onSubmit(updatedValues as GenericFormValues);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	const title = selectedUser?.user
		? 'Update account'
		: isManager
		? 'Create new account'
		: isSignUp
		? 'Create your account'
		: 'Sign in to your account';

	const description = selectedUser?.user
		? 'Update the user account information'
		: isManager
		? 'Enter information to create a new user account'
		: isSignUp
		? 'Enter your information to create an account'
		: 'Enter your credentials to access your account';

	const buttonText = selectedUser?.user
		? 'Update account'
		: isManager
		? 'Create account'
		: isSignUp
		? 'Create account'
		: 'Sign in';

	return (
		<Card className='w-full max-w-md mx-auto border-none bg-white'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold text-center'>
					{title}
				</CardTitle>
				<CardDescription className='text-center'>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-4'>
						{isSignUp && (
							<>
								<div className='grid grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='firstName'
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input placeholder='John' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='lastName'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input placeholder='Doe' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{form.watch('accountType') === 'landlord' && (
									<FormField
										control={form.control}
										name='organization'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Organization</FormLabel>
												<FormControl>
													<Input placeholder='Company Name' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}

								{!['landlord', 'tenant'].includes(
									account?.accountType || ''
								) && (
									<FormField
										control={form.control}
										name='accountType'
										render={({ field }) => (
											<FormItem className='space-y-3'>
												<FormLabel>Account Type</FormLabel>
												<FormControl>
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={field.value}
														className='grid grid-cols-2 gap-4'>
														<div
															className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
																field.value === 'tenant'
																	? 'border-indigo-500 bg-indigo-50'
																	: 'border-gray-200'
															}`}>
															<RadioGroupItem
																value='tenant'
																id='tenant'
																className='sr-only'
															/>
															<Label
																htmlFor='tenant'
																className='cursor-pointer flex flex-col items-center gap-2'>
																<Home className='h-6 w-6' />
																<span>Tenant</span>
															</Label>
														</div>

														<div
															className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
																field.value === 'landlord'
																	? 'border-indigo-500 bg-indigo-50'
																	: 'border-gray-200'
															}`}>
															<RadioGroupItem
																value='landlord'
																id='landlord'
																className='sr-only'
															/>
															<Label
																htmlFor='landlord'
																className='cursor-pointer flex flex-col items-center gap-2'>
																<Building className='h-6 w-6' />
																<span>Landlord</span>
															</Label>
														</div>
														{isManager && (
															<div
																className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
																	field.value === 'manager'
																		? 'border-indigo-500 bg-indigo-50'
																		: 'border-gray-200'
																}`}>
																<RadioGroupItem
																	value='manager'
																	id='manager'
																	className='sr-only'
																/>
																<Label
																	htmlFor='manager'
																	className='cursor-pointer flex flex-col items-center gap-2'>
																	<Building className='h-6 w-6' />
																	<span>Manager</span>
																</Label>
															</div>
														)}
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</>
						)}

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='john.doe@example.com'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{!selectedUser?.user && (
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className='flex gap-2 relative'>
												<div className='w-full h-auto flex items-center relative gap-2'>
													<Input
														type={showPassword ? 'text' : 'password'}
														placeholder='••••••••'
														{...field}
														className='pr-10'
													/>
													<button
														type='button'
														className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
														onClick={() => setShowPassword(!showPassword)}
														tabIndex={-1}>
														{showPassword ? (
															<svg
																xmlns='http://www.w3.org/2000/svg'
																className='h-5 w-5'
																viewBox='0 0 20 20'
																fill='currentColor'>
																<path
																	fillRule='evenodd'
																	d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
																	clipRule='evenodd'
																/>
																<path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
															</svg>
														) : (
															<svg
																xmlns='http://www.w3.org/2000/svg'
																className='h-5 w-5'
																viewBox='0 0 20 20'
																fill='currentColor'>
																<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
																<path
																	fillRule='evenodd'
																	d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
																	clipRule='evenodd'
																/>
															</svg>
														)}
													</button>
												</div>
												{isManager && (
													<Button
														type='button'
														className='bg-blue-500 hover:bg-blue-600 text-white'
														onClick={() => {
															const chars =
																'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
															let password = '';
															for (let i = 0; i < 8; i++) {
																password += chars.charAt(
																	Math.floor(Math.random() * chars.length)
																);
															}
															field.onChange(password);
														}}>
														Generate
													</Button>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{error && <div className='text-red-500 text-sm'>{error}</div>}

						<Button
							type='submit'
							className='w-full bg-green-500 hover:bg-green-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={isSubmitting}>
							{isSubmitting
								? 'Processing...'
								: buttonText}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex justify-center'>
				<div className='text-sm text-center'>
					{!isManager &&
						(isSignUp ? (
							<Link
								href='/login'
								className='font-medium text-gray-600 hover:text-gray-500'>
								Already have an account? Sign in
							</Link>
						) : (
							<Link
								href='/signup'
								className='font-medium text-gray-600 hover:text-gray-500'>
								Don&apos;t have an account? Sign up
							</Link>
						))}
				</div>
			</CardFooter>
		</Card>
	);
}
