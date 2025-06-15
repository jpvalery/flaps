'use server';

import type { Booking } from '@/types';

import { generateBookingCancelledEmail, sendEmail } from '@/lib/email';

import { revalidatePath } from 'next/cache';

export async function cancelBookingAction(bookingId: string) {
	try {
		const cancelCall = await fetch(
			`${process.env.WWW}/api/booking/cancel/${bookingId}`,
			{
				method: 'DELETE',
			}
		);

		const success = await cancelCall.json();

		if (!success) {
			return {
				success: false,
				message: 'Unable to cancel booking.',
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
		const emailData = generateBookingCancelledEmail(booking as Booking);
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

		revalidatePath('/');
		revalidatePath(`/confirm/${bookingId}`);

		return {
			success: true,
			message: 'Booking cancelled successfully.',
		};
	} catch (error) {
		console.error('Cancellation error:', error);
		return {
			success: false,
			message: 'An error occurred while cancelling your booking.',
		};
	}
}
