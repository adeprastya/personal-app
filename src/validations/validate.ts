import Joi from "joi";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";

export const validate = (schema: Joi.Schema, data: unknown) => {
	const { error } = schema.validate(data, { abortEarly: false });

	if (error) {
		const errorDetails = error.details.map((err: Joi.ValidationErrorItem) => err.message).join(", ");

		throw new CustomErrorResponse(400, errorDetails);
	}
};
