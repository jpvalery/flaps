'use client';

import {
	BLANK_FIELD,
	seatsLabel,
	toField,
	toScheduleField,
} from '@/components/split-flap/flaps';
import InteractiveWrapper from '@/components/ui/interactive-wrapper';
import * as Flapkit from 'flapkit';
import 'flapkit/flapkit.css';
import 'flapkit/airport.css';
import { riffle } from 'flapkit/motion/canvas/riffle';
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
	className = '2xl:col-span-4',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`col-span-14 sm:col-span-12 lg:col-span-6 ${className}`}>
			{children}
		</div>
	);
}

const CELL_CLASS = 'h-10 w-6 text-xl sm:h-12 sm:w-8 sm:text-2xl';
const COMPACT_CELL_CLASS = 'h-7 w-4 text-sm';

function Field({
	label,
	value,
	compact,
}: {
	label: string;
	value: string;
	compact?: boolean;
}) {
	return (
		<Flapkit.Root motion={riffle()}>
			<Flapkit.Grid aria-label={label} data-look="airport">
				<Flapkit.Row className="gap-1 text-amber-400">
					{[...value].map((character, index) => (
						<Flapkit.Cell
							key={index}
							className={compact ? COMPACT_CELL_CLASS : CELL_CLASS}
						>
							{character}
						</Flapkit.Cell>
					))}
				</Flapkit.Row>
			</Flapkit.Grid>
		</Flapkit.Root>
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
			className="cursor-pointer border-amber-600/20 border-b transition-colors duration-200 last:border-b-0 hover:bg-zinc-800/50 max-lg:mx-auto max-lg:max-w-fit"
			onClick={onClick}
		>
			<div className="grid grid-cols-14 items-center gap-4 p-8">
				<GridCaseLabel>FROM</GridCaseLabel>
				<GridCaseContent>
					<Field label="Departure" value={show(toField(flight.departure))} />
				</GridCaseContent>

				<GridCaseLabel>TO</GridCaseLabel>
				<GridCaseContent>
					<Field label="Destination" value={show(toField(flight.destination))} />
				</GridCaseContent>

				<GridCaseLabel>ON</GridCaseLabel>
				<GridCaseContent className="2xl:col-span-3">
					<Field label="Scheduled" value={show(toScheduleField(flight.datetime))} />
				</GridCaseContent>

				<GridCaseLabel>SEATS</GridCaseLabel>
				<div className="col-span-14 justify-self-start sm:col-span-12 lg:col-span-6 2xl:col-span-3">
					<Field label="Seats" value={show(seatsLabel(flight.spotsLeft))} compact />
				</div>
			</div>
		</InteractiveWrapper>
	);
}
