'use client';

import SplitFlapRow from './split-flap-row';

interface Flight {
	id: string;
	departure: string;
	destination: string;
	datetime: string;
	spotsLeft: number;
	aircraft: string;
	notes: string;
}

interface SplitFlapBoardProps {
	flights: Flight[];
	onFlightClick: (flight: Flight) => void;
}

export default function SplitFlapBoard({
	flights,
	onFlightClick,
}: SplitFlapBoardProps) {
	return (
		<>
			{flights.map((flight, index) => (
				<SplitFlapRow
					key={flight.id}
					flight={flight}
					onClick={() => onFlightClick(flight)}
					delay={index * 200}
				/>
			))}
		</>
	);
}
