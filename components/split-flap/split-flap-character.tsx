'use client';

import { useEffect, useState } from 'react';

interface SplitFlapCharacterProps {
	character: string;
	delay: number;
}

export default function SplitFlapCharacter({
	character,
	delay,
}: SplitFlapCharacterProps) {
	const [isFlipped, setIsFlipped] = useState(false);
	const [displayChar, setDisplayChar] = useState(' ');

	useEffect(() => {
		if (delay === 0) {
			setDisplayChar(character);
			return;
		}

		const timer = setTimeout(() => {
			setIsFlipped(true);
			setTimeout(() => {
				setDisplayChar(character);
				setIsFlipped(false);
			}, 150);
		}, delay);

		return () => clearTimeout(timer);
	}, [character, delay]);

	if (character === ' ') {
		return <div className="w-3" />;
	}

	return (
		<div className="relative">
			<div
				className={`flex h-12 w-8 items-center justify-center rounded-sm border border-zinc-600 bg-gradient-to-b from-zinc-700 to-zinc-800 font-bold font-mono text-lg text-zinc-50 shadow-lg transition-transform duration-150 ease-in-out ${isFlipped ? 'scale-y-0' : 'scale-y-100'}
        `}
				style={{
					transformOrigin: 'center',
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
		</div>
	);
}
