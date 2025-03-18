'use client';

// import { useState } from 'react';
// import { useFormStatus } from 'react-dom';
import { useStore } from '@/utils/zustand/store';
// import Input from '@/components/Inputs/Input';
// import Button from '@/components/Buttons/Button';
// import { submitSellerForm } from '@/app/actions';

export default function FullSellerLeadForm() {
	const { user } = useStore((store) => store.entries.form);
	// const [step] = useState(1);

	if (!user) return null;

	return (
		<></>
		// <div>
		// 	<h3 className='font-bold text-dark'>
		// 		{user?.attributes?.first_name?.toUpperCase() ?? ''} let&apos;s see what you
		// 		have.
		// 	</h3>
		// 	<form 
		// 		className='w-full grid grid-cols-1 gap-6'
		// 		action={async (formData: FormData) => {
		// 			'use server';
		// 			console.log(formData);
		// 			submitSellerForm(formData);
		// 		}}
		// 	>
		// 		<FormSlider />
		// 		<SubmitButton />
		// 	</form>
		// </div>
	);
}

// function SubmitButton() {
// 	const { pending } = useFormStatus();
	
// 	return (
// 		<div className='w-full h-auto grid grid-cols-1 gap-6'>
// 			<Button 
// 				type='submit'
// 				classNames='w-full'
// 				disabled={pending}
// 			>
// 				{pending ? 'Submitting...' : 'Submit'}
// 			</Button>
// 		</div>
// 	);
// }

// function FormSlider() {
// 	return (
// 		<div className='w-full grid grid-cols-1 gap-6'>
// 			<div className='w-full h-auto grid grid-cols-1 gap-6'>
// 				<Input
// 					type='text'
// 					name='address'
// 					placeholder='Address (e.g 123 Main St)'
// 					required
// 				/>
// 				<div className='w-full h-auto grid grid-cols-3 gap-2 sm:gap-6'>
// 					<Input 
// 						type='text' 
// 						name='city' 
// 						placeholder='City' 
// 						required 
// 					/>
// 				</div>
// 				<Input 
// 					required 
// 					name='email' 
// 					type='email' 
// 					placeholder='Email' 
// 				/>
// 			</div>
// 		</div>
// 	);
// }
