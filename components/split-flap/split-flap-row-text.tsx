'use client';

import FlapField from '@/components/split-flap/flap-field';
import { useEffect, useState } from 'react';

interface SplitFlapRowProps {
	string: string;
	delay: number;
}

const CHUNK_SIZE = 20;
const CHUNK_BREAK_REGEX = / [A-Z0-9]$/;
const SPLIT_REGEX = /\s+/;

export function splitAndCleanString(input: string): string[] {
	const words = input.toUpperCase().split(SPLIT_REGEX);
	const chunks: string[] = [];
	let current = '';

	for (const word of words) {
		const next = current ? `${current} ${word}` : word;

		if (next.length > CHUNK_SIZE) {
			// Push current if it has meaningful content
			if (current.trim()) {
				let chunk = current.trimStart();

				// Avoid splitting in the middle of a word
				if (CHUNK_BREAK_REGEX.test(chunk)) {
					const lastSpace = chunk.lastIndexOf(' ');
					if (lastSpace > 0) {
						chunk = chunk.slice(0, lastSpace);
					}
				}

				chunks.push(chunk.padEnd(CHUNK_SIZE, ' '));
			}
			current = word;
		} else {
			current = next;
		}
	}

	// Push the final chunk if it's non-empty
	if (current.trim()) {
		let chunk = current.trimStart();

		if (CHUNK_BREAK_REGEX.test(chunk)) {
			const lastSpace = chunk.lastIndexOf(' ');
			if (lastSpace > 0) {
				chunk = chunk.slice(0, lastSpace);
			}
		}

		chunks.push(chunk.padEnd(CHUNK_SIZE, ' '));
	}

	// Remove any chunks that are only whitespace
	return chunks.filter((chunk) => chunk.trim().length > 0);
}

export default function SplitFlapRowText({ string, delay }: SplitFlapRowProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), delay);
		return () => clearTimeout(timer);
	}, [delay]);

	const rows = splitAndCleanString(string);

	return (
		<div className="mx-auto w-full max-w-5xl p-8 2xl:py-24">
			<FlapField
				label={string}
				rows={rows.map((row) => (isVisible ? row : ' '.repeat(CHUNK_SIZE)))}
				maxCellWidth={72}
				center
			/>
		</div>
	);
}
