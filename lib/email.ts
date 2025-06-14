export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real application, you would use a service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    console.log("📧 Email sent simulation:")
    console.log(`To: ${data.to}`)
    console.log(`Subject: ${data.subject}`)
    console.log(`HTML: ${data.html}`)

    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export function generateConfirmationEmail(booking: {
  id: string
  name: string
  seats: number
  flight: {
    departure: string
    destination: string
    datetime: string
    aircraft: string
  }
}): EmailData {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/confirm/${booking.id}`
  const flightDate = new Date(booking.flight.datetime).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const flightTime = new Date(booking.flight.datetime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return {
    to: booking.name.split(" ")[0], // Just first name for email
    subject: `Confirm Your Flight Booking - ${booking.flight.departure} to ${booking.flight.destination}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Flight Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: #fbbf24; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .flight-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #fbbf24; }
            .confirm-button { 
              display: inline-block; 
              background: #fbbf24; 
              color: #1f2937; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              font-weight: bold;
              margin: 20px 0;
            }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Flight Booking Confirmation</h1>
            </div>
            <div class="content">
              <h2>Hello ${booking.name}!</h2>
              <p>Thank you for your flight booking. Please confirm your reservation by clicking the button below:</p>
              
              <div class="flight-details">
                <h3>Flight Details</h3>
                <p><strong>Route:</strong> ${booking.flight.departure} → ${booking.flight.destination}</p>
                <p><strong>Date:</strong> ${flightDate}</p>
                <p><strong>Time:</strong> ${flightTime}</p>
                <p><strong>Aircraft:</strong> ${booking.flight.aircraft}</p>
                <p><strong>Seats:</strong> ${booking.seats}</p>
              </div>

              <div style="text-align: center;">
                <a href="${confirmationUrl}" class="confirm-button">CONFIRM BOOKING</a>
              </div>

              <p><strong>Important:</strong> Your seats are reserved for 24 hours. Please confirm your booking to secure your seats.</p>
              
              <p>If you cannot click the button above, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
