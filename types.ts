// types.ts

export type Flight = {
	id: string;
	departure: string;
	destination: string;
	datetime: string;
	spotsLeft: number;
	aircraft: string;
	notes: string;
};

export type Booking = {
	id: string;
	name: string;
	email: string;
	seats: number;
	flightId?: string; // used when creating a booking
	flight?: Flight; // used when retrieving a booking
};

export type EmailData = {
	to: string;
	subject: string;
	html: string;
};
