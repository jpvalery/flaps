'use client';

import FlightModal from '@/components/flight-modal';
import SplitFlapBoard from '@/components/split-flap-board';
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
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-amber-400 border-b-2" />
					<p className="text-lg">Loading flight information...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 text-amber-400">
			{/* Header */}
			<header className="border-amber-700/40 border-b bg-zinc-900 py-6">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h1 className="mb-2 font-bold text-4xl tracking-wider md:text-6xl">
							NEXT DEPARTURES
						</h1>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-6xl">
					{/* Board Header */}
					<div className="rounded-t-lg border border-amber-700/40 bg-zinc-900 p-4">
						<div className="grid grid-cols-12 gap-2 font-semibold text-amber-500 text-sm tracking-wider">
							<div className="col-span-2">DEPARTURE</div>
							<div className="col-span-5">DESTINATION</div>
							<div className="col-span-4">SCHEDULED</div>
							<div className="col-span-1 text-center">SEATS</div>
						</div>
					</div>

					{/* Split Flap Board */}
					{flights.length > 0 ? (
						<SplitFlapBoard flights={flights} onFlightClick={setSelectedFlight} />
					) : (
						<div className="rounded-b-lg border-amber-600/30 border-x border-b bg-zinc-900 p-8 text-center">
							<p className="text-amber-300">No flights available at this time.</p>
						</div>
					)}
				</div>
			</main>

			{/* Flight Modal */}
			{selectedFlight && (
				<FlightModal
					flight={selectedFlight}
					onClose={() => setSelectedFlight(null)}
					onBookingComplete={refreshFlights}
				/>
			)}
		</div>
	);
}
