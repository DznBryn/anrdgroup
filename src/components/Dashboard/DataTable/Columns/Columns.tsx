import { MoreHorizontal } from "lucide-react";
import { Customer } from "intuit-oauth";

import { Button } from "@/components/ui/button";

import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DropdownMenuContent } from "@/components/ui/dropdown-menu";

import { DropdownMenu } from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
export const columns: ColumnDef<Customer>[] = [
		{
			accessorKey: 'Active',
			header: 'Active',
		},
		{
			accessorKey: 'DisplayName',
			header: 'Tenant',
			cell: ({ row }) => {
				const displayName = row.original.DisplayName;
				return (
					<Link
						href={`/dashboard/tenant/${row.original.Id}`}
						className='block hover:bg-gray-100 transition-colors'>
						<p className='font-medium'>{displayName}</p>
					</Link>
				);
			},
		},
		{
			accessorKey: 'PrimaryEmailAddr.Address',
			header: 'Email',
			cell: ({ row }) => {
				const email = row.original.PrimaryEmailAddr?.Address;
				return <div className='text-sm text-gray-500'>{email}</div>;
			},
		},
		{
			accessorKey: 'Balance',
			header: ({ column }) => (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Balance
				</Button>
			),
			cell: ({ row }) => {
				const balance = parseFloat(row.getValue('Balance'));
				const formatted = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(balance);
				return (
					<div
						className={`${
							balance > 0 ? 'text-red-500' : 'text-green-500'
						} text-right`}>
						{formatted}
					</div>
				);
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const tenant = row.original;
        
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='bg-white border-none'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => window.open(`/dashboard/tenant/${tenant.Id}`, '_blank')}>
								View tenant details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem >Update tenant</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	  ];