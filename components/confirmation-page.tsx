'use client';

import {
	cancelBookingAction,
	confirmBookingAction,
} from '@/app/actions/confirmation';
import {
	AlertCircle,
	CheckCircle,
	Clock,
	Plane,
	Users,
	XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Booking {
	id: string;
	name: string;
	email: string;
	seats: number;
	status: 'RESERVED' | 'CONFIRMED' | 'CANCELLED';
	flightId: string;
	createdAt: string;
	updatedAt: string;
	flight?: {
		departure: string;
		destination: string;
		datetime: string;
		aircraft: string;
	};
}

interface ConfirmationPageProps {
	booking: Booking;
}

export default function ConfirmationPage({ booking }: ConfirmationPageProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	if (!booking.flight) {
		return (
			<div className="min-h-screen bg-zinc-950 text-amber-400 flex items-center justify-center">
				<div className="text-center">
					<XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-2">Flight Information Not Found</h1>
					<p className="text-zinc-300">
						Unable to load flight details for this booking.
					</p>
				</div>
			</div>
		);
	}

	const handleConfirm = async () => {
		setIsProcessing(true);
		const response = await confirmBookingAction(booking.id);
		setResult(response);
		setIsProcessing(false);
	};

	const handleCancel = async () => {
		setIsProcessing(true);
		const response = await cancelBookingAction(booking.id);
		setResult(response);
		setIsProcessing(false);
	};

	const date = new Date(booking.flight.datetime);
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

	const getStatusIcon = () => {
		switch (booking.status) {
			case 'CONFIRMED':
				return <CheckCircle className="w-8 h-8 text-green-400" />;
			case 'CANCELLED':
				return <XCircle className="w-8 h-8 text-red-400" />;
			default:
				return <AlertCircle className="w-8 h-8 text-amber-400" />;
		}
	};

	const getStatusColor = () => {
		switch (booking.status) {
			case 'CONFIRMED':
				return 'text-green-400';
			case 'CANCELLED':
				return 'text-red-400';
			default:
				return 'text-amber-400';
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-amber-400">
			{/* Header */}
			<header className="bg-zinc-900 border-b border-amber-600/30 py-6">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-2">
							BOOKING CONFIRMATION
						</h1>
						<p className="text-amber-300/80 text-lg tracking-widest">
							FLIGHT RESERVATION SYSTEM
						</p>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="bg-zinc-900 border border-amber-600/30 rounded-lg overflow-hidden">
						{/* Status Header */}
						<div className="bg-zinc-800 p-6 border-b border-amber-600/30">
							<div className="grid grid-flow-row gap-3 justify-center items-center">
								<div className="flex items-center gap-2 justify-center">
									{getStatusIcon()}
									<h2 className={`text-3xl font-bold ${getStatusColor()}`}>
										{booking.status === 'RESERVED' && 'Booking Reserved'}
										{booking.status === 'CONFIRMED' && 'Booking Confirmed'}
										{booking.status === 'CANCELLED' && 'Booking Cancelled'}
									</h2>
								</div>
								<p className="text-zinc-300 mt-1 font-mono text-sm">#{booking.id}</p>
							</div>
						</div>

						{/* Booking Details */}
						<div className="p-6">
							<div className="grid md:grid-cols-2 gap-8">
								{/* Passenger Information */}
								<div className="space-y-4">
									<h3 className="text-xl font-bold text-amber-300 mb-4">
										Passenger Information
									</h3>
									<div>
										<p className="text-zinc-400 text-sm">Name</p>
										<p className="text-white text-lg">{booking.name}</p>
									</div>
									<div>
										<p className="text-zinc-400 text-sm">Email</p>
										<p className="text-white">{booking.email}</p>
									</div>
									<div>
										<p className="text-zinc-400 text-sm flex items-center">
											<Users className="w-4 h-4 mr-2" />
											Seats Reserved
										</p>
										<p className="text-white text-lg">{booking.seats}</p>
									</div>
								</div>

								{/* Flight Information */}
								<div className="space-y-4">
									<h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center">
										<Plane className="w-5 h-5 mr-2" />
										Flight Information
									</h3>
									<div>
										<p className="text-zinc-400 text-sm">Route</p>
										<p className="text-white text-lg">
											{booking.flight.departure} → {booking.flight.destination}
										</p>
									</div>
									<div>
										<p className="text-zinc-400 text-sm flex items-center">
											<Clock className="w-4 h-4 mr-2" />
											Schedule
										</p>
										<p className="text-white">{formattedDate}</p>
										<p className="text-white text-lg font-mono">{formattedTime}</p>
									</div>
									<div>
										<p className="text-zinc-400 text-sm">Aircraft</p>
										<p className="text-white">{booking.flight.aircraft}</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							{result ? (
								<div className="mt-8 p-4 rounded border text-center">
									<div
										className={`inline-flex items-center space-x-2 ${
											result.success ? 'text-green-400' : 'text-red-400'
										}`}
									>
										{result.success ? (
											<CheckCircle className="w-5 h-5" />
										) : (
											<XCircle className="w-5 h-5" />
										)}
										<span>{result.message}</span>
									</div>
								</div>
							) : booking.status === 'RESERVED' ? (
								<div className="mt-8 space-y-4">
									<div className="bg-amber-600/10 border border-amber-600/30 rounded p-4">
										<p className="text-amber-300 text-center">
											<AlertCircle className="w-5 h-5 inline mr-2" />
											Please confirm your booking to secure your seats. Your reservation
											will expire in 24 hours.
										</p>
									</div>
									<div className="flex space-x-4">
										<button
											onClick={handleConfirm}
											disabled={isProcessing}
											className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold py-3 px-6 rounded transition-colors"
										>
											{isProcessing ? 'Processing...' : 'Confirm Booking'}
										</button>
										<button
											onClick={handleCancel}
											disabled={isProcessing}
											className="px-6 py-3 border border-red-600/50 text-red-400 hover:bg-red-600/10 rounded transition-colors"
										>
											Cancel Booking
										</button>
									</div>
								</div>
							) : (
								<div className="mt-8 text-center">
									<p className="text-zinc-400">
										{booking.status === 'CONFIRMED' &&
											'Your booking has been confirmed. See you at the airport!'}
										{booking.status === 'CANCELLED' && 'This booking has been cancelled.'}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
