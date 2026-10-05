'use client';

import * as Flapkit from 'flapkit';
import 'flapkit/flapkit.css';
import 'flapkit/airport.css';
import { riffle } from 'flapkit/motion/canvas/riffle';
import { useEffect, useRef, useState } from 'react';

const GAP = 4; // px between cells (Tailwind gap-1)
const MIN_CELL_WIDTH = 12;
const DEFAULT_CELL_WIDTH = 20;
const CELL_RATIO = 4 / 3; // height / width

interface FlapFieldProps {
	label: string;
	rows: string[];
	// Upper bound for a cell's width, in px
	maxCellWidth?: number;
	center?: boolean;
}

/**
 * Split-flap rows sized to fill the width they are given. Flapkit cells take
 * explicit dimensions, so the available width is measured and shared between
 * the cells of the widest row.
 */
export default function FlapField({
	label,
	rows,
	maxCellWidth = 56,
	center,
}: FlapFieldProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}
		const observer = new ResizeObserver(([entry]) => {
			setWidth(Math.floor(entry.contentRect.width));
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	const columns = Math.max(...rows.map((row) => [...row].length));
	const cellWidth =
		width > 0
			? Math.min(
					maxCellWidth,
					Math.max(
						MIN_CELL_WIDTH,
						Math.floor((width - GAP * (columns - 1)) / columns)
					)
				)
			: DEFAULT_CELL_WIDTH;
	const cellStyle = {
		width: cellWidth,
		height: Math.round(cellWidth * CELL_RATIO),
		fontSize: Math.round(cellWidth * 0.95),
	};

	return (
		<div ref={ref} className={center ? 'flex justify-center' : undefined}>
			<Flapkit.Root motion={riffle()}>
				<Flapkit.Grid aria-label={label} data-look="airport" className="gap-1">
					{rows.map((row, rowIndex) => (
						<Flapkit.Row key={rowIndex} className="gap-1 text-amber-400">
							{[...row].map((character, index) => (
								<Flapkit.Cell key={index} style={cellStyle}>
									{character}
								</Flapkit.Cell>
							))}
						</Flapkit.Row>
					))}
				</Flapkit.Grid>
			</Flapkit.Root>
		</div>
	);
}
