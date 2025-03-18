'use client';

import React from 'react';
import Icons from '../Icons/Icons';
import DropDown, { DropDownItem } from '../DropDown/DropDown';
import { usePathname } from 'next/navigation';

interface Props {
	className?: string;
}

export default function Header({}: Props) {
	const pathname = usePathname();
	const isHomePage = pathname === '/';
	return (
		<div className={`w-full md:w-1/2 h-auto p-6 flex justify-between items-center absolute z-50 ${!isHomePage ? 'hidden' : ''}`}>
			{isHomePage ? (
				<>
					<div className='w-full h-auto grid grid-cols-2 gap-x-6'>
						<div className='w-16 md:w-20 h-auto'>
							<Icons variant='logo' color='fill-white' />
						</div>
					</div>
					<div className='w-auto h-auto'>
						<div className='w-max h-auto'>
							<DropDown
								text={
									<p className='text-white'>
										Call or Text Today <br />
										<span className='font-bold'>(609) 858-8881</span>
									</p>
								}
								className={'grid grid-cols-1'}>
								<DropDownItem>
									<a
										className='flex items-center gap-2 px-4 py-4 hover:bg-green hover:text-white'
										href='tel:+16098588881'>
										Call
									</a>
								</DropDownItem>
								<DropDownItem>
									<a
										className='flex items-center gap-2 px-4 py-4 hover:bg-green hover:text-white'
										href='sms:+16098588881'>
										Text
									</a>
								</DropDownItem>
							</DropDown>
						</div>
					</div>
				</>
			) : (
				<div></div>
			)}
		</div>
	);
}
