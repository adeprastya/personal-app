"use client";

import type { Project } from "@/types/Project";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useFetch, { axiosFetch } from "@/hooks/useFetch";
import { timestampToReadable } from "@/utils/helper";
import { UpdateProjectSchema } from "@/validations/ProjectSchema";
import { validate } from "@/validations/validate";
import { DoubleArrowLeftIcon, Pencil2Icon, Cross2Icon, PlusIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

export default function ProjectDetailPage() {
	const { id } = useParams();
	const { data, refetch } = useFetch<Project>({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`
	});
	const project = data?.data;

	const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
		e.currentTarget.dataset.oldValue = e.currentTarget.textContent?.trim() ?? "";
	};

	const handleUpdate = async (e: React.FocusEvent<HTMLElement>, field: string) => {
		const target = e.currentTarget;
		const newValue = target.textContent?.trim() ?? "";
		const oldValue = target.dataset.oldValue || newValue;

		if (newValue === oldValue) return;

		const newData = { [field]: newValue };
		try {
			validate(UpdateProjectSchema, newData);

			const formData = new FormData();
			formData.append("data", JSON.stringify(newData));

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			console.log("Update success:", data);

			if (target) {
				target.dataset.oldValue = newValue;
			}

			refetch();
		} catch (err) {
			console.error(err);
			if (target) {
				target.textContent = oldValue;
			}
		}
	};

	const handleUpdateTech = async (e: React.FocusEvent<HTMLElement>, i: number) => {
		const target = e.currentTarget;
		const newValue = target.textContent?.trim() ?? "";
		const oldValue = target.dataset.oldValue;

		if (newValue === oldValue) return;

		const newTechs = [...(project?.technologies ?? [])];
		newTechs[i] = newValue;

		const newData = { technologies: newTechs };
		try {
			validate(UpdateProjectSchema, newData);

			const formData = new FormData();
			formData.append("data", JSON.stringify(newData));

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			console.log("Update success:", data);

			if (target) {
				target.dataset.oldValue = newValue;
			}

			refetch();
		} catch (err) {
			console.error(err);
			if (target) {
				target.textContent = oldValue || "";
			}
		}
	};

	const handleAddTech = async () => {
		const newTechs = [...(project?.technologies ?? []), "New Technology"];

		const newData = { technologies: newTechs };
		try {
			validate(UpdateProjectSchema, newData);

			const formData = new FormData();
			formData.append("data", JSON.stringify(newData));

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			console.log("Update success:", data);

			refetch();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteTech = async (i: number) => {
		const newTechs = [...(project?.technologies ?? [])];
		newTechs.splice(i, 1);

		const newData = { technologies: newTechs };
		try {
			validate(UpdateProjectSchema, newData);

			const formData = new FormData();
			formData.append("data", JSON.stringify(newData));

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			console.log("Update success:", data);

			refetch();
		} catch (err) {
			console.error(err);
		}
	};

	const handleUpdateThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const formData = new FormData();
			formData.append("thumbnail", e.target.files[0]);

			const { data, error } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			if (error) {
				console.error("Error updating thumbnail", error);
			}

			if (data) {
				console.log("Thumbnail updated successfully", data);
			}

			refetch();
		}
	};

	const handleAddPreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const formData = new FormData();
			for (const file of e.target.files) {
				formData.append("previews", file);
			}

			const { data, error } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			if (error) {
				console.error("Error adding preview", error);
			}

			if (data) {
				console.log("Preview added successfully", data);
			}

			refetch();
		}
	};

	const handleUpdatePreview = async (e: React.ChangeEvent<HTMLInputElement>, previewUrl: string) => {
		if (e.target.files && project) {
			const formData = new FormData();
			for (const file of e.target.files) {
				formData.append("previews", file);
			}

			const updateDetail = { update: [previewUrl] };
			formData.append("preview_detail", JSON.stringify(updateDetail));

			const { data, error } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			if (error) {
				console.error("Error updating preview", error);
			}

			if (data) {
				console.log("Preview updated successfully", data);
			}

			refetch();
		}
	};

	const handleDeletePreview = async (previewUrl: string) => {
		const formData = new FormData();
		formData.append("preview_detail", JSON.stringify({ delete: [previewUrl] }));

		const { data, error } = await axiosFetch({
			method: "PATCH",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});

		if (error) {
			console.error("Error deleting preview", error);
		}

		if (data) {
			console.log("Preview deleted successfully", data);
		}

		refetch();
	};

	const handleDropPreview = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (e.dataTransfer.files) {
			const formData = new FormData();
			for (const file of e.dataTransfer.files) {
				formData.append("previews", file);
			}

			const { data, error } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			if (error) {
				console.error("Error adding preview (drop)", error);
			}

			if (data) {
				console.log("Preview added successfully (drop)", data);
			}

			refetch();
		}
	};

	return (
		<main className="w-full min-h-dvh bg-neutral-100 text-neutral-800">
			{/* Back button */}
			<Link
				href={"/project"}
				className="absolute top-3 left-3 p-2 rounded-sm bg-neutral-800 text-neutral-100 flex gap-2 justify-center items-center"
			>
				<DoubleArrowLeftIcon className="size-4" /> <span className="text-xs tracking-wide">Back</span>
			</Link>

			<p className="absolute top-4 left-22 mb-6 text-xs tracking-wide flex gap-1 items-center">
				Content with <Pencil2Icon className="size-3" /> icon is editable
			</p>

			{/* Main Content */}
			{data && (
				<div className="py-18 px-6 sm:px-16 md:px-32 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="flex flex-col">
						{/* Created At */}
						<div>
							<p className="text-xs text-neutral-500">Created</p>

							<p className="text-sm tracking-wide">{timestampToReadable(project?.created_at as string)}</p>
						</div>

						{/* Title */}
						<div className="mt-6">
							<p className="text-xs text-neutral-500">Title</p>

							<h1
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "title")}
								title={project?.id}
								className="relative w-fit font-semibold leading-none text-4xl cursor-pointer"
							>
								{project?.title}

								<Pencil2Icon className="absolute top-1 -left-5 size-3 text-neutral-400" />
							</h1>
						</div>

						{/* Tagline */}
						<div className="mt-4">
							<p className="text-xs text-neutral-500">Tagline</p>

							<p
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "tagline")}
								title={project?.id}
								className="relative w-fit text-base tracking-wide cursor-pointer"
							>
								{project?.tagline}

								<Pencil2Icon className="absolute top-1 -left-5 size-3 text-neutral-400" />
							</p>
						</div>

						{/* Technologies */}
						<div className="mt-6">
							<p className="mb-1 text-xs text-neutral-500">Technologies</p>

							<div className="flex flex-wrap items-center gap-2 text-xs tracking-wider">
								{project?.technologies.map((tech, i) => (
									<div key={i} className="px-2 py-1 rounded-lg border border-neutral-400 flex items-center gap-1">
										<p
											contentEditable
											suppressContentEditableWarning
											spellCheck={false}
											onFocus={handleFocus}
											onBlur={(e) => handleUpdateTech(e, i)}
											className="relative ms-4 cursor-pointer"
										>
											{tech}

											<Pencil2Icon className="absolute top-0 -left-5 size-3 text-neutral-400" />
										</p>

										{project?.technologies.length > 1 && (
											<button type="button" onClick={() => handleDeleteTech(i)} className="ms-1 cursor-pointer">
												<Cross2Icon className=" text-red-400" />
											</button>
										)}
									</div>
								))}

								<button
									type="button"
									onClick={handleAddTech}
									className="p-1 rounded-lg border border-blue-400 text-blue-400 cursor-pointer"
								>
									<PlusIcon className="size-4" />
								</button>
							</div>
						</div>

						{/* Description */}
						<div className="mt-8">
							<p className="text-xs text-neutral-500">Description</p>

							<p
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "description")}
								className="relative text-neutral-700 max-w-3xl text-sm tracking-wide cursor-pointer"
							>
								{project?.description}

								<Pencil2Icon className="absolute top-0 -left-5 size-3 text-neutral-400" />
							</p>
						</div>

						{/* Site Url */}
						<div className="mt-8 flex flex-wrap gap-x-2 items-end">
							<p className="w-full text-xs text-neutral-500">Live Site</p>

							<p
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "site_url")}
								className={`cursor-pointer relative ${project?.site_url ? "text-sm" : "text-xs text-neutral-400"}`}
							>
								{project?.site_url || "Add Site Url"}

								<Pencil2Icon className="absolute top-0 -left-5 size-3 text-neutral-400" />
							</p>

							{project?.site_url && (
								<a href={project?.site_url || ""} target="_blank">
									<ExternalLinkIcon className="size-4 text-blue-500" />
								</a>
							)}
						</div>

						{/* Source Code Url */}
						<div className="mt-4 flex flex-wrap gap-x-2 items-end">
							<p className="w-full text-xs text-neutral-500">Source Code</p>

							<p
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "source_code_url")}
								className={`cursor-pointer relative ${
									project?.source_code_url ? "text-sm" : "text-xs text-neutral-400"
								}`}
							>
								{project?.source_code_url || "Add Source Code Url"}

								<Pencil2Icon className="absolute top-0 -left-5 size-3 text-neutral-400" />
							</p>

							{project?.source_code_url && (
								<a href={project?.source_code_url || ""} target="_blank">
									<ExternalLinkIcon className="size-4 text-blue-500" />
								</a>
							)}
						</div>

						{/* Demo Url */}
						<div className="mt-4 flex flex-wrap gap-x-2 items-end">
							<p className="w-full text-xs text-neutral-500">Demo Video</p>

							<p
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "demo_url")}
								className={`cursor-pointer relative ${project?.demo_url ? "text-sm" : "text-xs text-neutral-400"}`}
							>
								{project?.demo_url || "Add Demo Url"}

								<Pencil2Icon className="absolute top-0 -left-5 size-3 text-neutral-400" />
							</p>

							{project?.demo_url && (
								<a href={project?.demo_url || ""} target="_blank">
									<ExternalLinkIcon className="size-4 text-blue-500" />
								</a>
							)}
						</div>
					</div>

					<div className="flex flex-col">
						{/* Thumbnail Image */}
						<div>
							<p className="text-xs text-neutral-500">Thumbnail</p>

							<div className="overflow-clip relative w-full aspect-video rounded-sm border border-neutral-400 flex items-center justify-center group">
								<Image
									src={project?.image_thumbnail_url || ""}
									alt={project?.title || ""}
									width={800}
									height={450}
									unoptimized
									className="size-full aspect-video object-cover rounded-xs"
								/>

								<p className="absolute px-2 py-0.5 bg-neutral-100/75 text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
									Click to change Thumbnail
								</p>

								<input
									type="file"
									onChange={handleUpdateThumbnail}
									accept="image/*"
									className="absolute top-0 left-0 size-full opacity-0 cursor-pointer"
								/>
							</div>
						</div>

						{/* Preview Container and Add Button / Drag and Drop */}
						<div className="mt-6">
							<p className="text-xs text-neutral-500">Previews</p>

							<div
								onDragOver={(e) => e.preventDefault()}
								onDrop={handleDropPreview}
								className="relative w-full p-2 rounded-sm border border-dashed border-neutral-400 grid grid-cols-2 gap-2"
							>
								<div className="col-span-2">
									<p className="text-center text-sm text-neutral-400">
										Click or Drag n Drop here to add Preview Images
									</p>

									<input
										type="file"
										accept="image/*"
										multiple
										onChange={handleAddPreview}
										className="absolute top-0 left-0 size-full opacity-0 cursor-pointer"
									/>
								</div>

								{/* Preview Images */}
								{project?.image_preview_urls.map((preview, i) => (
									<div
										key={i}
										className="relative overflow-clip rounded-xs border border-neutral-400 flex items-center justify-center group"
									>
										<Image
											src={preview}
											alt={`${project?.title} preview ${i + 1}`}
											width={400}
											height={225}
											unoptimized
											className="aspect-video object-cover"
										/>

										<p className="absolute px-2 py-0.5 bg-neutral-100/75 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
											Click to change This Preview
										</p>

										<input
											type="file"
											accept="image/*"
											onChange={(e) => handleUpdatePreview(e, preview)}
											className="absolute top-0 left-0 size-full opacity-0 cursor-pointer"
										/>

										<button
											type="button"
											onClick={() => handleDeletePreview(preview)}
											className="absolute top-0 right-0 p-1 bg-neutral-100/75 text-xs text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<Cross2Icon className="size-5" />
										</button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
