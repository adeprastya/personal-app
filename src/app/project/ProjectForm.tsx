"use client";

import { useState, useRef } from "react";
import InputField from "@/components/shared/InputField";
import TextareaField from "@/components/shared/TextareaField";
import ImageInputField from "@/components/shared/ImageInputField";
import ArrayTextField from "@/components/shared/ArrayTextField";
import ArrayImageField from "@/components/shared/ArrayImageField";
import { axiosFetch } from "@/hooks/useFetch";
import { Formik, Form } from "formik";
import { validate } from "@/validations/formikValidate";
import { CreateProjectSchema } from "@/validations/ProjectSchema";
import { filterEmptyArrayIndex, filterEmptyObjectFields } from "@/utils/helper";
import { Project } from "@/types/Project";

type ProjectPayload = Omit<Project, "id" | "created_at" | "image_thumbnail_url" | "image_preview_urls"> & {
	image_thumbnail: File | null;
	image_previews: File[];
};
const FORM_INIT: ProjectPayload = {
	title: "",
	tagline: "",
	description: "",
	technologies: [],
	site_url: "",
	source_code_url: "",
	demo_url: "",
	image_thumbnail: null,
	image_previews: []
};

export default function ProjectForm({ refetch }: { refetch: () => void }) {
	const formRef = useRef<HTMLFormElement>(null);
	const [expandedForm, setExpandedForm] = useState(false);

	const handleValidate = (data: Partial<ProjectPayload>) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { image_thumbnail, image_previews, technologies, ...rest } = data;
		const cleanTech = filterEmptyArrayIndex(technologies as string[]);
		const cleanData = filterEmptyObjectFields({ ...rest, technologies: cleanTech });

		return validate(CreateProjectSchema, cleanData);
	};

	const handleSubmit = async (
		values: Partial<ProjectPayload>,
		{ setSubmitting, resetForm }: { setSubmitting: (a: boolean) => void; resetForm: () => void }
	) => {
		const { image_thumbnail, image_previews, technologies, ...rest } = values;
		const clearTech = filterEmptyArrayIndex(technologies as string[]);
		const clearData = filterEmptyObjectFields({ ...rest, technologies: clearTech });

		const formData = new FormData();
		if (image_thumbnail) {
			formData.append("thumbnail", image_thumbnail);
		}
		if (image_previews) {
			const previewsArray = Array.isArray(image_previews) ? image_previews : [image_previews];
			previewsArray.forEach((file) => {
				formData.append("previews", file);
			});
		}
		formData.append("data", JSON.stringify(clearData));

		const { data, error } = await axiosFetch({
			method: "POST",
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project`,
			headers: { "Content-Type": "multipart/form-data" },
			data: formData
		});

		if (error) {
			console.error(error);
		}

		if (data) {
			refetch();
			resetForm();
		}

		setSubmitting(false);
	};

	return (
		<div className="w-full lg:w-10/12 border border-neutral-600 rounded-sm overflow-clip">
			{/* Expand/Collapse Button */}
			<button
				type="button"
				className={`cursor-pointer w-full py-2 px-4 font-medium tracking-wide flex justify-between ${
					expandedForm ? "border-b border-neutral-600" : "border-b-0"
				}`}
				onClick={() => setExpandedForm((prev) => !prev)}
			>
				<span>Add New Project</span>
				<span>{expandedForm ? "/\\" : "\\/"}</span>
			</button>

			{/* Form */}
			<Formik initialValues={FORM_INIT} validate={handleValidate} onSubmit={handleSubmit}>
				{({ resetForm, isSubmitting }) => (
					<Form
						ref={formRef}
						style={{ height: expandedForm ? `${formRef.current?.scrollHeight}px` : "0" }}
						className="px-4 transition-all duration-300 overflow-clip"
					>
						<div className="w-full pt-6 flex flex-col md:grid md:grid-cols-2 gap-6">
							<div className="flex flex-col gap-6">
								{/* Title */}
								<InputField label="Title" name="title" placeholder="Your Project Title..." required />

								{/* Tagline */}
								<InputField label="Tagline" name="tagline" placeholder="Your Project Tagline..." required />

								{/* Description */}
								<TextareaField label="Description" name="description" placeholder="Describe your project..." required />

								{/* Technologies */}
								<ArrayTextField
									label="Technologies"
									name="technologies"
									placeholder="Type and Enter to add value..."
									required
								/>

								{/* Site URL */}
								<InputField label="Site URL" name="site_url" placeholder="https://example.com" />

								{/* Source Code URL */}
								<InputField label="Source Code URL" name="source_code_url" placeholder="https://github.com" />

								{/* Demo URL */}
								<InputField label="Demo URL" name="demo_url" placeholder="https://example.com" />
							</div>

							<div className="flex flex-col gap-6">
								{/* Thumbnail Image Upload */}
								<ImageInputField label="Thumbnail Image" name="image_thumbnail" />

								{/* Preview Images Upload */}
								<ArrayImageField label="Preview Images" name="image_previews" multiple />
							</div>
						</div>

						{/* Submit & Reset Buttons */}
						<div className="pb-4 pt-6 flex gap-6">
							{/* Submit */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-white bg-neutral-900 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-2 focus:outline-neutral-900 transition-all"
							>
								{isSubmitting ? "Submitting..." : "Submit"}
							</button>

							{/* Reset */}
							<button
								type="reset"
								onClick={() => resetForm()}
								className="cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-neutral-950 bg-neutral-100 hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-2 focus:outline-neutral-300 transition-all"
							>
								Clear
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}
