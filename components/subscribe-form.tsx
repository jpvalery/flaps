'use client';

import type React from 'react';

import { subscribe } from '@/app/actions/subscribe';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { useState } from 'react';

export default function SubscribeForm() {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) {
			return;
		}

		setIsSubmitting(true);
		setResult(null);

		const formData = new FormData();
		formData.append('email', email.trim());

		const response = await subscribe(formData);
		if (response) {
			setResult(response);
			setIsSubmitting(false);

			if (response.success) {
				setEmail('');
			}
		} else {
			setResult({
				success: false,
				message: 'An unknown error occurred.',
			});
		}
	};

	return (
		<div className="mx-auto h-min max-w-2xl rounded-lg border border-amber-600/30 bg-zinc-900 p-6">
			<div className="mb-6 text-center">
				<div className="mb-3 flex items-center justify-center">
					<Mail className="mr-2 h-6 w-6 text-amber-400" />
					<h3 className="font-bold text-amber-400 text-xl">Stay Updated</h3>
				</div>
				<p className="text-sm text-zinc-300">
					Subscribe to receive notifications about new flights and special aviation
					events.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-6"
			>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Enter your email address"
					required
					disabled={isSubmitting}
					className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-400 transition-colors focus:border-amber-400 focus:outline-none disabled:opacity-50 md:w-2/3"
				/>

				<button
					type="submit"
					disabled={isSubmitting || !email.trim()}
					className="w-1/3 rounded bg-amber-600 p-4 font-semibold text-sm text-white transition-colors hover:bg-amber-700 disabled:bg-amber-600/50"
				>
					{isSubmitting ? 'Subscribing...' : 'Subscribe to Updates'}
				</button>
			</form>

			{/* Result Message */}
			{result && (
				<div
					className={`mt-4 rounded border p-3 text-sm ${
						result.success
							? 'border-green-600/30 bg-green-600/10 text-green-400'
							: 'border-red-600/30 bg-red-600/10 text-red-400'
					}`}
				>
					<div className="flex items-center">
						{result.success ? (
							<CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
						) : (
							<AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
						)}
						<span>{result.message}</span>
					</div>
				</div>
			)}
		</div>
	);
}
