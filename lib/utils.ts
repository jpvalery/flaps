import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

///////

import type { Booking, Flight } from '@/types';

export function emailDataFallbacks(booking: Booking) {
	const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/confirm/${booking.id}`;

	let flightDate = 'N/A';
	let flightTime = 'N/A';

	if (booking.flight?.datetime) {
		const date = new Date(booking.flight.datetime);
		flightDate = date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		flightTime = date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	}

	return {
		confirmationUrl,
		flightDate,
		flightTime,
	};
}

export function broadcastDataFallbacks(flight: Flight) {
	let flightDate = 'N/A';
	let flightTime = 'N/A';

	if (flight?.datetime) {
		const date = new Date(flight.datetime);
		flightDate = date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		flightTime = date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	}

	return {
		flightDate,
		flightTime,
	};
}
