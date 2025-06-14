'use client';

import { useEffect, useState } from 'react';

interface SplitFlapCharacterProps {
	character: string;
	delay: number;
}

// Characters that can appear during flipping animation
const FLIP_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

export default function SplitFlapCharacter({
	character,
	delay,
}: SplitFlapCharacterProps) {
	const [isFlipping, setIsFlipping] = useState(false);
	const [displayChar, setDisplayChar] = useState(' ');
	const [_flipCount, setFlipCount] = useState(0);

	useEffect(() => {
		if (delay === 0) {
			setDisplayChar(character);
			return;
		}

		const timer = setTimeout(() => {
			startFlippingSequence();
		}, delay);

		return () => clearTimeout(timer);
	}, [character, delay]);

	const startFlippingSequence = () => {
		setIsFlipping(true);
		setFlipCount(0);

		// Number of flips before settling (3-6 flips for variety)
		const totalFlips = Math.floor(Math.random() * 4) + 3;

		const performFlip = (currentFlip: number) => {
			// Flip duration gets slightly longer each time to create deceleration effect
			const flipDuration = 120 + currentFlip * 20;

			// Scale down (hide character)
			setTimeout(() => {
				if (currentFlip < totalFlips - 1) {
					// Show random character during intermediate flips
					const randomChar =
						FLIP_CHARACTERS[Math.floor(Math.random() * FLIP_CHARACTERS.length)];
					setDisplayChar(randomChar);
				} else {
					// Final flip - show target character
					setDisplayChar(character);
				}

				// Scale back up (show character)
				setTimeout(() => {
					if (currentFlip < totalFlips - 1) {
						// Continue flipping
						performFlip(currentFlip + 1);
					} else {
						// Animation complete
						setIsFlipping(false);
					}
				}, flipDuration / 2);
			}, flipDuration / 2);
		};

		// Start the flipping sequence
		performFlip(0);
	};

	if (character === ' ') {
		return <div className="w-3" />;
	}

	return (
		<div className="relative">
			<div
				className={`flex h-12 w-8 items-center justify-center rounded-sm border border-zinc-600 bg-gradient-to-b from-zinc-700 to-zinc-800 font-bold font-mono text-amber-400 text-lg shadow-lg transition-transform duration-150 ease-in-out ${isFlipping ? 'animate-pulse' : ''}
        `}
				style={{
					transformOrigin: 'center',
					transform: isFlipping ? 'scaleY(0.1)' : 'scaleY(1)',
					transition: isFlipping
						? 'transform 0.15s ease-in-out'
						: 'transform 0.3s ease-out',
				}}
			>
				{displayChar}
			</div>

			{/* Top highlight */}
			<div className="absolute top-0 right-0 left-0 h-1 rounded-t-sm bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

			{/* Center line */}
			<div className="-translate-y-px absolute top-1/2 right-0 left-0 h-px transform bg-zinc-900" />

			{/* Bottom shadow */}
			<div className="absolute right-0 bottom-0 left-0 h-2 rounded-b-sm bg-gradient-to-t from-black/30 to-transparent" />

			{/* Flipping indicator - subtle glow during animation */}
			{isFlipping && (
				<div className="absolute inset-0 animate-pulse rounded-sm bg-amber-400/5" />
			)}
		</div>
	);
}
