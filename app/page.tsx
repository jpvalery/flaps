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
			<div className="min-h-screen bg-zinc-950 text-amber-400 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
					<p className="text-lg">Loading flight information...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 text-amber-400">
			{/* Header */}
			<header className="bg-zinc-900 border-b border-amber-700/40 py-6">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-2">
							NEXT DEPARTURES
						</h1>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					{/* Board Header */}
					<div className="bg-zinc-900 rounded-t-lg border border-amber-700/40 p-4">
						<div className="grid grid-cols-12 gap-2 text-sm font-semibold tracking-wider text-amber-500">
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
						<div className="bg-zinc-900 border-x border-b border-amber-600/30 rounded-b-lg p-8 text-center">
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
