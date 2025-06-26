import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';

export const metadata: Metadata = {
	title: `Next Departures | ${process.env.NEXT_PUBLIC_PILOT_NAME}`,
	description: 'Come join me on my next flight',
	openGraph: {
		images: [
			{
				url: `https://og.jpvalery.me/api/og/flaps/${process.env.NEXT_PUBLIC_PILOT_NAME || 'Your Friendly Pilot'}`,
				width: 1200,
				height: 630,
				alt: '',
			},
		],
	},
	generator: 'v0.dev',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
