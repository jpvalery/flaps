export default function Footer() {
	return (
		<footer className="bg-zinc-950">
			<div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
				<p className="mt-8 text-center text-sm/6 text-zinc-600">
					&copy;{' '}
					{`${new Date().getFullYear()}${process.env.NEXT_PUBLIC_PILOT_NAME ? ` ${process.env.NEXT_PUBLIC_PILOT_NAME}` : ''} - All rights reserved.`}
				</p>
				<p className="mt-8 text-center text-sm/6 text-zinc-600">
					The listed flights are offered under the scope of the Private Pilot License
				</p>
			</div>
		</footer>
	);
}
