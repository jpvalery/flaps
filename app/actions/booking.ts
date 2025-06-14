"use server"

import { createBooking } from "@/lib/bookings"
import { sendEmail, generateConfirmationEmail } from "@/lib/email"
import { revalidatePath } from "next/cache"

export async function reserveFlight(formData: FormData) {
  const flightId = formData.get("flightId") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const seats = Number.parseInt(formData.get("seats") as string)

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // Create booking reservation
    const booking = await createBooking({
      name,
      email,
      seats,
      flightId,
    })

    if (!booking) {
      return {
        success: false,
        message: "Unable to create booking reservation. Please try again.",
      }
    }

    // Send confirmation email
    const emailData = generateConfirmationEmail(booking)
    const emailSent = await sendEmail({
      to: email,
      subject: emailData.subject,
      html: emailData.html,
    })

    if (!emailSent) {
      console.error("Failed to send confirmation email")
    }

    // Revalidate the flights data
    revalidatePath("/")

    return {
      success: true,
      message: `Booking reserved for ${name}! Check your email for confirmation instructions.`,
      bookingId: booking.id,
    }
  } catch (error) {
    console.error("Booking error:", error)
    return {
      success: false,
      message: "An error occurred while processing your booking. Please try again.",
    }
  }
}
