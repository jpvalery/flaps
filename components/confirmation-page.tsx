'use client';

import {
	cancelBookingAction,
	confirmBookingAction,
} from '@/app/actions/confirmation';
import Header from '@/components/ui/header';
import {
	AlertCircle,
	CheckCircle,
	Clock,
	Plane,
	Users,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
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
			<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-amber-400">
				<div className="text-center">
					<XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
					<h1 className="mb-2 font-bold text-2xl">Flight Information Not Found</h1>
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
				return <CheckCircle className="size-8 text-green-400" />;
			case 'CANCELLED':
				return <XCircle className="size-8 text-red-400" />;
			default:
				return <AlertCircle className="size-8 text-amber-400" />;
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
			<Header title="BOOKING CONFIRMATION" subtitle="FLIGHT RESERVATION SYSTEM" />

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-4xl">
					<div className="overflow-hidden rounded-lg border border-amber-600/30 bg-zinc-900">
						{/* Status Header */}
						<div className="border-amber-600/30 border-b bg-zinc-800 p-6">
							<div className="grid grid-flow-row items-center justify-center gap-3">
								<div className="flex items-center justify-center gap-2">
									{getStatusIcon()}
									<h2 className={`font-bold text-3xl ${getStatusColor()}`}>
										{booking.status === 'RESERVED' && 'Booking Reserved'}
										{booking.status === 'CONFIRMED' && 'Booking Confirmed'}
										{booking.status === 'CANCELLED' && 'Booking Cancelled'}
									</h2>
								</div>
								<p className="mt-1 font-mono text-sm text-zinc-300">#{booking.id}</p>
							</div>
						</div>

						{/* Booking Details */}
						<div className="p-6">
							<div className="grid gap-8 md:grid-cols-2">
								{/* Passenger Information */}
								<div className="space-y-4">
									<h3 className="mb-4 font-bold text-amber-300 text-xl">
										Passenger Information
									</h3>
									<div>
										<p className="text-sm text-zinc-300">Name</p>
										<p className="text-lg text-zinc-50">{booking.name}</p>
									</div>
									<div>
										<p className="text-sm text-zinc-300">Email</p>
										<p className="text-zinc-50">{booking.email}</p>
									</div>
									<div>
										<p className="flex items-center text-sm text-zinc-300">
											<Users className="mr-2 size-4" />
											Seats Reserved
										</p>
										<p className="text-lg text-zinc-50">{booking.seats}</p>
									</div>
								</div>

								{/* Flight Information */}
								<div className="space-y-4">
									<h3 className="mb-4 flex items-center font-bold text-amber-300 text-xl">
										<Plane className="mr-2 size-5" />
										Flight Information
									</h3>
									<div>
										<p className="text-sm text-zinc-300">Route</p>
										<p className="text-lg text-zinc-50">
											{booking.flight.departure} → {booking.flight.destination}
										</p>
									</div>
									<div>
										<p className="flex items-center text-sm text-zinc-300">
											<Clock className="mr-2 size-4" />
											Schedule
										</p>
										<p className="text-zinc-50">{formattedDate}</p>
										<p className="font-mono text-lg text-zinc-50">{formattedTime}</p>
									</div>
									<div>
										<p className="text-sm text-zinc-300">Aircraft</p>
										<p className="text-zinc-50">{booking.flight.aircraft}</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							{result ? (
								<div className="mt-8 rounded border p-4 text-center">
									<div
										className={`inline-flex items-center space-x-2 ${
											result.success ? 'text-green-400' : 'text-red-400'
										}`}
									>
										{result.success ? (
											<CheckCircle className="size-5" />
										) : (
											<XCircle className="size-5" />
										)}
										<span>{result.message}</span>
									</div>
								</div>
							) : booking.status === 'RESERVED' ? (
								<div className="mt-8 space-y-4">
									<div className="rounded border border-amber-600/30 bg-amber-600/10 p-4">
										<p className="text-center text-amber-300">
											<AlertCircle className="mr-2 inline size-5" />
											Please confirm your booking to secure your seats. Your reservation
											will expire in 24 hours.
										</p>
									</div>
									<div className="flex space-x-4">
										<button
											type="button"
											onClick={handleConfirm}
											disabled={isProcessing}
											className="flex-1 rounded bg-green-600 px-6 py-3 font-semibold text-zinc-50 transition-colors hover:bg-green-700 disabled:bg-green-600/50"
										>
											{isProcessing ? 'Processing...' : 'Confirm Booking'}
										</button>
										<button
											type="button"
											onClick={handleCancel}
											disabled={isProcessing}
											className="rounded border border-red-600/50 px-6 py-3 text-red-400 transition-colors hover:bg-red-600/10"
										>
											Cancel Booking
										</button>
									</div>
								</div>
							) : (
								<div className="mt-8 text-center">
									<p className="text-zinc-300">
										{booking.status === 'CONFIRMED' &&
											'Your booking has been confirmed. See you at the airport!'}
										{booking.status === 'CANCELLED' && 'This booking has been cancelled.'}
									</p>
								</div>
							)}
							<div className="grid items-center">
								<Link
									href="/"
									className="text-center text-amber-400 text-sm hover:text-amber-500"
								>
									Return to home
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
