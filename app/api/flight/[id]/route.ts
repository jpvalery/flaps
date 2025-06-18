import { cancelFlight, getFlightById } from '@/lib/flights';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
	const { pathname } = new URL(request.url);
	const id = pathname.split('/').pop();

	if (!id) {
		return NextResponse.json({ message: 'Missing id' }, { status: 400 });
	}

	try {
		const confirmation = await cancelFlight(id);
		return NextResponse.json(confirmation);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to cancel booking' },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	const { pathname } = new URL(request.url);
	const id = pathname.split('/').pop();

	if (!id) {
		return NextResponse.json({ message: 'Missing id' }, { status: 400 });
	}

	try {
		const flight = await getFlightById(id);
		return NextResponse.json(flight);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to cancel booking' },
			{ status: 500 }
		);
	}
}
