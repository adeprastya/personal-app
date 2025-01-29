export class CustomErrorResponse extends Error {
	statusCode: number;
	originalError?: Error | CustomErrorResponse;

	constructor(statusCode: number, message: string, originalError?: Error | CustomErrorResponse | unknown) {
		super(message);
		this.name = this.constructor.name;

		if (originalError instanceof CustomErrorResponse) {
			this.originalError = originalError;
			this.statusCode = originalError.statusCode;
			this.message = originalError.message;
		} else {
			this.statusCode = statusCode;
			this.message = message;
		}

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
