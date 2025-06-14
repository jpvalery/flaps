'use client';

import { AlertCircle, Clock, Plane, Users, X } from 'lucide-react';
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
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
			<div className="bg-zinc-900 border border-amber-600/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-amber-600/30">
					<div className="flex items-center space-x-3">
						<Plane className="w-6 h-6 text-amber-400" />
						<h2 className="text-2xl font-bold text-amber-400">Flight Details</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-amber-400 hover:text-amber-300 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{!showBookingForm ? (
						<>
							{/* Flight Info */}
							<div className="grid md:grid-cols-2 gap-6 mb-6">
								<div className="space-y-4">
									<div>
										<h3 className="text-amber-300 font-semibold mb-2">Route</h3>
										<p className="text-white text-lg">
											{flight.departure} → {flight.destination}
										</p>
									</div>

									<div>
										<h3 className="text-amber-300 font-semibold mb-2 flex items-center">
											<Clock className="w-4 h-4 mr-2" />
											Schedule
										</h3>
										<p className="text-white">{formattedDate}</p>
										<p className="text-white text-lg font-mono">{formattedTime}</p>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<h3 className="text-amber-300 font-semibold mb-2">Aircraft</h3>
										<p className="text-white text-lg">{flight.aircraft}</p>
									</div>

									<div>
										<h3 className="text-amber-300 font-semibold mb-2 flex items-center">
											<Users className="w-4 h-4 mr-2" />
											Availability
										</h3>
										<p className="text-white text-lg">
											{flight.spotsLeft} seat{flight.spotsLeft !== 1 ? 's' : ''} remaining
										</p>
									</div>
								</div>
							</div>

							{/* Notes */}
							{flight.notes !== '' && (
								<div className="mb-6">
									<h3 className="text-amber-300 font-semibold mb-2 flex items-center">
										<AlertCircle className="w-4 h-4 mr-2" />
										Flight Notes
									</h3>

									<p className="text-zinc-300 bg-zinc-800/50 p-3 rounded border border-zinc-700">
										{flight.notes}
									</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex space-x-4">
								{flight.spotsLeft === 0 ? (
									<div className="flex-1 items-center justify-center text-center cursor-not-allowed border-zinc-600 border text-zinc-600 font-semibold py-3 px-6 rounded transition-colors">
										Fully Booked
									</div>
								) : (
									<button
										onClick={() => setShowBookingForm(true)}
										className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded transition-colors"
										disabled={flight.spotsLeft === 0}
									>
										Book this flight
									</button>
								)}
							</div>
						</>
					) : (
						<BookingForm
							flight={flight}
							onBack={() => setShowBookingForm(false)}
							onClose={onClose}
							onBookingComplete={handleBookingComplete}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
