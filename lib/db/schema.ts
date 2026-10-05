import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

export const bookingStatus = pgEnum('BookingStatus', [
	'RESERVED',
	'CONFIRMED',
	'CANCELLED',
]);

const id = () =>
	text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID());

const createdAt = () =>
	timestamp('created_at', { precision: 3 }).notNull().defaultNow();

const updatedAt = () =>
	timestamp('updated_at', { precision: 3 })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date());

export const flights = pgTable('flights', {
	id: id(),
	departure: varchar('departure', { length: 4 }).notNull(), // ICAO code
	destination: varchar('destination', { length: 100 }).notNull(),
	datetime: timestamp('datetime', { precision: 3 }).notNull(),
	spotsLeft: integer('spots_left').notNull(),
	aircraft: varchar('aircraft', { length: 100 }).notNull(),
	notes: text('notes'),
	createdAt: createdAt(),
	updatedAt: updatedAt(),
});

export const bookings = pgTable('bookings', {
	id: id(),
	name: varchar('name', { length: 100 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	seats: integer('seats').notNull(),
	status: bookingStatus('status').notNull().default('RESERVED'),
	flightId: text('flight_id')
		.notNull()
		.references(() => flights.id, { onDelete: 'cascade' }),
	createdAt: createdAt(),
	updatedAt: updatedAt(),
});
