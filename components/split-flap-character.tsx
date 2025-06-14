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
		return <div className="w-3"></div>;
	}

	return (
		<div className="relative">
			<div
				className={`
          w-8 h-12 bg-gradient-to-b from-zinc-700 to-zinc-800 
          border border-zinc-600 rounded-sm shadow-lg
          flex items-center justify-center
          font-mono font-bold text-zinc-50 text-lg
          transition-transform duration-150 ease-in-out
          ${isFlipped ? 'scale-y-0' : 'scale-y-100'}
        `}
				style={{
					transformOrigin: 'center',
				}}
			>
				{displayChar}
			</div>

			{/* Top highlight */}
			<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent rounded-t-sm"></div>

			{/* Center line */}
			<div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-900 transform -translate-y-px"></div>

			{/* Bottom shadow */}
			<div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/30 to-transparent rounded-b-sm"></div>
		</div>
	);
}
