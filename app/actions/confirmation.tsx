'use server';

import type { Booking } from '@/types';

import { generateBookingConfirmedEmail, sendEmail } from '@/lib/email';

import { revalidatePath } from 'next/cache';

export async function confirmBookingAction(bookingId: string) {
	try {
		const createCall = await fetch(
			`${process.env.WWW}/api/booking/confirm/${bookingId}`,
			{
				method: 'POST',
			}
		);

		const success = await createCall.json();

		if (!success) {
			return {
				success: false,
				message:
					'Unable to confirm booking. It may have already been processed or the flight is full.',
			};
		}

		// Send confirmation email
		const fetchBooking = await fetch(
			`${process.env.WWW}/api/booking/get/${bookingId}`,
			{
				method: 'GET',
			}
		);
		const booking = await fetchBooking.json();
		const emailData = generateBookingConfirmedEmail(booking as Booking);
		const emailSent = await sendEmail({
			to: booking.email,
			id: booking.flightId,
			subject: emailData.subject,
			// biome-ignore lint/style/noNonNullAssertion: "OK"
			react: emailData.react!,
		});

		if (!emailSent) {
			console.error('Failed to send confirmation email');
		}

		// Revalidate pages that show flight data
		revalidatePath('/');
		revalidatePath(`/confirm/${bookingId}`);

		return {
			success: true,
			message: 'Booking confirmed successfully! Your seats are now secured.',
		};
	} catch (error) {
		console.error('Confirmation error:', error);
		return {
			success: false,
			message:
				'An error occurred while confirming your booking. Please try again.',
		};
	}
}
