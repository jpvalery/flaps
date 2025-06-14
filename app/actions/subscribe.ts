'use server';

import { createContact } from '@/lib/contacts';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(formData: FormData) {
	const email = formData.get('email') as string;

	if (!email || !email.trim()) {
		return {
			success: false,
			message: 'Please provide a valid email address.',
		};
	}

	// Basic email validation
	
	if (!emailRegex.test(email.trim())) {
		return {
			success: false,
			message: 'Please provide a valid email address.',
		};
	}

	try {
		// Simulate processing time
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Call the createContact function
		const result = await createContact({ email: email.trim() });

		if (result) {
			return {
				success: true,
				message:
					"Successfully subscribed! You'll receive updates about new flights and aviation events.",
			};
		}
	} catch (error) {
		console.error('Newsletter subscription error:', error);
		return {
			success: false,
			message: 'An error occurred while subscribing. Please try again later.',
		};
	}
}
