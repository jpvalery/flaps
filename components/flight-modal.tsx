'use client';

import {
    AlertCircle,
    Clock,
    Plane,
    Route,
    TicketsPlane,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import BookingForm from './booking-form';

interface Flight {
	id: string;
	departure: string;
	destination: string;
	datetime: string;
	spotsLeft: number;
	aircraft: string;
	notes: string;
}

interface FlightModalProps {
	flight: Flight;
	onClose: () => void;
	onBookingComplete?: () => void;
}

export default function FlightModal({
	flight,
	onClose,
	onBookingComplete,
}: FlightModalProps) {
	const [showBookingForm, setShowBookingForm] = useState(false);

	const date = new Date(flight.datetime);
	const formattedDate = date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	const formattedTime = date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	const handleBookingComplete = () => {
		setShowBookingForm(false);
		onBookingComplete?.();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
			<div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-amber-600/30 bg-zinc-900">
				{/* Header */}
				<div className="flex items-center justify-between border-amber-600/30 border-b p-6">
					<div className="flex items-center space-x-3 text-amber-400">
						<TicketsPlane className="-mt-1 size-8" />
						<h2 className="font-bold text-2xl">Flight Details</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-amber-400 transition-colors hover:text-amber-300"
					>
						<X className="size-6" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{showBookingForm ? (
						<BookingForm
							flight={flight}
							onBack={() => setShowBookingForm(false)}
							onClose={onClose}
							onBookingComplete={handleBookingComplete}
						/>
					) : (
						<>
							{/* Flight Info */}
							<div className="mb-6 grid gap-6 md:grid-cols-2">
								<div className="space-y-4">
									<div>
										<h3 className="flex items-center gap-2 font-semibold text-amber-300">
											<Route className="size-4" />
											Route
										</h3>
										<p className="text-lg text-white">
											{flight.departure} → {flight.destination}
										</p>
									</div>

									<div>
										<h3 className="flex items-center gap-2 font-semibold text-amber-300">
											<Clock className="size-4" />
											Schedule
										</h3>
										<p className="text-white">{formattedDate}</p>
										<p className="font-mono text-lg text-white">{formattedTime}</p>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<h3 className="flex items-center gap-2 font-semibold text-amber-300">
											<Plane className="size-4" />
											Aircraft
										</h3>
										<p className="text-lg text-white">{flight.aircraft}</p>
									</div>

									<div>
										<h3 className="flex items-center gap-2 font-semibold text-amber-300">
											<Users className="size-4" />
											Availability
										</h3>
										<p className="text-lg text-white">
											{flight.spotsLeft} seat{flight.spotsLeft !== 1 ? 's' : ''} remaining
										</p>
									</div>
								</div>
							</div>

							{/* Notes */}
							{flight.notes !== '' && (
								<div className="mb-6">
									<h3 className="flex items-center gap-2 font-semibold text-amber-300">
										<AlertCircle className="size-4" />
										Flight Notes
									</h3>

									<p className="rounded border border-zinc-700 bg-zinc-800/50 p-3 text-zinc-300">
										{flight.notes}
									</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex space-x-4">
								{flight.spotsLeft === 0 ? (
									<div className="flex-1 cursor-not-allowed items-center justify-center rounded border border-zinc-600 px-6 py-3 text-center font-semibold text-zinc-600 transition-colors">
										Fully Booked
									</div>
								) : (
									<button
										type="button"
										onClick={() => setShowBookingForm(true)}
										className="flex-1 rounded bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-700"
										disabled={flight.spotsLeft === 0}
									>
										Book this flight
									</button>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
