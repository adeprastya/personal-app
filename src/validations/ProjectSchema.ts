import Joi from "joi";

export const IdSchema = Joi.string().required().messages({
	"string.empty": "ID is required",
	"any.required": "ID is required"
});

export const ImageFileSchema = Joi.object({
	mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg", "image/webp").required().messages({
		"string.empty": "Image is required",
		"any.required": "Image is required",
		"any.only": "Only JPG, JPEG, and PNG files are allowed"
	}),
	size: Joi.number()
		.min(1)
		.max(10 * 1024 * 1024)
		.messages({
			"number.min": "Image is required",
			"number.max": "File size must be less than 10MB"
		})
})
	.unknown(true)
	.messages({
		"object.unknown": "Invalid file format"
	});

export const CreateProjectSchema = Joi.object({
	title: Joi.string().min(1).max(100).required().messages({
		"string.empty": "Title is required",
		"string.min": "Title must be at least 1 character long",
		"string.max": "Title must be at most 100 characters long",
		"any.required": "Title is required"
	}),
	tagline: Joi.string().min(1).max(100).required().messages({
		"string.empty": "Tagline is required",
		"string.min": "Tagline must be at least 1 character long",
		"string.max": "Tagline must be at most 100 characters long",
		"any.required": "Tagline is required"
	}),
	description: Joi.string().min(10).max(2000).required().messages({
		"string.empty": "Description is required",
		"string.min": "Description must be at least 10 characters long",
		"string.max": "Description must be at most 2000 characters long",
		"any.required": "Description is required"
	}),
	technologies: Joi.array()
		.items(
			Joi.string().min(1).max(100).messages({
				"string.empty": "Each technology must be at least 1 character long",
				"string.min": "Each technology must be at least 1 character long",
				"string.max": "Each technology must be at most 100 characters long"
			})
		)
		.min(1)
		.max(20)
		.required()
		.messages({
			"array.min": "At least one technology is required",
			"array.max": "At most 20 technologies are allowed",
			"any.required": "Technologies are required"
		}),
	site_url: Joi.string().uri().optional().messages({
		"string.uri": "Site URL must be a valid URI"
	}),
	source_code_url: Joi.string().uri().optional().messages({
		"string.uri": "Source code URL must be a valid URI"
	}),
	demo_url: Joi.string().uri().optional().messages({
		"string.uri": "Demo URL must be a valid URI"
	})
}).messages({
	"object.base": "Invalid data provided"
});

export const UpdateProjectSchema = Joi.object({
	title: Joi.string().min(1).max(100).optional().messages({
		"string.min": "Title must be at least 1 character long",
		"string.max": "Title must be at most 100 characters long"
	}),
	tagline: Joi.string().min(1).max(100).optional().messages({
		"string.min": "Tagline must be at least 1 character long",
		"string.max": "Tagline must be at most 100 characters long"
	}),
	description: Joi.string().min(10).max(2000).optional().messages({
		"string.min": "Description must be at least 10 characters long",
		"string.max": "Description must be at most 2000 characters long"
	}),
	technologies: Joi.array()
		.items(
			Joi.string().min(1).max(100).messages({
				"string.empty": "Each technology must be at least 1 character long",
				"string.min": "Each technology must be at least 1 character long",
				"string.max": "Each technology must be at most 100 characters long"
			})
		)
		.max(20)
		.optional()
		.messages({
			"array.max": "At most 20 technologies are allowed"
		}),
	site_url: Joi.string().uri().optional().messages({
		"string.uri": "Site URL must be a valid URI"
	}),
	source_code_url: Joi.string().uri().optional().messages({
		"string.uri": "Source code URL must be a valid URI"
	}),
	demo_url: Joi.string().uri().optional().messages({
		"string.uri": "Demo URL must be a valid URI"
	})
}).messages({
	"object.base": "Invalid data provided",
	"object.unknown": "Unknown fields are not allowed"
});

export const UpdateProjectPreviewDetailSchema = Joi.object({
	delete: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
		"array.max": "At most 10 preview urls are allowed"
	}),
	update: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
		"array.max": "At most 10 preview urls are allowed"
	})
}).messages({
	"object.base": "Invalid data provided",
	"object.unknown": "Unknown fields are not allowed"
});
