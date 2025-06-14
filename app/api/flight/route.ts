import { createFlight } from '@/lib/flights';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const body = await request.json();

	try {
		const confirmation = await createFlight(body);
		return NextResponse.json(confirmation);
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to create flight' },
			{ status: 500 }
		);
	}
}
