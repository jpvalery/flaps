"use client"

import { useState } from "react"
import SplitFlapBoard from "@/components/split-flap-board"
import FlightModal from "@/components/flight-modal"

// Mock flight data
const mockFlights = [
  {
    id: "1",
    departure: "CYUL",
    destination: "Toronto",
    datetime: "2025-06-21T18:00:00Z",
    spotsLeft: 3,
    aircraft: "Cessna 172",
    notes: "VFR only. Headsets provided.",
  },
  {
    id: "2",
    departure: "CYHU",
    destination: "Québec City",
    datetime: "2025-06-23T14:30:00Z",
    spotsLeft: 1,
    aircraft: "Piper Archer",
    notes: "Low-level scenic route. Bring camera.",
  },
  {
    id: "3",
    departure: "CYYC",
    destination: "Vancouver",
    datetime: "2025-06-24T09:15:00Z",
    spotsLeft: 2,
    aircraft: "Beechcraft Bonanza",
    notes: "Mountain views. Weather dependent.",
  },
  {
    id: "4",
    departure: "CYYZ",
    destination: "Montreal",
    datetime: "2025-06-25T16:45:00Z",
    spotsLeft: 4,
    aircraft: "Cirrus SR22",
    notes: "Glass cockpit training flight.",
  },
]

export default function Home() {
  const [selectedFlight, setSelectedFlight] = useState<(typeof mockFlights)[0] | null>(null)

  return (
    <div className="min-h-screen bg-zinc-950 text-amber-400">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-amber-600/30 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-2">DEPARTURES</h1>
            <p className="text-amber-300/80 text-lg tracking-widest">GENERAL AVIATION FLIGHTS</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Board Header */}
          <div className="bg-zinc-900 rounded-t-lg border border-amber-600/30 p-4">
            <div className="grid grid-cols-12 gap-2 text-sm font-semibold tracking-wider text-amber-300">
              <div className="col-span-2">DEPARTURE</div>
              <div className="col-span-5">DESTINATION</div>
              <div className="col-span-4">SCHEDULE</div>
              <div className="col-span-1 text-center">SEATS</div>
            </div>
          </div>

          {/* Split Flap Board */}
          <SplitFlapBoard flights={mockFlights} onFlightClick={setSelectedFlight} />
        </div>
      </main>

      {/* Flight Modal */}
      {selectedFlight && <FlightModal flight={selectedFlight} onClose={() => setSelectedFlight(null)} />}
    </div>
  )
}
