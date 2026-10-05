import { db } from '@/lib/db';
import { bookings, flights } from '@/lib/db/schema';
import type { Booking } from '@/types';
import { asc, eq, gte } from 'drizzle-orm';

import {
	cancelBookingsByFlightId,
	getBookingsByFlightId,
} from '@/lib/bookings';
import {
	generateFlightCancellationEmail,
	generateNewFlightBroadcast,
	sendBatchEmail,
	sendBroadcast,
} from '@/lib/email';
import type { CreateFlightPayload, EmailData, Flight } from '@/types';

export async function getFlights(): Promise<Flight[]> {
	try {
		const rows = await db
			.select()
			.from(flights)
			.where(gte(flights.datetime, new Date(new Date().setHours(0, 0, 0, 0))))
			.orderBy(asc(flights.datetime));

		return rows.map((flight) => ({
			id: flight.id,
			departure: flight.departure,
			destination: flight.destination,
			datetime: flight.datetime.toISOString(),
			spotsLeft: flight.spotsLeft,
			aircraft: flight.aircraft,
			notes: flight.notes || '',
		}));
	} catch (error) {
		console.error('Error fetching flights:', error);
		return [];
	}
}

export async function getFlightById(id: string): Promise<Flight | null> {
	try {
		const [flight] = await db.select().from(flights).where(eq(flights.id, id));

		if (!flight) {
			return null;
		}

		return {
			id: flight.id,
			departure: flight.departure,
			destination: flight.destination,
			datetime: flight.datetime.toISOString(),
			spotsLeft: flight.spotsLeft,
			aircraft: flight.aircraft,
			notes: flight.notes || '',
		};
	} catch (error) {
		console.error('Error fetching flight:', error);
		return null;
	}
}

export async function updateFlightSpots(
	id: string,
	spotsToBook: number
): Promise<boolean> {
	try {
		const [flight] = await db.select().from(flights).where(eq(flights.id, id));

		if (!flight || flight.spotsLeft < spotsToBook) {
			return false;
		}

		await db
			.update(flights)
			.set({ spotsLeft: flight.spotsLeft - spotsToBook })
			.where(eq(flights.id, id));

		return true;
	} catch (error) {
		console.error('Error updating flight spots:', error);
		return false;
	}
}

export async function createFlight(payload: CreateFlightPayload) {
	try {
		const [newFlight] = await db
			.insert(flights)
			.values({
				departure: payload.departure,
				destination: payload.destination,
				datetime: new Date(payload.datetime),
				spotsLeft: Number(payload.spotsLeft),
				aircraft: payload.aircraft,
				notes: payload.notes || '',
			})
			.returning();

		const broadcastData = generateNewFlightBroadcast({
			id: newFlight.id,
			departure: newFlight.departure,
			destination: newFlight.destination,
			datetime: newFlight.datetime.toISOString(),
			spotsLeft: newFlight.spotsLeft,
			aircraft: newFlight.aircraft,
			notes: newFlight.notes || '',
		});

		await sendBroadcast(broadcastData);

		return {
			id: newFlight.id,
			departure: newFlight.departure,
			destination: newFlight.destination,
			datetime: newFlight.datetime.toISOString(),
			spotsLeft: newFlight.spotsLeft,
			aircraft: newFlight.aircraft,
			notes: newFlight.notes || '',
		};
	} catch (error) {
		console.error('Error creating flight:', error);
		throw new Error('Flight creation failed');
	}
}

export async function cancelFlight(flightId: string): Promise<boolean> {
	try {
		// Ensure the flight exists
		const [flight] = await db
			.select()
			.from(flights)
			.where(eq(flights.id, flightId));
		if (!flight) {
			throw new Error('Flight not found');
		}

		// Get associated bookings
		const flightBookings = await getBookingsByFlightId(flightId);

		// Update all to status CANCELLED
		const cancelled = await cancelBookingsByFlightId(flightId);
		if (!cancelled) {
			throw new Error('Failed to cancel bookings');
		}

		// Send emails in batch
		const emailDataList: EmailData[] = flightBookings.map((booking) => {
			const bookingForEmail = {
				...booking,
				flight: {
					...booking.flight,
					datetime: booking.flight.datetime.toISOString(), // fix
				},
			};

			const emailData = generateFlightCancellationEmail(
				bookingForEmail as Booking
			);

			return {
				to: booking.email,
				id: emailData.id,
				subject: emailData.subject,
				// biome-ignore lint/style/noNonNullAssertion: "OK"
				react: emailData.react!,
			};
		});

		await sendBatchEmail(emailDataList);

		// Safely delete all related bookings and the flight in a transaction
		await db.transaction(async (tx) => {
			await tx.delete(bookings).where(eq(bookings.flightId, flightId));
			await tx.delete(flights).where(eq(flights.id, flightId));
		});

		return true;
	} catch (error) {
		console.error('Error cancelling flight:', error);
		return false;
	}
}
