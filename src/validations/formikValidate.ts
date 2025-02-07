import type Joi from "joi";

export const validate = (schema: Joi.Schema, data: unknown) => {
	const { error } = schema.validate(data, { abortEarly: false });

	if (error) {
		const errors: Record<string, string> = {};
		error.details.forEach((detail) => {
			errors[detail.path[0]] = detail.message;
		});

		return errors;
	}

	return undefined;
};
