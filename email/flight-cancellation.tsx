import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Section,
	Text,
} from '@react-email/components';

export interface FlightCancellationEmailProps {
	booking: {
		name: string;
		seats: number;
		flight?: {
			departure: string;
			destination: string;
			aircraft: string;
		};
	};
	flightDate: string;
	flightTime: string;
}

export default function FlightCancellationEmail({
	booking,
	flightDate,
	flightTime,
}: FlightCancellationEmailProps) {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading as="h1" style={headerText}>
							✈️ Flight Cancellation
						</Heading>
					</Section>

					<Section style={content}>
						<Heading as="h2">Hello {booking.name}!</Heading>
						<Text>Unfortunately, the following flight has been cancelled:</Text>

						<Section style={flightDetails}>
							<Heading as="h3">Flight Details</Heading>
							<Text>
								<strong>Route:</strong> {booking.flight?.departure} →{' '}
								{booking.flight?.destination}
							</Text>
							<Text>
								<strong>Date:</strong> {flightDate}
							</Text>
							<Text>
								<strong>Time:</strong> {flightTime}
							</Text>
							<Text>
								<strong>Aircraft:</strong> {booking.flight?.aircraft}
							</Text>
							<Text>
								<strong>Seats:</strong> {booking.seats}
							</Text>
						</Section>
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

FlightCancellationEmail.PreviewProps = {
	booking: {
		name: 'Jane Doe',
		seats: 2,
		flight: {
			departure: 'Toronto',
			destination: 'New York',
			aircraft: 'Boeing 737',
		},
	},
	flightDate: 'July 1, 2025',
	flightTime: '10:00 AM',
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

const footer = {
	textAlign: 'center' as const,
	color: '#666',
	fontSize: '12px',
	marginTop: '20px',
} as const;
