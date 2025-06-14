type HeaderProps = {
	title: string;
	subtitle: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
	return (
		<header className="border-amber-600/30 border-b bg-zinc-900 py-6">
			<div className="container mx-auto px-4">
				<div className="text-center">
					<h1 className="mb-2 font-bold text-4xl tracking-wider md:text-6xl">
						{title}
					</h1>
					<p className="text-amber-300/80 text-lg tracking-widest">{subtitle}</p>
				</div>
			</div>
		</header>
	);
}
