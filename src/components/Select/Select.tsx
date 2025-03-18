import type { ReactNode } from 'react';
import React from 'react';

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
	children?: ReactNode;
	className?: string;
}

export default React.forwardRef(function Select(
	{ children, className, ...props }: SelectProps,
	ref: React.Ref<HTMLSelectElement>
) {
	return (
		<select
			ref={ref}
			className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green-300 ${className}`}
			{...props}>
			<option value=''>Select a state...</option>
			{children}
		</select>
	);
});
