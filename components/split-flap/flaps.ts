// Width of a text field, in cells
export const FIELD_WIDTH = 11;

export const BLANK_FIELD = ' '.repeat(FIELD_WIDTH);

export function seatsLabel(spotsLeft: number): string {
	return toField(spotsLeft > 0 ? `${spotsLeft} REMAINING` : 'COMPLETE');
}

export function toField(value: string): string {
	return value.toUpperCase().slice(0, FIELD_WIDTH).padEnd(FIELD_WIDTH, ' ');
}

const pad = (n: number) => n.toString().padStart(2, '0');

// DD/MM HH:MM
export function toScheduleField(datetime: string): string {
	const date = new Date(datetime);
	return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
