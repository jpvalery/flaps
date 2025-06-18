'use client';

import { reserveFlight } from '@/app/actions/reservation';
import { ArrowLeft, Check, Mail, User, Users, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface Flight {
	id: string;
	departure: string;
	destination: string;
	datetime: string;
	spotsLeft: number;
	aircraft: string;
	notes: string;
}

interface BookingFormProps {
	flight: Flight;
	onBack: () => void;
	onClose: () => void;
	onBookingComplete?: () => void;
}

export default function BookingForm({ flight, onBack }: BookingFormProps) {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		seats: 1,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [bookingResult, setBookingResult] = useState<{
		success: boolean;
		message: string;
		bookingId?: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formDataObj = new FormData();
		formDataObj.append('flightId', flight.id);
		formDataObj.append('name', formData.name);
		formDataObj.append('email', formData.email);
		formDataObj.append('seats', formData.seats.toString());

		const result = await reserveFlight(formDataObj);

		setBookingResult(result);
		setIsSubmitting(false);

		/*if (result.success) {
			// Delay onBookingComplete to allow time for user to see confirmation
			setTimeout(() => {
				onBookingComplete?.();
			}, 3000);
		}*/
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === 'seats' ? Number.parseInt(value) : value,
		}));
	};

	if (bookingResult) {
		return (
			<div className="py-8 text-center">
				<div
					className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
						bookingResult.success ? 'bg-emerald-600' : 'bg-red-600'
					}`}
				>
					{bookingResult.success ? (
						<Check className="size-8 text-zinc-50" />
					) : (
						<X className="size-8 text-zinc-50" />
					)}
				</div>
				<h3
					className={`mb-2 font-bold text-2xl ${bookingResult.success ? 'text-emerald-400' : 'text-red-400'}`}
				>
					{bookingResult.success ? 'Booking Reserved!' : 'Booking Failed'}
				</h3>
				<p className="mb-6 text-zinc-300">
					{bookingResult.message}
					{bookingResult.success && (
						<>
							<br />
							<br />
							<span className="font-semibold text-amber-300">
								Important: Check your email and click the confirmation link to secure
								your seats!
							</span>
						</>
					)}
				</p>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="mb-6 flex items-center">
				<button
					type="button"
					onClick={onBack}
					className="mr-4 text-amber-400 transition-colors hover:text-amber-300"
				>
					<ArrowLeft className="size-5" />
				</button>
				<h3 className="font-bold text-amber-400 text-xl">Reserve Your Seat</h3>
			</div>

			{/* Flight Summary */}
			<div className="mb-6 rounded border border-zinc-700 bg-zinc-800/50 p-4">
				<p className="font-semibold text-amber-300">
					{flight.departure} → {flight.destination}
				</p>
				<p className="text-zinc-300">
					{new Date(flight.datetime).toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric',
					})}{' '}
					at{' '}
					{new Date(flight.datetime).toLocaleTimeString('en-US', {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
					})}
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label className="flex flex-col gap-2 font-semibold text-amber-300">
						<div className="flex items-center gap-2">
							<User className="size-4" />
							Full Name
						</div>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
							className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 transition-colors focus:border-amber-400 focus:outline-hidden"
							placeholder="Enter your full name"
						/>
					</label>
				</div>

				<div>
					<label className="flex flex-col gap-2 font-semibold text-amber-300">
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							Email Address
						</div>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							required
							className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 transition-colors focus:border-amber-400 focus:outline-hidden"
							placeholder="Enter your email address"
						/>
					</label>
				</div>

				<div>
					<label className="flex flex-col gap-2 font-semibold text-amber-300">
						<div className="flex items-center gap-2">
							<Users className="size-4" />
							Number of Seats
						</div>
						<select
							name="seats"
							value={formData.seats}
							onChange={handleInputChange}
							className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 transition-colors focus:border-amber-400 focus:outline-hidden"
						>
							{Array.from(
								{ length: Math.min(flight.spotsLeft, 4) },
								(_, i) => i + 1
							).map((num) => (
								<option key={num} value={num}>
									{num} seat{num !== 1 ? 's' : ''}
								</option>
							))}
						</select>
					</label>
				</div>

				{/* Submit Button */}
				<div className="flex space-x-4 pt-4">
					<button
						type="submit"
						disabled={isSubmitting}
						className={`flex-1 rounded bg-amber-600 px-6 py-3 font-semibold text-zinc-50 transition-colors hover:bg-amber-700 disabled:bg-amber-600/50 ${isSubmitting ? 'cursor-wait' : 'cursor-pointer'}`}
					>
						{isSubmitting ? 'Processing...' : 'Reserve Seats'}
					</button>
					<button
						type="button"
						onClick={onBack}
						className="cursor-pointer rounded border border-amber-600/50 px-6 py-3 text-amber-400 transition-colors hover:bg-amber-600/10"
					>
						Back
					</button>
				</div>
			</form>
		</div>
	);
}
