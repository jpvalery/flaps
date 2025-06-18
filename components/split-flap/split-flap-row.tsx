'use client';

import SplitFlapCharacter from '@/components/split-flap/split-flap-character';
import InteractiveWrapper from '@/components/ui/interactive-wrapper';
import type React from 'react';
import { useEffect, useState } from 'react';
import SplitFlapLabel from './split-flap-label';

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

function GridCaseLabel({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="col-span-14 font-semibold text-amber-500 text-sm tracking-wider sm:col-span-2 lg:col-span-1 2xl:hidden">
			{children}
		</div>
	);
}
function GridCaseContent({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="col-span-14 flex max-w-fit space-x-1 sm:col-span-12 lg:col-span-6 2xl:col-span-4">
			{children}
		</div>
	);
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
			className="cursor-pointer border-amber-600/20 border-b transition-colors duration-200 last:border-b-0 hover:bg-zinc-800/50 max-lg:mx-auto max-lg:max-w-fit"
			onClick={onClick}
		>
			<div className="grid grid-cols-14 items-center gap-4 p-8">
				{/* Departure */}
				<GridCaseLabel>FROM</GridCaseLabel>
				<GridCaseContent>
					{flight.departure
						.toUpperCase()
						.slice(0, 11)
						.padEnd(11, ' ')
						.split('')
						.map((char, index) => (
							<SplitFlapCharacter
								key={index}
								character={char}
								delay={isVisible ? (index + 1) * 100 : 0}
							/>
						))}
				</GridCaseContent>

				{/* Destination */}
				<GridCaseLabel>TO</GridCaseLabel>
				<GridCaseContent>
					{flight.destination
						.toUpperCase()
						.slice(0, 11)
						.padEnd(11, ' ')
						.split('')
						.map((char, index) => (
							<SplitFlapCharacter
								key={index}
								character={char}
								delay={isVisible ? (index + 1) * 100 : 0}
							/>
						))}
				</GridCaseContent>

				{/* Schedule - DD/MM HH:MM with mixed flaps and text */}
				<GridCaseLabel>ON</GridCaseLabel>
				<GridCaseContent>
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
					<SplitFlapCharacter
						character="/"
						delay={
							isVisible
								? (flight.departure.length + flight.destination.length) * 80 + 2 * 60
								: 0
						}
					/>

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

					{/* Separator */}
					<SplitFlapCharacter
						character=" "
						delay={
							isVisible
								? (flight.departure.length + flight.destination.length) * 80 + 4 * 60
								: 0
						}
					/>

					{/* Hour flaps */}
					<SplitFlapCharacter
						character={date.getHours().toString().padStart(2, '0')[0]}
						delay={
							isVisible
								? (flight.departure.length + flight.destination.length) * 80 + 5 * 60
								: 0
						}
					/>
					<SplitFlapCharacter
						character={date.getHours().toString().padStart(2, '0')[1]}
						delay={
							isVisible
								? (flight.departure.length + flight.destination.length) * 80 + 6 * 60
								: 0
						}
					/>

					{/* Separator */}
					<SplitFlapCharacter
						character=":"
						delay={
							isVisible
								? (flight.departure.length + flight.destination.length) * 80 + 7 * 60
								: 0
						}
					/>

					{/* Minute flaps */}
					<SplitFlapCharacter
						character={date.getMinutes().toString().padStart(2, '0')[0]}
						delay={
							isVisible
								? (flight.departure.length + flight.destination.length) * 80 + 8 * 60
								: 0
						}
					/>
					<SplitFlapCharacter
						character={date.getMinutes().toString().padStart(2, '0')[1]}
						delay={
							isVisible
								? (flight.departure.length + flight.destination.length) * 80 + 9 * 60
								: 0
						}
					/>
				</GridCaseContent>

				{/* Availability - just number, moved to right */}
				<GridCaseLabel>SEATS</GridCaseLabel>
				<div className="col-span-14 flex space-x-1 justify-self-start sm:col-span-12 lg:col-span-6 2xl:col-span-2">
					<SplitFlapLabel character={spotsText} delay={1} />
				</div>
			</div>
		</InteractiveWrapper>
	);
}
