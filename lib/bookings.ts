import { prisma } from './prisma';

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

export async function createBooking(data: {
	name: string;
	email: string;
	seats: number;
	flightId: string;
}): Promise<Booking | null> {
	try {
		const booking = await prisma.booking.create({
			data: {
				name: data.name,
				email: data.email,
				seats: data.seats,
				flightId: data.flightId,
				status: 'RESERVED',
			},
			include: {
				flight: true,
			},
		});

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
				departure: booking.flight.departure,
				destination: booking.flight.destination,
				datetime: booking.flight.datetime.toISOString(),
				aircraft: booking.flight.aircraft,
			},
		};
	} catch (error) {
		console.error('Error creating booking:', error);
		return null;
	}
}

export async function getBookingById(id: string): Promise<Booking | null> {
	try {
		const booking = await prisma.booking.findUnique({
			where: { id },
			include: {
				flight: true,
			},
		});

		if (!booking) {
			return null;
		}

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
				departure: booking.flight.departure,
				destination: booking.flight.destination,
				datetime: booking.flight.datetime.toISOString(),
				aircraft: booking.flight.aircraft,
			},
		};
	} catch (error) {
		console.error('Error fetching booking:', error);
		return null;
	}
}

export async function confirmBooking(id: string): Promise<boolean> {
	try {
		// Start a transaction to ensure data consistency
		const result = await prisma.$transaction(async (tx) => {
			// Get the booking
			const booking = await tx.booking.findUnique({
				where: { id },
				include: { flight: true },
			});

			if (!booking || booking.status !== 'RESERVED') {
				throw new Error('Booking not found or already processed');
			}

			// Check if flight has enough seats
			if (booking.flight.spotsLeft < booking.seats) {
				throw new Error('Not enough seats available');
			}

			// Update booking status
			await tx.booking.update({
				where: { id },
				data: { status: 'CONFIRMED' },
			});

			// Decrease flight seats
			await tx.flight.update({
				where: { id: booking.flightId },
				data: {
					spotsLeft: booking.flight.spotsLeft - booking.seats,
				},
			});

			return true;
		});

		return result;
	} catch (error) {
		console.error('Error confirming booking:', error);
		return false;
	}
}

export async function cancelBooking(id: string): Promise<boolean> {
	try {
		const booking = await prisma.booking.findUnique({
			where: { id },
			include: { flight: true },
		});

		if (!booking) {
			return false;
		}

		await prisma.booking.update({
			where: { id },
			data: { status: 'CANCELLED' },
		});

		await prisma.flight.update({
			where: { id: booking.flightId },
			data: {
				spotsLeft: booking.flight.spotsLeft + booking.seats,
			},
		});

		return true;
	} catch (error) {
		console.error('Error cancelling booking:', error);
		return false;
	}
}
