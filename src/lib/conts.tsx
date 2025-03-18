import Icons from '@/components/Icons/Icons';
import Button from '@/components/Buttons/Button';
import type { ProcessCardProps, SituationProps } from '@/types/type';

export type ENUM_DIALOGS_TYPE = 'seller-form' | 'seller-full-form' | 'create-user';
export const ENUM_DIALOGS: Array<ENUM_DIALOGS_TYPE> = ['seller-form', 'seller-full-form', 'create-user'];

export const SITUATIONS: Array<SituationProps> = [
	{
		type: 'Vacant Properties',
		description:
			"Don't let your vacant property drain your finances. Mortgages, taxes, and maintenance costs pile up, while the value decreases.",
	},
	{
		type: 'Properties Unfit for Financing',
		description:
			"Traditional buyers can't get mortgages for properties in poor condition, causing months of delays and frustrations.",
	},
	{
		type: 'Distressed Properties',
		description:
			'Behind on payments, unpaid taxes, facing foreclosure or liens? We specialize in helping families escape these difficult situations.',
	},
	{
		type: 'Financial Hardships',
		description:
			'Medical bills, unemployment, rising costs – we understand that families need to sell quickly due to financial stress.',
	},
	{
		type: 'Personal Crisis and Family Death',
		description:
			'Inherited properties or those tied to divorce often need swift sales for legal or financial reasons.',
	},
];

export const PROCESSES: Array<ProcessCardProps> = [
	{
		image: (
			<div className='w-full h-auto flex justify-center'>
				<div className='w-28 h-auto px-2 mb-3'>
					<Icons variant='file-search' />
				</div>
			</div>
		),
		header: "Let's Talk About Your Home",
		content:
			'Crafting the perfect buying price involves analyzing key factors: property condition, comparable sales, location advantages, size, layout, upgrades, local trends, and market conditions. We factor in historical sales, regulations, and appraisal insights. With a keen eye on repair costs, we ensure a close to accurate valuation, guiding you toward informed decisions and maximizing value for both parties.',
		button: (
			<Button modal={'seller-form'} classNames='px-12'>
				<span>submit details</span>
			</Button>
		),
	},
	{
		image: (
			<div className='w-full h-auto flex justify-center'>
				<div className='w-28 h-auto'>
					<Icons variant='money' />
				</div>
			</div>
		),
		header: "Let's Talk Numbers",
		content:
			"After discovering your property's potential with our thorough analysis. We collect crucial property details and employ advanced methods to pinpoint precise comparables, calculate the After Repair Value (ARV), and determine the Maximum Allowable Offer (MAO). Get informed, make confident decisions, and unlock your property's true value with us.",
		button: (
			<Button modal={'seller-form'} classNames='px-12'>
				<span>get an offer</span>
			</Button>
		),
	},
	{
		image: (
			<div className='w-full h-auto flex justify-center'>
				<div className='w-28 h-auto'>
					<Icons variant='fast-home' />
				</div>
			</div>
		),
		header: "Let's Cash Out",
		content:
			'Once the numbers align and our agreement is signed, the journey smoothly transitions to the next phase. We collaborate with a trusted title company to ensure a seamless transfer. Within a timeframe of just 15-30 days, your home sale is completed, delivering the swift, hassle-free outcome you deserve.',
		button: (
			<Button modal={'seller-form'} classNames='px-12'>
				<span>get your money</span>
			</Button>
		),
	},
];

export const US_STATES = [
	'AL', // Alabama
	'AK', // Alaska
	'AZ', // Arizona
	'AR', // Arkansas
	'CA', // California
	'CO', // Colorado
	'CT', // Connecticut
	'DE', // Delaware
	'FL', // Florida
	'GA', // Georgia
	'HI', // Hawaii
	'ID', // Idaho
	'IL', // Illinois
	'IN', // Indiana
	'IA', // Iowa
	'KS', // Kansas
	'KY', // Kentucky
	'LA', // Louisiana
	'ME', // Maine
	'MD', // Maryland
	'MA', // Massachusetts
	'MI', // Michigan
	'MN', // Minnesota
	'MS', // Mississippi
	'MO', // Missouri
	'MT', // Montana
	'NE', // Nebraska
	'NV', // Nevada
	'NH', // New Hampshire
	'NJ', // New Jersey
	'NM', // New Mexico
	'NY', // New York
	'NC', // North Carolina
	'ND', // North Dakota
	'OH', // Ohio
	'OK', // Oklahoma
	'OR', // Oregon
	'PA', // Pennsylvania
	'RI', // Rhode Island
	'SC', // South Carolina
	'SD', // South Dakota
	'TN', // Tennessee
	'TX', // Texas
	'UT', // Utah
	'VT', // Vermont
	'VA', // Virginia
	'WA', // Washington
	'WV', // West Virginia
	'WI', // Wisconsin
	'WY', // Wyoming
];

export const KLAVIYO_API = {
	PROFILES: 'https://a.klaviyo.com/api/profiles/',
	SUBSCRIBE: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
};

export const CALLBACK_URL = '/dashboard';