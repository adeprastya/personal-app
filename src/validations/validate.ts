import Joi from "joi";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";

export const validate = (schema: Joi.Schema, data: unknown) => {
	const { error } = schema.validate(data);
	if (error) {
		throw new CustomErrorResponse(400, error.message);
	}
};
