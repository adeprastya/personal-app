export class CustomErrorResponse extends Error {
	statusCode: number;
	inheritedError?: Error | CustomErrorResponse | unknown;

	constructor(statusCode: number, message: string, inheritedError?: Error | CustomErrorResponse | unknown) {
		super(message);
		this.name = this.constructor.name;

		Object.setPrototypeOf(this, new.target.prototype);

		if (inheritedError) {
			this.inheritedError = inheritedError;

			if (inheritedError instanceof CustomErrorResponse) {
				this.statusCode = inheritedError.statusCode || statusCode;
				this.message = inheritedError.message || message;
			} else if (inheritedError instanceof Error) {
				this.statusCode = statusCode;
				this.message = message;
			} else {
				this.statusCode = statusCode;
				this.message = message;
			}
		} else {
			this.statusCode = statusCode;
			this.message = message;
		}

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
