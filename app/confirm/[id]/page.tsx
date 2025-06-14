import { getBookingById } from "@/lib/bookings"
import { notFound } from "next/navigation"
import ConfirmationPage from "@/components/confirmation-page"

interface PageProps {
  params: {
    id: string
  }
}

export default async function BookingConfirmationPage({ params }: PageProps) {
  const booking = await getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  return <ConfirmationPage booking={booking} />
}
