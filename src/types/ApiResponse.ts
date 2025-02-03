export type SuccessResponse<T> = {
	status: boolean;
	message: string;
	data?: T;
};

export type ErrorResponse = {
	status: boolean;
	message: string;
};
