'use client';
import Button from '@/components/Buttons/Button';
import Banner from '@/components/Banners/Banner';
import Section from '@/components/Section/Section';
import { PROCESSES, SITUATIONS } from '@/lib/conts';
import { ProcessCardProps } from '@/types/type';
export default function SellingPage() {
	return (
		<div className='w-full h-auto grid grid-cols-1 gap-12'>
			<Banner
				backgroundImage='https://imagedelivery.net/s-Qoq_uGoAvrpxHuBogfVA/00abeac7-a3ab-40ca-a411-9edb04552000/public'
				styles={{
					wrapper: 'h-screen',
				}}>
				<div className='h-full w-full relative flex justify-center items-center md:w-1/2'>
					<div className='bg-black opacity-90 h-full w-full mix-blend-multiply absolute'></div>
					<div className='w-auto max-w-2xl md:max-w-lg h-auto absolute grid gap-3 md:gap-8 p-8 py-12 top-14 md:top-auto'>
						<h1 className='text-white font-bold'>
							Selling
							<br />
							Your Home
							<br />
							Made Simple:
						</h1>
						<h3 className='text-white'>Get Professional Help Today</h3>
						<p className='text-white'>
							Unlock a swift solution for your distressed property with our
							hassle-free cash purchase service. Whether facing foreclosure,
							structural issues, or a property in disrepair, we specialize in
							purchasing homes as-is, removing the burden of repairs and the
							uncertainty of the market. Receive a fair cash offer and a quick
							closing, providing you the relief and peace of mind you deserve.
							Let us turn your distressed property into a stress-free
							transaction.
						</p>
						<div className='w-full h-auto flex justify-center mt-4 md:mt-8'>
							<Button modal='seller-form' classNames='bg-green-600'>
								get an offer
							</Button>
						</div>
					</div>
				</div>
			</Banner>

			<Section
				header='Who do we help'
				styles={{
					container: 'max-w-7xl p-6 grid grid-cols-1 gap-6 md:gap-8',
				}}>
				<ul className='h-auto w-full grid grid-cols-1 gap-6 md:grid-cols-2'>
					{SITUATIONS.map((situation, index) => (
						<li key={`situation-${index}`}>
							<p>
								<span className='font-bold'>{situation.type}: </span>
								{situation.description}
							</p>
						</li>
					))}
				</ul>
				<p>
					Let us ease your burden. Our solutions are tailored to your unique
					situation. Get in touch today.
				</p>
				<div className='w-full h-auto flex justify-center mt-8 md:mt-12'>
					<Button modal='seller-form' classNames='px-12'>
						sell my property
					</Button>
				</div>
			</Section>

			<Section
				header='Our process'
				styles={{
					container: 'max-w-7xl p-6 grid grid-cols-1 gap-6 md:gap-8',
				}}>
				<ul className='h-auto w-full grid grid-cols-1 gap-16 md:grid-cols-3'>
					{PROCESSES.map((process: ProcessCardProps, index) => (
						<li
							key={`process_card-${index}`}
							className='w-auto h-full grid grid-cols-1 gap-6 justify-start pb-12'>
							<div className='w-full h-auto grid grid-cols-1 gap-4'>
								{process?.image}
								{process?.header && (
									<h4 className='font-bold text-center'>
										{index + 1 + '. ' + process.header}
									</h4>
								)}
							</div>
							<div className='w-full h-auto grid grid-cols-1 gap-12'>
								{process?.content && <p>{process.content}</p>}
								<div className='w-full h-auto flex justify-center mt-auto'>
									{process?.button}
								</div>
							</div>
						</li>
					))}
				</ul>
			</Section>

			<Section
				styles={{
					container: 'max-w-7xl grid grid-cols-1 md:grid-cols-2',
				}}>
				<div className='w-full h-auto bg-black p-6 py-12 md:p-12 grid grid-cols-1 gap-6 order-1 md:order-0'>
					<h3 className='font-bold text-white'>Our story</h3>
					<div className='w-full h-auto grid grid-cols-1 gap-6'>
						<p className='text-white'>
							At <span className='font-bold'>ANRD Group Inc</span>, we are more
							than just an investment group – we are a compassionate force
							driven by the desire to make a difference when it matters most.
							Our mission is clear: seize opportunities to extend a helping hand
							to those in need. With over 8 years of expertise in building
							software technology, our asset management team has seamlessly
							transitioned into the world of real estate investment.
							Collaborating with dedicated business partners, we have cultivated
							opportunities into a shining success story over the years.
						</p>
						<p className='text-white'>
							While we&apos;re still young, our growth is rapid and purposeful.
							We&apos;re committed to expanding our reach to meet a wider array
							of needs within communities. Today, our company thrives on more
							than just profits; it thrives on uplifting neighborhoods that
							require assistance. We recognize that real estate holds the power
							to transform lives, and we&apos;re committed to utilizing our
							resources to catalyze positive change.
						</p>
						<p className='text-white'>
							What sets us apart is our embrace of technology. Unlike
							traditional methods, we leverage cutting-edge technology to
							enhance our ability to thrive in the markets we pour our efforts
							into. From data-driven insights to streamlined processes, we
							harness innovation to maximize impact. Join us on our journey as
							we blend financial insight with a humanitarian spirit, utilizing
							technology to create lasting change in the lives of those we
							serve.
						</p>
					</div>
				</div>
				<div
					className='w-full h-full relative overflow-hidden bg-cover bg-no-repeat order-0 md:order-1'
					style={{
						minHeight: '500px',
						backgroundImage: `url(${'https://imagedelivery.net/s-Qoq_uGoAvrpxHuBogfVA/c3382fe8-5d06-4b59-0d69-202cf219f700/public'})`,
					}}
				/>
			</Section>
		</div>
	);
}
