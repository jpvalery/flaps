'use client';

import FlapField from '@/components/split-flap/flap-field';
import {
	BLANK_FIELD,
	seatsLabel,
	toField,
	toScheduleField,
} from '@/components/split-flap/flaps';
import InteractiveWrapper from '@/components/ui/interactive-wrapper';
import type React from 'react';
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

function GridCaseLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="col-span-14 font-semibold text-amber-500 text-sm tracking-wider sm:col-span-2 lg:col-span-1 2xl:hidden">
			{children}
		</div>
	);
}

function GridCaseContent({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`col-span-14 sm:col-span-12 lg:col-span-6 2xl:col-span-1 ${className}`}
		>
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

	// Fields start blank and flip to their values once the row is revealed
	const show = (value: string) => (isVisible ? value : BLANK_FIELD);

	return (
		<InteractiveWrapper
			className="cursor-pointer border-amber-600/20 border-b transition-colors duration-200 last:border-b-0 hover:bg-zinc-800/50"
			onClick={onClick}
		>
			<div className="grid grid-cols-14 items-center gap-4 p-8 2xl:grid-cols-4">
				<GridCaseLabel>FROM</GridCaseLabel>
				<GridCaseContent>
					<FlapField label="Departure" rows={[show(toField(flight.departure))]} />
				</GridCaseContent>

				<GridCaseLabel>TO</GridCaseLabel>
				<GridCaseContent>
					<FlapField
						label="Destination"
						rows={[show(toField(flight.destination))]}
					/>
				</GridCaseContent>

				<GridCaseLabel>ON</GridCaseLabel>
				<GridCaseContent>
					<FlapField
						label="Scheduled"
						rows={[show(toScheduleField(flight.datetime))]}
					/>
				</GridCaseContent>

				<GridCaseLabel>SEATS</GridCaseLabel>
				<div className="col-span-14 sm:col-span-12 lg:col-span-6 2xl:col-span-1">
					<FlapField label="Seats" rows={[show(seatsLabel(flight.spotsLeft))]} />
				</div>
			</div>
		</InteractiveWrapper>
	);
}
