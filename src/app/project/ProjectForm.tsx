"use client";

import type { Project } from "@/types/Project";
import { useRef, useState } from "react";
import InputField from "@/components/shared/InputField";
import TextareaField from "@/components/shared/TextareaField";
import ImageInputField from "@/components/shared/ImageInputField";
import { axiosFetch } from "@/hooks/useFetch";

const projectPayload: Omit<Project, "id" | "created_at" | "image_url"> = {
	title: "",
	description: "",
	technologies: [""],
	site_url: "",
	source_code_url: "",
	demo_url: ""
};

export default function ProjectForm({ refetch }: { refetch: () => void }) {
	const [payload, setPayload] = useState(projectPayload);
	const [imagePayload, setImagePayload] = useState<File | null>(null);

	const formRef = useRef<HTMLFormElement>(null);
	const [expandedForm, setExpandedForm] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const reqPayload = JSON.stringify({
			...payload,
			technologies: payload.technologies.filter((tech) => tech.trim() !== "")
		});

		const formData = new FormData();
		formData.append("image", imagePayload || "");
		formData.append("data", reqPayload);

		const { data, error } = await axiosFetch({
			method: "POST",
			url: process.env.NEXT_PUBLIC_BACKEND_URL + "/project",
			headers: {
				"Content-Type": "multipart/form-data"
			},
			data: formData
		});

		if (error) {
			console.error(error);
			return;
		}

		if (data) {
			refetch();
			handleReset();
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setPayload((p) => ({ ...p, [e.target.name]: e.target.value }));
	};

	const handleTechChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
		const value = e.target.value;

		setPayload((p) => {
			const updatedTechnologies = [...p.technologies];
			updatedTechnologies[index] = value;

			if (value.trim() && index === updatedTechnologies.length - 1) {
				updatedTechnologies.push("");
			}

			return { ...p, technologies: updatedTechnologies };
		});
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImagePayload(file);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleReset = () => {
		formRef.current?.reset();
		setPayload(projectPayload);
		setImagePayload(null);
	};

	return (
		<div className="w-full lg:w-10/12 border border-neutral-400 rounded-sm overflow-clip">
			{/* Expand Button */}
			<button
				type="button"
				className={`cursor-pointer w-full py-2 px-4 font-medium tracking-wide flex justify-between ${
					expandedForm ? "border-b border-neutral-400" : "border-b-0"
				}`}
				onClick={() => setExpandedForm((p) => !p)}
			>
				<span>Add New Project</span>
				<span>{expandedForm ? "/\\" : "\\/"}</span>
			</button>

			<form
				onSubmit={handleSubmit}
				ref={formRef}
				className="px-4 transition-all duration-300 overflow-clip"
				style={{ height: expandedForm ? `${formRef.current?.scrollHeight}px` : "0" }}
			>
				<div className="w-full pt-6 flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
					<div className="flex flex-col gap-6">
						<InputField
							label="Title"
							name="title"
							placeholder="Your Project Title..."
							required
							onChange={handleChange}
						/>

						<TextareaField
							label="Description"
							name="description"
							placeholder="Describe your project..."
							type="textarea"
							required
							onChange={handleChange}
						/>

						<div>
							<p className="-translate-y-2 font-normal text-sm text-neutral-600">Technologies</p>

							<div className="flex flex-wrap gap-2">
								{payload.technologies.map((tech, i) => (
									<InputField
										key={i}
										label={`Tech ${i + 1}`}
										name={`tech_${i}`}
										placeholder="Tech used..."
										required={i == 0}
										onChange={(e) => handleTechChange(e, i)}
										value={tech}
									/>
								))}
							</div>
						</div>

						<InputField label="Site URL" name="site_url" placeholder="https://example.com" onChange={handleChange} />

						<InputField
							label="Source Code URL"
							name="source_code_url"
							placeholder="https://github.com"
							onChange={handleChange}
						/>

						<InputField label="Demo URL" name="demo_url" placeholder="https://example.com" onChange={handleChange} />
					</div>

					<ImageInputField label="Image" name="image" preview={imagePayload} onChange={handleImageChange} />
				</div>

				<div className="pb-4 pt-6 flex gap-6">
					<button
						type="submit"
						className="cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-white bg-neutral-900 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-2 focus:outline-neutral-900 transition-all"
					>
						Submit
					</button>

					<button
						type="reset"
						onClick={handleReset}
						className="cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-neutral-950 bg-neutral-100 hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-2 focus:outline-neutral-300 transition-all"
					>
						Clear
					</button>
				</div>
			</form>
		</div>
	);
}
