'use client';

import SplitFlapCharacter from '@/components/split-flap/split-flap-character';
import { useEffect, useState } from 'react';

interface SplitFlapRowProps {
	string: string;
	delay: number;
}

const CHUNK_SIZE = 10;
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

	const substrings = splitAndCleanString(string);

	return (
		<>
			{/* Mobile /*/}
			<div className="mx-auto grid max-w-fit grid-flow-row grid-cols-1 place-items-center gap-x-1 gap-y-4 p-8 2xl:hidden">
				{substrings.map((substring, groupIndex) => (
					<div
						key={groupIndex}
						className="grid max-w-fit grid-cols-10 items-center justify-center gap-1"
					>
						{substring
							.padEnd(10, ' ') // re-pad to 10 after trimming
							.split('')
							.map((char, charIndex) => (
								<SplitFlapCharacter
									key={charIndex}
									character={char}
									delay={isVisible ? (groupIndex * 10 + charIndex + 1) * 100 : 0}
								/>
							))}
					</div>
				))}
			</div>
			{/* Desktop */}
			<div className='mx-auto hidden max-w-fit gap-1 px-8 py-24 2xl:grid 2xl:grid-flow-col'>
					{string
						.toUpperCase()
						.padEnd(40, ' ') // re-pad to 10 after trimming
						.split('')
						.map((char, charIndex) => (
							<SplitFlapCharacter
								key={charIndex}
								character={char}
								delay={isVisible ? 1 : 0}
							/>
						))}
				</div>
		</>
	);
}
