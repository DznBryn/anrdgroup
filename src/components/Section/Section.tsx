'use client';

import { SectionProps } from '@/types/type';

export default function Section({
	header,
	children,
	backgroundImage,
	styles,
}: SectionProps) {
	return (
		<div
			className={`w-full h-auto bg-cover bg-left-top sm:bg-center bg-no-repeat flex justify-center ${
				styles?.wrapper && styles.wrapper
			} ${styles?.backgroundColor ? styles.backgroundColor : 'bg-white'}`}
			style={{
				backgroundImage: backgroundImage ? `url(${backgroundImage})` : '',
			}}>
			<div
				className={`w-full h-auto ${
					styles?.container ? styles.container : ''
				}`}>
				{header && header !== '' ? (
					<h3 className='font-bold mb-4 md:mb-8 text-center'>{header}</h3>
				) : null}
				{children}
			</div>
		</div>
	);
}
