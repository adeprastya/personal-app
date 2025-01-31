export type SuccessResponse = {
	status: boolean;
	message: string;
	data?: Array<object>;
};

export type ErrorResponse = {
	status: boolean;
	message: string;
};
