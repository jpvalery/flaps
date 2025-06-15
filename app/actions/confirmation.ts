'use server';

import type { Booking } from '@/types';

import { generateConfirmationEmail, sendEmail } from '@/lib/email';

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
		const booking = await fetchBooking.json()
		const emailData = generateConfirmationEmail(booking as Booking);
		const emailSent = await sendEmail({
			to: booking.email,
			id: booking.flightId,
			subject: emailData.subject,
			html: emailData.html,
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

export async function cancelBookingAction(bookingId: string) {
	try {
		const createCall = await fetch(
			`${process.env.WWW}/api/booking/cancel/${bookingId}`,
			{
				method: 'DELETE',
			}
		);

		const success = await createCall.json();

		if (!success) {
			return {
				success: false,
				message: 'Unable to cancel booking.',
			};
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
