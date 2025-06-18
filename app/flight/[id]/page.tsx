'use client';

import FlightModal from '@/components/flight-modal';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Flight {
	id: string;
	departure: string;
	destination: string;
	datetime: string;
	spotsLeft: number;
	aircraft: string;
	notes: string;
}

export default function FlightPage() {
	const router = useRouter();
	const params = useParams();
	const flightId = params?.id as string;

	const [flight, setFlight] = useState<Flight | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFlight = async () => {
			try {
				const res = await fetch(`/api/flight/${flightId}`);
				if (!res.ok) {
					router.replace('/');
					return;
				}
				const data = await res.json();
				setFlight(data);
			} catch (err) {
				console.error('Error loading flight:', err);
				router.replace('/');
			} finally {
				setLoading(false);
			}
		};

		if (flightId) {
			fetchFlight();
		}
	}, [flightId, router.replace]);

	if (loading || !flight) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-amber-400">
				<p className="text-lg">Loading flight...</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-amber-400">
			<FlightModal
				flight={flight}
				onClose={() => router.push('/')}
				onBookingComplete={() => router.push('/')}
			/>
		</div>
	);
}
