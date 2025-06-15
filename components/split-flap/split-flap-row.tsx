'use client';

import SplitFlapCharacter from '@/components/split-flap/split-flap-character';
import InteractiveWrapper from '@/components/ui/interactive-wrapper';
import { useEffect, useState } from 'react';

interface Flight {
	id: string;
	departure: string;
	destination: string;
	datetime: string;
	spotsLeft: number;
	aircraft: string;
	notes: string;
}

interface SplitFlapRowProps {
	flight: Flight;
	onClick: () => void;
	delay: number;
}

export default function SplitFlapRow({
	flight,
	onClick,
	delay,
}: SplitFlapRowProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), delay);
		return () => clearTimeout(timer);
	}, [delay]);

	// Format datetime to DDMM HHMM (no separators)
	const date = new Date(flight.datetime);

	// Format spots left
	const spotsText = flight.spotsLeft.toString();

	return (
		<InteractiveWrapper
			className="cursor-pointer border-amber-600/20 border-b transition-colors duration-200 last:border-b-0 hover:bg-zinc-800/50"
			onClick={onClick}
		>
			<div className="grid grid-cols-12 items-center gap-2 p-4">
				{/* Departure - 4 chars, fixed width */}
				<div className="col-span-3 font-semibold text-amber-500 text-sm tracking-wider sm:col-span-2 lg:hidden">
					FROM
				</div>
				<div className="col-span-9 flex space-x-1 sm:col-span-4 lg:col-span-2">
					{flight.departure.split('').map((char, index) => (
						<SplitFlapCharacter
							key={index}
							character={char}
							delay={isVisible ? (index + 1) * 100 : 0}
						/>
					))}
				</div>

				{/* Destination - flexible */}
				<div className="col-span-3 font-semibold text-amber-500 text-sm tracking-wider sm:col-span-2 sm:justify-self-end lg:hidden lg:justify-self-start">
					TO
				</div>
				<div className="col-span-9 flex flex-wrap gap-1 sm:col-span-4 sm:justify-self-end lg:col-span-5 lg:justify-self-start">
					{flight.destination
						.toUpperCase()
						.split('')
						.map((char, index) => (
							<SplitFlapCharacter
								key={index}
								character={char === ' ' ? ' ' : char}
								delay={isVisible ? flight.departure.length * 100 + index * 80 : 0}
							/>
						))}
				</div>

				{/* Schedule - DD/MM HH:MM with mixed flaps and text */}
				<div className="col-span-3 font-semibold text-amber-500 text-sm tracking-wider sm:col-span-2 lg:hidden">
					ON
				</div>
				<div className="col-span-9 grid grid-cols-1 items-center gap-3 sm:col-span-10 sm:grid-cols-2 lg:col-span-4">
					<div className="flex max-w-min items-center gap-1">
						{/* Day flaps */}
						<SplitFlapCharacter
							character={date.getDate().toString().padStart(2, '0')[0]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 0 * 60
									: 0
							}
						/>
						<SplitFlapCharacter
							character={date.getDate().toString().padStart(2, '0')[1]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 1 * 60
									: 0
							}
						/>

						{/* Separator */}
						<span className="font-mono text-amber-400 text-lg">/</span>

						{/* Month flaps */}
						<SplitFlapCharacter
							character={(date.getMonth() + 1).toString().padStart(2, '0')[0]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 2 * 60
									: 0
							}
						/>
						<SplitFlapCharacter
							character={(date.getMonth() + 1).toString().padStart(2, '0')[1]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 3 * 60
									: 0
							}
						/>
					</div>

					<div className="flex max-w-min items-center gap-1 sm:justify-self-end lg:justify-self-start">
						{/* Hour flaps */}
						<SplitFlapCharacter
							character={date.getHours().toString().padStart(2, '0')[0]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 4 * 60
									: 0
							}
						/>
						<SplitFlapCharacter
							character={date.getHours().toString().padStart(2, '0')[1]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 5 * 60
									: 0
							}
						/>

						{/* Separator */}
						<span className="font-mono text-amber-400 text-lg">:</span>

						{/* Minute flaps */}
						<SplitFlapCharacter
							character={date.getMinutes().toString().padStart(2, '0')[0]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 6 * 60
									: 0
							}
						/>
						<SplitFlapCharacter
							character={date.getMinutes().toString().padStart(2, '0')[1]}
							delay={
								isVisible
									? (flight.departure.length + flight.destination.length) * 80 + 7 * 60
									: 0
							}
						/>
					</div>
				</div>

				{/* Availability - just number, moved to right */}
				<div className="col-span-3 font-semibold text-amber-500 text-sm tracking-wider sm:col-span-2 lg:hidden">
					SEATS
				</div>
				<div className="col-span-9 flex justify-start gap-1 sm:col-span-10 lg:col-span-1 lg:justify-center">
					{spotsText === '0' ? (
						<span className="animate-pulse text-amber-100/50">COMPLETE</span>
					) : (
						<>
							{' '}
							{spotsText.split('').map((char, index) => (
								<SplitFlapCharacter
									key={index}
									character={char}
									delay={
										isVisible
											? (flight.departure.length + flight.destination.length + 8) * 60 +
												index * 50
											: 0
									}
								/>
							))}
						</>
					)}
				</div>
			</div>
		</InteractiveWrapper>
	);
}
