import { prisma } from './prisma';

import {
	cancelBookingsByFlightId,
	getBookingsByFlightId,
} from '@/lib/bookings';
import { generateCancellationEmail, sendEmail } from '@/lib/email';
import type { Booking, CreateFlightPayload, Flight } from '@/types';

export async function getFlights(): Promise<Flight[]> {
	try {
		const flights = await prisma.flight.findMany({
			orderBy: {
				datetime: 'asc',
			},
		});

		return flights.map((flight) => ({
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
		const flight = await prisma.flight.findUnique({
			where: { id },
		});

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
		const flight = await prisma.flight.findUnique({
			where: { id },
		});

		if (!flight || flight.spotsLeft < spotsToBook) {
			return false;
		}

		await prisma.flight.update({
			where: { id },
			data: {
				spotsLeft: flight.spotsLeft - spotsToBook,
			},
		});

		return true;
	} catch (error) {
		console.error('Error updating flight spots:', error);
		return false;
	}
}

export async function createFlight(payload: CreateFlightPayload) {
	try {
		const newFlight = await prisma.flight.create({
			data: {
				departure: payload.departure,
				destination: payload.destination,
				datetime: new Date(payload.datetime),
				spotsLeft: Number(payload.spotsLeft),
				aircraft: payload.aircraft,
				notes: payload.notes || '',
			},
		});

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
		const flight = await prisma.flight.findUnique({ where: { id: flightId } });
		if (!flight) {
			throw new Error('Flight not found');
		}

		// Get associated bookings
		const bookings = await getBookingsByFlightId(flightId);

		// Update all to status CANCELLED
		const cancelled = await cancelBookingsByFlightId(flightId);
		if (!cancelled) {
			throw new Error('Failed to cancel bookings');
		}

		// Send emails in parallel
		await Promise.all(
			bookings.map(async (booking) => {
				const bookingForEmail = {
					...booking,
					flight: {
						...booking.flight,
						datetime: booking.flight.datetime.toISOString(),
					},
				};

				const emailData = generateCancellationEmail(bookingForEmail as Booking);
				await sendEmail({
					to: booking.email,
					id: flightId,
					subject: emailData.subject,
					html: emailData.html,
				});
			})
		);

		// Safely delete all related bookings and the flight in a transaction
		await prisma.$transaction([
			prisma.booking.deleteMany({ where: { flightId } }),
			prisma.flight.delete({ where: { id: flightId } }),
		]);

		return true;
	} catch (error) {
		console.error('Error cancelling flight:', error);
		return false;
	}
}
