"use client";

import type { Project } from "@/types/Project";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useFetch, { axiosFetch } from "@/hooks/useFetch";
import { timestampToReadable } from "@/utils/helper";
import { UpdateProjectSchema } from "@/validations/ProjectSchema";
import { validate } from "@/validations/validate";

export default function ProjectDetailPage() {
	const { id } = useParams();
	const { data, refetch } = useFetch<Project>({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
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
		<main className="w-full min-h-dvh flex items-center justify-center">
			{/* Back button */}
			<Link
				href={"/project"}
				className="fixed top-3 left-3 w-8 aspect-square rounded-sm bg-neutral-800 text-neutral-200 flex justify-center items-center"
			>
				{"<<"}
			</Link>

			{/* Main Content */}
			{data && (
				<div className="p-8 flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<p className="text-xs tracking-wide">{timestampToReadable(project?.created_at as string)}</p>

						{/* Title */}
						<div className="font-semibold text-4xl flex items-center gap-4">
							<h1
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "title")}
								title={project?.id}
								className="cursor-pointer"
							>
								{project?.title}
							</h1>

							<span className="text-neutral-400">...</span>
						</div>

						{/* Tagline */}
						<div className="text-lg flex items-center gap-4">
							<p
								contentEditable
								suppressContentEditableWarning
								spellCheck={false}
								onFocus={handleFocus}
								onBlur={(e) => handleUpdate(e, "tagline")}
								title={project?.id}
								className="cursor-pointer"
							>
								{project?.tagline}
							</p>

							<span className="text-neutral-400">...</span>
						</div>

						{/* Technologies */}
						<div className="flex items-center gap-2 text-xs tracking-wider">
							<div className="flex flex-row flex-wrap gap-3">
								{project?.technologies.map((tech, i) => (
									<div key={i} className="px-2 py-0.5 rounded-md bg-neutral-200 flex items-center gap-2">
										<p
											contentEditable
											suppressContentEditableWarning
											spellCheck={false}
											onFocus={handleFocus}
											onBlur={(e) => handleUpdateTech(e, i)}
											className="cursor-pointer"
										>
											{tech}
										</p>

										{project?.technologies.length > 1 && (
											<button
												type="button"
												onClick={() => handleDeleteTech(i)}
												className="text-neutral-500 cursor-pointer"
											>
												x
											</button>
										)}
									</div>
								))}
							</div>

							<button type="button" onClick={handleAddTech} className="text-neutral-500 cursor-pointer">
								+
							</button>
						</div>
					</div>

					{/* Description */}
					<div className="text-neutral-700 flex items-center gap-2">
						<p
							contentEditable
							suppressContentEditableWarning
							spellCheck={false}
							onFocus={handleFocus}
							onBlur={(e) => handleUpdate(e, "description")}
							className="block max-w-3xl text-base cursor-pointer"
						>
							{project?.description}
						</p>

						<span className="text-neutral-500">...</span>
					</div>

					<div className="flex flex-col gap-2 tracking-wide">
						{/* Site Url */}
						<div className="flex gap-2 items-center">
							<p className="text-xs">Site: </p>

							{project?.site_url ? (
								<>
									<p
										contentEditable
										suppressContentEditableWarning
										spellCheck={false}
										onFocus={handleFocus}
										onBlur={(e) => handleUpdate(e, "site_url")}
										className="text-sm cursor-pointer"
									>
										{project.site_url}
									</p>

									<span className="text-neutral-500">...</span>

									<a
										href={project.site_url}
										target="_blank"
										className="text-xs text-blue-500 underline underline-offset-2"
									>
										Visit
									</a>
								</>
							) : (
								<>
									<p
										contentEditable
										suppressContentEditableWarning
										spellCheck={false}
										onFocus={handleFocus}
										onBlur={(e) => handleUpdate(e, "site_url")}
										className="text-xs text-neutral-400 cursor-pointer"
									>
										Add Site Url
									</p>

									<span className="text-neutral-500">...</span>
								</>
							)}
						</div>

						{/* Source Code Url */}
						<div className="flex gap-2 items-center">
							<p className="text-xs">Source Code: </p>

							{project?.source_code_url ? (
								<>
									<p
										contentEditable
										suppressContentEditableWarning
										spellCheck={false}
										onFocus={handleFocus}
										onBlur={(e) => handleUpdate(e, "source_code_url")}
										className="text-sm cursor-pointer"
									>
										{project.source_code_url}
									</p>

									<span className="text-neutral-500">...</span>

									<a
										href={project.source_code_url || ""}
										target="_blank"
										className="text-xs text-blue-500 underline underline-offset-2"
									>
										Visit
									</a>
								</>
							) : (
								<>
									<p
										contentEditable
										suppressContentEditableWarning
										spellCheck={false}
										onFocus={handleFocus}
										onBlur={(e) => handleUpdate(e, "source_code_url")}
										className="text-xs text-neutral-400 cursor-pointer"
									>
										Add Source Code Url
									</p>

									<span className="text-neutral-500">...</span>
								</>
							)}
						</div>

						{/* Demo Url */}
						<div className="flex gap-2 items-center">
							<p className="text-xs">Demo: </p>
							{project?.demo_url ? (
								<>
									<p
										contentEditable
										suppressContentEditableWarning
										spellCheck={false}
										onFocus={handleFocus}
										onBlur={(e) => handleUpdate(e, "demo_url")}
										className="text-sm cursor-pointer"
									>
										{project.demo_url}
									</p>

									<span className="text-neutral-500">...</span>

									<a
										href={project.demo_url || ""}
										target="_blank"
										className="text-xs text-blue-500 underline underline-offset-2"
									>
										Visit
									</a>
								</>
							) : (
								<>
									<p
										contentEditable
										suppressContentEditableWarning
										spellCheck={false}
										onFocus={handleFocus}
										onBlur={(e) => handleUpdate(e, "demo_url")}
										className="text-xs text-neutral-400 cursor-pointer"
									>
										Add Demo Url
									</p>

									<span className="text-neutral-500">...</span>
								</>
							)}
						</div>
					</div>

					{/* Thumbnail Image */}
					<div className="relative w-xl rounded-sm border border-neutral-400 aspect-video flex items-center justify-center group">
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

					{/* Preview Container and Add Button / Drag and Drop */}
					<div
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDropPreview}
						className="relative w-xl p-2 rounded-sm border border-dashed border-neutral-400 grid grid-cols-2 gap-2"
					>
						<div className="col-span-2">
							<p className="text-center text-sm text-neutral-400">Click or Drag n Drop here to add Preview Images</p>

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
									className="absolute top-0 right-0 px-2 py-0.5 bg-red-500 text-xs text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
								>
									x
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</main>
	);
}
