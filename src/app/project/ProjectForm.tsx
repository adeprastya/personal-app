import type { Project } from "@/types/Project";
import { useRef, useState } from "react";
import InputField from "../../components/shared/InputField";
import { axiosFetch } from "../../hooks/useFetch";
import { useAuth } from "../../contexts/useAuth";

const sty = {
	input: "w-full h-8 border border-neutral-600 rounded-md focus:outline-neutral-600",
	tech: "leading-none mb-2",
	inputTech: "w-30 h-8 border border-neutral-600 rounded-md focus:outline-neutral-600",

	button:
		"cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-white bg-neutral-900 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-2 focus:outline-neutral-900 transition-all",
	buttonGhost:
		"cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-neutral-950 bg-neutral-100 hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-2 focus:outline-neutral-300 transition-all"
};

const projectPayload: Omit<Project, "id" | "created_at" | "image_url"> = {
	title: "",
	description: "",
	technologies: [""],
	site_url: "",
	source_code_url: "",
	demo_url: ""
};

export default function ProjectForm() {
	const { auth } = useAuth();

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

		const { result, error } = await axiosFetch("POST", "/api/project", {
			headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${auth}` },
			data: formData
		});

		if (error) {
			console.error(error?.response?.data);
			return;
		}

		if (result) {
			console.log(result);
			window.location.reload();
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
		<div className="w-full lg:w-10/12 border border-neutral-200 rounded-lg shadow-sm">
			{/* Expand Button */}
			<button
				type="button"
				className="cursor-pointer w-full py-1 px-4 bg-neutral-100 font-semibold text-xl text-neutral-800 flex justify-between"
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
				<div className="w-full pt-4 flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
					<div className="flex flex-col gap-6">
						<InputField label="Title" name="title" required onChange={handleChange} className={sty.input} />

						<InputField
							label="Description"
							name="description"
							type="textarea"
							required
							onChange={handleChange}
							className={sty.input}
						/>

						<div>
							<p className={sty.tech}>Technologies</p>

							<div className="flex flex-wrap gap-2">
								{payload.technologies.map((tech, i) => (
									<InputField
										key={i}
										label={`Tech ${i + 1}`}
										name={`tech_${i}`}
										required={i == 0}
										onChange={(e) => handleTechChange(e, i)}
										value={tech}
										className={`${sty.inputTech} ${i !== 0 && tech === "" ? "opacity-40" : ""}`}
									/>
								))}
							</div>
						</div>

						<InputField label="Site URL" name="site_url" onChange={handleChange} className={sty.input} />

						<InputField label="Source Code URL" name="source_code_url" onChange={handleChange} className={sty.input} />

						<InputField label="Demo URL" name="demo_url" onChange={handleChange} className={sty.input} />
					</div>

					<div>
						<label htmlFor="image" className="">
							Image
						</label>
						<div
							className="aspect-video"
							style={{
								backgroundImage: imagePayload
									? `url(${URL.createObjectURL(imagePayload)})`
									: "linear-gradient(to top right, oklch(0.985 0 0), oklch(0.985 0 0), oklch(0.922 0 0), oklch(0.985 0 0))",
								backgroundSize: "cover",
								backgroundPosition: "center"
							}}
						>
							<input
								id="image"
								type="file"
								onChange={handleImageChange}
								className="cursor-pointer size-full border border-neutral-600 rounded-md focus:outline-neutral-600 hover:outline-neutral-600"
							/>
						</div>
					</div>
				</div>

				<div className="pb-4 pt-6 flex gap-6">
					<button type="submit" className={sty.button}>
						Submit
					</button>

					<button type="reset" className={sty.buttonGhost} onClick={handleReset} title="Clear">
						Clear
					</button>
				</div>
			</form>
		</div>
	);
}
