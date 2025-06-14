import { confirmBooking } from '@/lib/bookings';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const { pathname } = new URL(request.url);
	const id = pathname.split('/').pop();

	if (!id) {
		return NextResponse.json({ message: 'Missing id' }, { status: 400 });
	}

	try {
		const confirmation = await confirmBooking(id);
		return NextResponse.json(confirmation);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to confirm booking' },
			{ status: 500 }
		);
	}
}
