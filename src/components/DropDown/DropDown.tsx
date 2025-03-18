'use client';

import { Menu, Transition } from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';

type Props = {
	text: string | ReactNode;
	children?: ReactNode;
  className? : string
};

export default function DropDown({ text, className, children }: Props) {
	return (
		<Menu as={'div'} className={'relative'}>
			<div>
				<Menu.Button>{text}</Menu.Button>
			</div>
			{children ? (
				<Transition
					as={Fragment}
					enter='transition ease-out duration-100'
					enterFrom='transform opacity-0 scale-95'
					enterTo='transform opacity-100 scale-100'
					leave='transition ease-in duration-75'
					leaveFrom='transform opacity-100 scale-100'
					leaveTo='transform opacity-0 scale-95'>
					<Menu.Items
						className={`absolute right-0 mt-2 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded overflow-hidden focus:outline-none ${className}`}>
						{children}
					</Menu.Items>
				</Transition>
			) : null}
		</Menu>
	);
}

type DropDownItemProps = {
	children?: ReactNode;
};
export function DropDownItem({ children }: DropDownItemProps) {
	return children ? (
		<Menu.Item>{children}</Menu.Item>
	) : null;
}
