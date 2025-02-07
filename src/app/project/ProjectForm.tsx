"use client";

import { useState, useRef } from "react";
import InputField from "@/components/shared/InputField";
import TextareaField from "@/components/shared/TextareaField";
import ImageInputField from "@/components/shared/ImageInputField";
import { axiosFetch } from "@/hooks/useFetch";
import { Formik, Form, FieldArray } from "formik";
import { validate } from "@/validations/formikValidate";
import { CreateProjectSchema } from "@/validations/ProjectSchema";
import { filterEmptyArrayIndex, filterEmptyObjectFields } from "@/utils/helper";
import { Project } from "@/types/Project";

type ProjectPayload = Omit<Project, "id" | "created_at" | "image_url"> & { image: File | null };

const FORM_INIT: ProjectPayload = {
	title: "",
	description: "",
	technologies: [""],
	site_url: "",
	source_code_url: "",
	demo_url: "",
	image: null
};

export default function ProjectForm({ refetch }: { refetch: () => void }) {
	const formRef = useRef<HTMLFormElement>(null);
	const [expandedForm, setExpandedForm] = useState(false);

	const handleValidate = (data: Partial<ProjectPayload>) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { image, technologies, ...rest } = data;
		const clearTech = filterEmptyArrayIndex(technologies as string[]);
		const clearData = filterEmptyObjectFields({ ...rest, technologies: clearTech });

		return validate(CreateProjectSchema, clearData);
	};

	const handleSubmit = async (
		values: Partial<ProjectPayload>,
		{ setSubmitting, resetForm }: { setSubmitting: (a: boolean) => void; resetForm: () => void }
	) => {
		const { image, technologies, ...rest } = values;
		const clearTech = filterEmptyArrayIndex(technologies as string[]);
		const clearData = filterEmptyObjectFields({ ...rest, technologies: clearTech });

		const formData = new FormData();
		formData.append("image", image as File);
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

			{/* Formik Form */}
			<Formik initialValues={FORM_INIT} validate={handleValidate} onSubmit={handleSubmit}>
				{({ values, handleChange, setFieldValue, resetForm, isSubmitting }) => (
					<Form
						ref={formRef}
						style={{ height: expandedForm ? `${formRef.current?.scrollHeight}px` : "0" }}
						className="px-4 transition-all duration-300 overflow-clip"
					>
						<div className="w-full pt-6 flex flex-col md:grid md:grid-cols-2 gap-6">
							<div className="flex flex-col gap-6">
								{/* Title Field */}
								<InputField
									label="Title"
									name="title"
									placeholder="Your Project Title..."
									required
									value={values.title}
									onChange={handleChange}
								/>

								{/* Description Field */}
								<TextareaField
									label="Description"
									name="description"
									placeholder="Describe your project..."
									required
									value={values.description}
									onChange={handleChange}
								/>

								{/* Technologies */}
								<div>
									<p className="-translate-y-2 font-normal text-sm text-neutral-600">Technologies</p>

									<div className="flex flex-wrap gap-2">
										<FieldArray
											name="technologies"
											render={(arrayHelpers) =>
												values.technologies &&
												values.technologies.map((tech, i) => (
													<div key={i} className="flex items-center gap-1">
														<InputField
															label={`Tech ${i + 1}`}
															name={`technologies.${i}`}
															placeholder="Tech used..."
															required={i == 0}
															value={tech}
															onChange={(e) => {
																handleChange(e);
																if (e.target.value.trim() !== "" && values.technologies[i + 1] == undefined) {
																	arrayHelpers.insert(i + 1, "");
																}
															}}
														/>
														<button
															type="button"
															disabled={values.technologies.length === 1}
															onClick={() => arrayHelpers.remove(i)}
															className="h-5/6 aspect-square rounded-md border border-red-500 text-red-500 flex items-center justify-center cursor-pointer"
														>
															X
														</button>
													</div>
												))
											}
										/>
									</div>
								</div>

								{/* Site URL */}
								<InputField
									label="Site URL"
									name="site_url"
									placeholder="https://example.com"
									value={values.site_url as string | undefined}
									onChange={handleChange}
								/>

								{/* Source Code URL */}
								<InputField
									label="Source Code URL"
									name="source_code_url"
									placeholder="https://github.com"
									value={values.source_code_url as string | undefined}
									onChange={handleChange}
								/>

								{/* Demo URL */}
								<InputField
									label="Demo URL"
									name="demo_url"
									placeholder="https://example.com"
									value={values.demo_url as string | undefined}
									onChange={handleChange}
								/>
							</div>

							{/* Image Upload */}
							<ImageInputField
								label="Image"
								name="image"
								preview={values.image}
								onChange={(e) => setFieldValue("image", e.target.files?.[0] || null)}
							/>
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
