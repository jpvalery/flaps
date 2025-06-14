import type { ContactData } from '@/types';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createContact(contact: ContactData): Promise<boolean> {
	try {
		console.log('Creating contact');
		const addContact = await resend.contacts.create({
			email: `${contact.email}`,
			unsubscribed: false,
			audienceId: `${process.env.RESEND_AUDIENCE_ID}`,
		});
		console.log(addContact);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
