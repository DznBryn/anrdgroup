'use client';

import { Fragment, type ReactNode } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ENUM_DIALOGS, ENUM_DIALOGS_TYPE } from '@/lib/conts';
import { useStore } from '@/utils/zustand/store';
import CreateUserForm from '../Forms/UserForm';

export default function Modals() {
	const { modal: dialog, onChange, handleCreateUser } = useStore((store) => store.entries.modal);
	const isDialogValid = ENUM_DIALOGS.includes(dialog as ENUM_DIALOGS_TYPE);

	const mapDialogs: Record<string, ReactNode> = {
		'seller-form': (
			<DialogPanel
				className='w-full h-full sm:h-auto sm:w-auto max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all grid grid-cols-1 gap-6'
				style={{
					minWidth: '350px',
				}}>
			</DialogPanel>
		),
		'seller-full-form': (
			<DialogPanel
				className='w-full h-full sm:h-auto sm:w-auto max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all grid grid-cols-1 gap-6'
				style={{
					minWidth: '350px',
				}}>

			</DialogPanel>
		),
		'create-user': (
			<DialogPanel
				className='w-full h-full sm:h-auto max-w-4xl transform overflow-hidden rounded-2xl bg-transparent align-middle shadow-xl transition-all grid grid-cols-1 gap-6'
				style={{
					minWidth: '350px',
				}}>
				<CreateUserForm 
					onSubmit={async (values) => {
						if (values.email && values.password) {
							await handleCreateUser({
								...values,
								email: values.email,
								password: values.password
							});
						}
					}} 
					isManager={true} 
				/>
			</DialogPanel>
		),
	};

	return dialog && isDialogValid ? (
		<Transition
			appear
			show={Boolean(
				ENUM_DIALOGS.find(
					(typeOfDialog) => typeOfDialog.toLowerCase() === dialog
				)
			)}
			as={Fragment}>
			<Dialog as='div' className='relative z-50' onClose={() => onChange('')}>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black opacity-50' />
				</TransitionChild>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center bg-black/75'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							{mapDialogs[dialog]}
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	) : null;
}

