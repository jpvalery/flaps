import type { Booking, EmailData } from '@/types';

import { createContact } from '@/lib/contacts';

import { emailDataFallbacks } from '@/lib/utils';

import FlightBookingCancellationEmail from '@/email/booking-cancellation';
import FlightBookingConfirmationEmail from '@/email/booking-confirmation';
import FlightBookingReservationEmail from '@/email/booking-reservation';

import FlightCancellationEmail from '@/email/flight-cancellation';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(data: EmailData): Promise<boolean> {
	// we upsert the contact for future use
	await createContact({ email: data.to });
	// we send the email
	try {
		const sendEmail = await resend.emails.send({
			from: process.env.PILOT_SENDING_FROM || 'onboarding@resend.dev',
			to: [data.to],
			replyTo: process.env.PILOT_PERSONAL_EMAIL,
			subject: data.subject,
			...(data.react ? { react: data.react } : { html: data.html }),
		});

		console.log(sendEmail?.data?.id);

		return true;
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
}

export async function sendBatchEmail(emails: EmailData[]): Promise<boolean> {
	try {
		const payload = emails.map((data) => {
			return {
				from: process.env.PILOT_SENDING_FROM || 'onboarding@resend.dev',
				to: [data.to],
				subject: data.subject,
				replyTo: process.env.PILOT_PERSONAL_EMAIL,
				// Prefer react if available, fallback to html
				...(data.react ? { react: data.react } : { html: data.html }),
			};
		});

		const result = await resend.batch.send(payload);

		console.log('Batch send result:', result);
		return true;
	} catch (error) {
		console.error('Error sending batch emails:', error);
		return false;
	}
}

export function generateReservationEmail(booking: Booking): EmailData {
	const emailData = emailDataFallbacks(booking);

	return {
		to: booking.email,
		id: booking.id,
		subject: `🎫 Confirm Your Flight Booking - ${booking?.flight?.departure} to ${booking?.flight?.destination}`,
		react: (
			<FlightBookingReservationEmail
				booking={booking}
				flightDate={emailData.flightDate}
				flightTime={emailData.flightTime}
				confirmationUrl={emailData.confirmationUrl}
			/>
		),
	};
}

export function generateFlightCancellationEmail(booking: Booking): EmailData {
	const emailData = emailDataFallbacks(booking);

	return {
		to: booking.email,
		id: booking.id,
		subject: `⚠️ Cancelled Flight - ${booking?.flight?.departure} to ${booking?.flight?.destination}`,
		react: (
			<FlightCancellationEmail
				booking={booking}
				flightDate={emailData.flightDate}
				flightTime={emailData.flightTime}
			/>
		),
	};
}

export function generateBookingConfirmedEmail(booking: Booking): EmailData {
	const emailData = emailDataFallbacks(booking);

	return {
		to: booking.email,
		id: booking.id,
		subject: '🎫 Flight Booking Confirmation',
		react: (
			<FlightBookingConfirmationEmail
				booking={booking}
				flightDate={emailData.flightDate}
				flightTime={emailData.flightTime}
				confirmationUrl={emailData.confirmationUrl}
			/>
		),
	};
}

export function generateBookingCancelledEmail(booking: Booking): EmailData {
	const emailData = emailDataFallbacks(booking);

	return {
		to: booking.email,
		id: booking.id,
		subject: '❌ Flight Booking Cancellation',
		react: (
			<FlightBookingCancellationEmail
				booking={booking}
				flightDate={emailData.flightDate}
				flightTime={emailData.flightTime}
			/>
		),
	};
}
