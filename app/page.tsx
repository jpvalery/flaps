'use client';

import FlightModal from '@/components/flight-modal';
import SplitFlapBoard from '@/components/split-flap/split-flap-board';
import SubscribeForm from '@/components/subscribe-form';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
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

export default function Home() {
	const [flights, setFlights] = useState<Flight[]>([]);
	const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchFlights() {
			try {
				const response = await fetch('/api/flights');
				if (response.ok) {
					const flightsData = await response.json();
					setFlights(flightsData);
				}
			} catch (error) {
				console.error('Error fetching flights:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchFlights();
	}, []);

	const refreshFlights = async () => {
		try {
			const response = await fetch('/api/flights');
			if (response.ok) {
				const flightsData = await response.json();
				setFlights(flightsData);
			}
		} catch (error) {
			console.error('Error refreshing flights:', error);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-amber-400">
				<div className="text-center">
					<div className="mx-auto mb-4 size-12 animate-spin rounded-full border-amber-400 border-b-2" />
					<p className="text-lg">Loading flight information...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-zinc-950 text-amber-400">
			{/* Header */}
			<Header title="NEXT DEPARTURES" subtitle="" />

			{/* Main Content */}
			<main className="container mx-auto grid min-h-[75dvh] grid-flow-row gap-8 px-4 py-8">
				<div className="mx-auto max-w-6xl">
					{/* Board Header */}
					<section className="hidden lg:inline">
						<div className="rounded-t-lg border border-amber-700/40 bg-zinc-900 p-4">
							<div className="grid grid-cols-12 gap-2 font-semibold text-amber-500 text-sm tracking-wider">
								<div className="col-span-2">DEPARTURE</div>
								<div className="col-span-5">DESTINATION</div>
								<div className="col-span-4">SCHEDULED</div>
								<div className="col-span-1 text-center">SEATS</div>
							</div>
						</div>
					</section>

					{/* Split Flap Board */}
					<div className="overflow-hidden rounded-b-lg border-amber-600/30 border-x border-b bg-zinc-900 max-lg:rounded-lg max-lg:border">
						{flights.length > 0 ? (
							<SplitFlapBoard flights={flights} onFlightClick={setSelectedFlight} />
						) : (
							<p className="text-amber-300">No flights available at this time.</p>
						)}
					</div>
				</div>
				<SubscribeForm />
			</main>

			{/* Flight Modal */}
			{selectedFlight && (
				<FlightModal
					flight={selectedFlight}
					onClose={() => setSelectedFlight(null)}
					onBookingComplete={refreshFlights}
				/>
			)}

			{/* Footer */}
			<Footer />
		</div>
	);
}
