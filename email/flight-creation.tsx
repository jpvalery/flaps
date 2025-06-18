import { broadcastDataFallbacks } from '@/lib/utils';
import type { Flight } from '@/types';
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Section,
	Text,
} from '@react-email/components';

export interface FlightCreationEmailProps {
	flight: Flight;
}

export function FlightCreationEmail({ flight }: FlightCreationEmailProps) {
	const fallback = broadcastDataFallbacks(flight);
	const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/flight/${flight.id}`;

	return (
		<Html>
			<Head />
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading as="h1" style={headerText}>
							✈️ New Flight Just Added!
						</Heading>
					</Section>

					<Section style={content}>
						<Text>
							We're excited to announce a new flight from{' '}
							<strong>{flight.departure}</strong> to{' '}
							<strong>{flight.destination}</strong>!
						</Text>

						<Section style={flightDetails}>
							<Heading as="h3">Flight Information</Heading>
							<Text>
								<strong>Route:</strong> {flight.departure} → {flight.destination}
							</Text>
							<Text>
								<strong>Date:</strong> {fallback.flightDate}
							</Text>
							<Text>
								<strong>Time:</strong> {fallback.flightTime}
							</Text>
							<Text>
								<strong>Aircraft:</strong> {flight.aircraft}
							</Text>
							<Text>
								<strong>Seats remaining:</strong> {flight.spotsLeft}
							</Text>
						</Section>

						<Section style={flightDetails}>
							<Heading as="h3">Notes</Heading>
							<Text>{flight.notes}</Text>
						</Section>

						<Section style={center}>
							<Link href={confirmationUrl} style={button}>
								Book This Flight
							</Link>
						</Section>

						<Text>Spots may be limited — secure your seat early!</Text>
					</Section>

					<Section style={footer}>
						<Text>
							This is an automated message. Please do not reply to this email.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

// === Preview Props ===

FlightCreationEmail.PreviewProps = {
	flight: {
		departure: 'Toronto',
		destination: 'Montreal',
		aircraft: 'Dash 8 Q400',
		datetime: new Date().toISOString(),
	},
	ctaUrl: 'https://example.com/flights/abc123',
};

// === Styles ===

const main = {
	fontFamily: 'Arial, sans-serif',
	lineHeight: '1.6',
	color: '#333',
	backgroundColor: '#ffffff',
} as const;

const container = {
	maxWidth: '600px',
	margin: '0 auto',
	padding: '20px',
} as const;

const header = {
	backgroundColor: '#1f2937',
	color: '#fbbf24',
	padding: '20px',
	textAlign: 'center' as const,
} as const;

const headerText = {
	color: '#fbbf24',
	margin: 0,
} as const;

const content = {
	backgroundColor: '#f9f9f9',
	padding: '20px',
} as const;

const flightDetails = {
	backgroundColor: '#ffffff',
	padding: '15px',
	margin: '15px 0',
	borderLeft: '4px solid #fbbf24',
} as const;

const center = {
	textAlign: 'center' as const,
	margin: '20px 0',
} as const;

const button = {
	display: 'inline-block',
	backgroundColor: '#fbbf24',
	color: '#1f2937',
	padding: '12px 24px',
	textDecoration: 'none',
	borderRadius: '5px',
	fontWeight: 'bold',
} as const;

const footer = {
	textAlign: 'center' as const,
	color: '#666',
	fontSize: '12px',
	marginTop: '20px',
} as const;
