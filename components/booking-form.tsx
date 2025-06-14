"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, User, Mail, Users } from "lucide-react"
import { reserveFlight } from "@/app/actions/booking"

interface Flight {
  id: string
  departure: string
  destination: string
  datetime: string
  spotsLeft: number
  aircraft: string
  notes: string
}

interface BookingFormProps {
  flight: Flight
  onBack: () => void
  onClose: () => void
  onBookingComplete?: () => void
}

export default function BookingForm({ flight, onBack, onClose, onBookingComplete }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    seats: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bookingResult, setBookingResult] = useState<{ success: boolean; message: string; bookingId?: string } | null>(
    null,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData()
    formDataObj.append("flightId", flight.id)
    formDataObj.append("name", formData.name)
    formDataObj.append("email", formData.email)
    formDataObj.append("seats", formData.seats.toString())

    const result = await reserveFlight(formDataObj)

    setBookingResult(result)
    setIsSubmitting(false)
    setIsSubmitted(true)

    if (result.success) {
      onBookingComplete?.()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "seats" ? Number.parseInt(value) : value,
    }))
  }

  if (isSubmitted && bookingResult) {
    return (
      <div className="text-center py-8">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            bookingResult.success ? "bg-amber-600" : "bg-red-600"
          }`}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {bookingResult.success ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${bookingResult.success ? "text-amber-400" : "text-red-400"}`}>
          {bookingResult.success ? "Booking Reserved!" : "Booking Failed"}
        </h3>
        <p className="text-zinc-300 mb-6">
          {bookingResult.message}
          {bookingResult.success && (
            <>
              <br />
              <br />
              <span className="text-amber-300 font-semibold">
                Important: Check your email and click the confirmation link to secure your seats!
              </span>
            </>
          )}
        </p>
        <button
          onClick={onClose}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded transition-colors"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-amber-400 hover:text-amber-300 mr-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-amber-400">Reserve Your Seat</h3>
      </div>

      {/* Flight Summary */}
      <div className="bg-zinc-800/50 p-4 rounded border border-zinc-700 mb-6">
        <p className="text-amber-300 font-semibold">
          {flight.departure} → {flight.destination}
        </p>
        <p className="text-zinc-300">
          {new Date(flight.datetime).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          at{" "}
          {new Date(flight.datetime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-amber-300 font-semibold mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-amber-300 font-semibold mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label className="block text-amber-300 font-semibold mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Number of Seats
          </label>
          <select
            name="seats"
            value={formData.seats}
            onChange={handleInputChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors"
          >
            {Array.from({ length: Math.min(flight.spotsLeft, 4) }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} seat{num !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white font-semibold py-3 px-6 rounded transition-colors"
          >
            {isSubmitting ? "Processing..." : "Reserve Seats"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-amber-600/50 text-amber-400 hover:bg-amber-600/10 rounded transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
