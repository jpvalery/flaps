import ConfirmationPage from '@/components/confirmation-page';
import { getBookingById } from '@/lib/bookings';
import { notFound } from 'next/navigation';

interface PageProps {
	params: {
		id: string;
	};
}

export default async function BookingConfirmationPage({ params }: PageProps) {
	const { id } = await params
	const booking = await getBookingById(id);

	if (!booking) {
		notFound();
	}

	return <ConfirmationPage booking={booking} />;
}
