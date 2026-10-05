import { db } from '@/lib/db';
import { bookings, flights } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface Booking {
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

type BookingRow = typeof bookings.$inferSelect;
type FlightRow = typeof flights.$inferSelect;

function toBooking(booking: BookingRow, flight: FlightRow): Booking {
	return {
		id: booking.id,
		name: booking.name,
		email: booking.email,
		seats: booking.seats,
		status: booking.status,
		flightId: booking.flightId,
		createdAt: booking.createdAt.toISOString(),
		updatedAt: booking.updatedAt.toISOString(),
		flight: {
			departure: flight.departure,
			destination: flight.destination,
			datetime: flight.datetime.toISOString(),
			aircraft: flight.aircraft,
		},
	};
}

export async function createBooking(data: {
	name: string;
	email: string;
	seats: number;
	flightId: string;
}): Promise<Booking | null> {
	try {
		return await db.transaction(async (tx) => {
			const [booking] = await tx
				.insert(bookings)
				.values({
					name: data.name,
					email: data.email,
					seats: data.seats,
					flightId: data.flightId,
					status: 'RESERVED',
				})
				.returning();

			const [flight] = await tx
				.select()
				.from(flights)
				.where(eq(flights.id, booking.flightId));

			return toBooking(booking, flight);
		});
	} catch (error) {
		console.error('Error creating booking:', error);
		return null;
	}
}

export async function getBookingById(id: string): Promise<Booking | null> {
	try {
		const [row] = await db
			.select({ booking: bookings, flight: flights })
			.from(bookings)
			.innerJoin(flights, eq(bookings.flightId, flights.id))
			.where(eq(bookings.id, id));

		return row ? toBooking(row.booking, row.flight) : null;
	} catch (error) {
		console.error('Error fetching booking:', error);
		return null;
	}
}

export async function confirmBooking(id: string): Promise<boolean> {
	try {
		// Start a transaction to ensure data consistency
		return await db.transaction(async (tx) => {
			// Get the booking
			const [row] = await tx
				.select({ booking: bookings, flight: flights })
				.from(bookings)
				.innerJoin(flights, eq(bookings.flightId, flights.id))
				.where(eq(bookings.id, id));

			if (row?.booking.status !== 'RESERVED') {
				throw new Error('Booking not found or already processed');
			}

			const { booking, flight } = row;

			// Check if flight has enough seats
			if (flight.spotsLeft < booking.seats) {
				throw new Error('Not enough seats available');
			}

			// Update booking status
			await tx
				.update(bookings)
				.set({ status: 'CONFIRMED' })
				.where(eq(bookings.id, id));

			// Decrease flight seats
			await tx
				.update(flights)
				.set({ spotsLeft: flight.spotsLeft - booking.seats })
				.where(eq(flights.id, booking.flightId));

			return true;
		});
	} catch (error) {
		console.error('Error confirming booking:', error);
		return false;
	}
}

export async function cancelBooking(id: string): Promise<boolean> {
	try {
		const [row] = await db
			.select({ booking: bookings, flight: flights })
			.from(bookings)
			.innerJoin(flights, eq(bookings.flightId, flights.id))
			.where(eq(bookings.id, id));

		if (!row) {
			return false;
		}

		const { booking, flight } = row;

		await db
			.update(bookings)
			.set({ status: 'CANCELLED' })
			.where(eq(bookings.id, id));

		await db
			.update(flights)
			.set({ spotsLeft: flight.spotsLeft + booking.seats })
			.where(eq(flights.id, booking.flightId));

		return true;
	} catch (error) {
		console.error('Error cancelling booking:', error);
		return false;
	}
}

export async function getBookingsByFlightId(flightId: string) {
	try {
		const rows = await db
			.select({ booking: bookings, flight: flights })
			.from(bookings)
			.innerJoin(flights, eq(bookings.flightId, flights.id))
			.where(eq(bookings.flightId, flightId));

		return rows.map(({ booking, flight }) => ({ ...booking, flight }));
	} catch (error) {
		console.error('Error fetching bookings by flight ID:', error);
		return [];
	}
}

export async function cancelBookingsByFlightId(flightId: string) {
	try {
		await db
			.update(bookings)
			.set({ status: 'CANCELLED' })
			.where(eq(bookings.flightId, flightId));

		return true;
	} catch (error) {
		console.error('Error cancelling bookings by flight ID:', error);
		return false;
	}
}
