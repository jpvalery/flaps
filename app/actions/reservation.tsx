'use server';

import { generateReservationEmail, sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

import type { Booking } from '@/types';

export async function reserveFlight(formData: FormData) {
	const flightId = formData.get('flightId') as string;
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const seats = Number.parseInt(formData.get('seats') as string);

	try {
		// Create booking reservation
		const createCall = await fetch(`${process.env.WWW}/api/booking/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				seats,
				flightId,
			}),
		});

		const booking = await createCall.json();

		if (!booking) {
			return {
				success: false,
				message: 'Unable to create booking reservation. Please try again.',
			};
		}

		// Send confirmation email
		const emailData = generateReservationEmail(booking as Booking);
		const emailSent = await sendEmail({
			to: email,
			id: flightId,
			subject: emailData.subject,
			// biome-ignore lint/style/noNonNullAssertion: "OK"
			react: emailData.react!,
		});

		if (!emailSent) {
			console.error('Failed to send confirmation email');
		}

		// Revalidate the flights data
		revalidatePath('/');

		console.log('Booking success!');

		return {
			success: true,
			message: `Booking reserved for ${name}! Check your email for confirmation instructions.`,
			bookingId: booking.id,
		};
	} catch (error) {
		console.error('Booking error:', error);
		return {
			success: false,
			message:
				'An error occurred while processing your booking. Please try again.',
		};
	}
}
