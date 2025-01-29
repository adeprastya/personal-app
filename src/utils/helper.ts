import { v4 as uuid } from "uuid";

export const generateId = (): string => uuid();

export const timestampToReadable = (
	timestamp: string | number | Date,
	options: Intl.DateTimeFormatOptions = {}
): string => {
	const date = new Date(timestamp);
	if (isNaN(date.getTime())) {
		throw new Error("Invalid timestamp provided");
	}

	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		...options
	});
};
