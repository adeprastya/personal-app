import Joi from "joi";

export const CreateProjectSchema = Joi.object({
	title: Joi.string().min(1).max(25).required(),
	description: Joi.string().min(10).max(200).required(),
	technologies: Joi.array().items(Joi.string().min(1).max(25)).min(1).max(20).required(),
	site_url: Joi.string().allow(null, "").uri().optional(),
	source_code_url: Joi.string().allow(null, "").uri().optional(),
	demo_url: Joi.string().allow(null, "").uri().optional()
});

export const UpdateProjectSchema = Joi.object({
	title: Joi.string().min(1).max(25).optional(),
	description: Joi.string().min(10).max(200).optional(),
	technologies: Joi.array().items(Joi.string().min(1).max(25)).min(1).max(20).optional(),
	site_url: Joi.string().allow(null, "").uri().optional(),
	source_code_url: Joi.string().allow(null, "").uri().optional(),
	demo_url: Joi.string().allow(null, "").uri().optional()
});

export const IdSchema = Joi.string().required();

export const ImageFileSchema = Joi.object({
	mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg").required(),
	size: Joi.number()
		.max(10 * 1024 * 1024)
		.required()
})
	.unknown(true)
	.required()
	.messages({
		"any.required": "Image file is required",
		"object.base": "Invalid image file format",
		"string.valid": "Only JPEG, PNG, and GIF files are allowed",
		"number.max": "File size must be less than 10MB"
	});
