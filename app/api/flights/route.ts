import { NextResponse } from 'next/server';
import { getFlights } from '@/lib/flights';

export async function GET() {
	try {
		const flights = await getFlights();
		return NextResponse.json(flights);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch flights' },
			{ status: 500 }
		);
	}
}
