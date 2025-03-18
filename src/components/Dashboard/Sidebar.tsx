'use client';

import { useStore } from '@/utils/zustand/store';
import Link from 'next/link';
import packageInfo from '../../../package.json';
import Icons from '../Icons/Icons';
import { Button } from '../ui/button';
import { FaPowerOff } from 'react-icons/fa6';
import { useSignOut } from '@/utils/auth';
import {
	SidebarHeader,
	SidebarContent,
	SidebarGroup,
	SidebarFooter,
	Sidebar,
	SidebarMenu,
	SidebarMenuItem,
	SidebarGroupContent,
	SidebarMenuButton,
} from '../ui/sidebar';

export default function SidebarPage() {
	const { account } = useStore((state) => state.user);
	const AccountType = {
		tenant: account?.accountType === 'tenant',
		landlord: account?.accountType === 'landlord',
		admin: account?.accountType === 'admin',
		manager: account?.accountType === 'manager',
	};
	const capitalize = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const signOut = useSignOut();
	return (
		<Sidebar className='bg-gray-900'>
			<SidebarHeader className='bg-gray-900'>
				<div className='flex gap-2 items-center w-full max-w-full'>
					<div className='flex flex-col p-2 px-4 '>
						<p className='text-gray-400 text-sm font-bold'>Welcome</p>
						<h2 className='text-xl font-bold text-white'>
							{account?.firstName && capitalize(account.firstName)}
						</h2>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className='bg-gray-900'>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{(AccountType.admin || AccountType.manager) && (
								<>
									<SidebarMenuItem>
										<SidebarMenuButton className='hover:bg-gray-800'>
											<Link
												href='/dashboard'
												className='block p-2 px-4  text-white'>
												Dashboard
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton className='hover:bg-gray-800'>
											<Link
												href='/dashboard/properties'
												className='block p-2 px-4  text-white'>
												Properties
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</>
							)}
							{AccountType.tenant && (
								<>
									<SidebarMenuItem>
										<SidebarMenuButton className='hover:bg-gray-800'>
											<Link
												href='/dashboard'
												className='block p-2 px-4  text-white'>
												Dashboard
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton className='hover:bg-gray-800'>
											<Link
												href='/dashboard/properties'
												className='block p-2 px-4  text-white'>
												Properties
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</>
							)}
							{AccountType.landlord && (
								<>
									<SidebarMenuItem>
										<SidebarMenuButton className='hover:bg-gray-800'>
											<Link
												href='/dashboard'
												className='block p-2 px-4  text-white'>
												Dashboard
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton className='hover:bg-gray-800'>
											<Link
												href='/dashboard/properties'
												className='block p-2 px-4  text-white'>
												Properties
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</>
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter className='flex flex-col gap-6 items-center sticky bottom-0 p-4 text-center bg-gray-900'>
				<Button
					variant={'default'}
					className='w-auto h-auto cursor-pointer text-white flex items-center gap-2 font-bold bg-gray-600 hover:bg-gray-700 p-4'
					onClick={signOut}>
					<FaPowerOff color='white' fontSize={'8em'} /> Sign Out
				</Button>
				<div className='w-20'>
					<Icons variant='logo' color='fill-gray-400' />
				</div>
				<p className='text-gray-400 text-sm font-bold'>
					v{packageInfo.version}
				</p>
			</SidebarFooter>
		</Sidebar>
	);
}

{
	/* <div className='w-full max-w-48  bg-gray-900 border-r min-h-screen p-6 px-0 flex flex-col justify-between'>
	<div className='space-y-6'>
		<div className='flex gap-2 items-center w-full max-w-full'>
			<div className='flex flex-col p-2 px-4 '>
				<p className='text-gray-400 text-sm font-bold'>Welcome</p>
				<h2 className='text-xl font-bold text-white'>
					{account?.firstName && capitalize(account.firstName)}
				</h2>
			</div>
			<Button
				variant={'default'}
				className='w-auto h-auto hover:bg-gray-800'
				onClick={signOut}>
				<FaPowerOff color='white' fontSize={'4rem'} />
			</Button>
		</div>

		{(AccountType.admin || AccountType.manager) && (
			<nav className='space-y-1'>
				<Link
					href='/dashboard'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Manager Portal
				</Link>
				<Link
					href='/dashboard/properties'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Properties
				</Link>
			</nav>
		)}
		{AccountType.tenant && (
			<nav className='space-y-1'>
				{(AccountType.admin || AccountType.manager) && (
					<Link
						href='/dashboard'
						className='block p-2 px-4 hover:bg-gray-800 text-white'>
						Dashboard
					</Link>
				)}
				<Link
					href='/dashboard/tenant/documents'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Shared Documents
				</Link>
				<Link
					href='/dashboard/tenant/reports'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Maintenance
				</Link>
				<Link
					href='/dashboard/tenant/account'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Account
				</Link>
			</nav>
		)}
		{AccountType.landlord && (
			<nav className='space-y-1'>
				<Link
					href='/dashboard/landlord'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Overview
				</Link>
				<Link
					href='/dashboard/landlord/properties'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Properties
				</Link>
				<Link
					href='/dashboard/landlord/rent-roll'
					className='block p-2 px-4 hover:bg-gray-800 text-white'>
					Rent Roll
				</Link>
			</nav>
		)}
	</div>

	<div className='flex flex-col items-center sticky bottom-0 p-4 text-center bg-gray-900'>
		<div className='w-20 mb-4'>
			<Icons variant='logo' color='fill-gray-400' />
		</div>
		<p className='text-gray-400 text-sm font-bold'>v{packageInfo.version}</p>
	</div>
</div>; */
}
