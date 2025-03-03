"use client";

import type { Project } from "@/types/Project";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EditableText } from "@/components/shared/EditableText";
import useFetch, { axiosFetch } from "@/hooks/useFetch";
import { timestampToReadable } from "@/utils/helper";
import { UpdateProjectSchema } from "@/validations/ProjectSchema";
import { validate } from "@/validations/validate";
import { DoubleArrowLeftIcon, Cross2Icon, PlusIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useHotToast } from "@/contexts/HotToastContext";

// TODO: ADD SEE FULL IMAGE WHEN IMAGE ON CLICK, FIX THUMBNAIL LOGIC (CLICK = SHOW FULL IMAGE, EDIT/CHANGE BUTTON, DRAG N DROP TO EDIT/CHANGE)
export default function ProjectDetailPage() {
	const { toast } = useHotToast();
	const { id } = useParams();
	const { data, refetch } = useFetch<Project>({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`
	});
	const project = data?.data;

	// Data Handlers
	const updateProjectData = async (newData: object) => {
		try {
			validate(UpdateProjectSchema, newData);
		} catch (err) {
			toast.error("Failed: " + (err as Error).message);
			throw err;
		}

		const formData = new FormData();
		formData.append("data", JSON.stringify(newData));

		const { data, error } = await axiosFetch({
			method: "PATCH",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
			data: formData,
			headers: { "Content-Type": "multipart/form-data" }
		});

		if (error) toast.error(error.message);

		if (data) {
			toast.success(data.message);
			refetch();
		}
	};

	const handleUpdateField = async (newValue: string, field: string) => await updateProjectData({ [field]: newValue });

	// Tech Handlers
	const handleUpdateTech = async (newValue: string, index: number) => {
		const newTechs = [...(project?.technologies ?? [])];
		newTechs[index] = newValue;
		await updateProjectData({ technologies: newTechs });
	};

	const handleAddTech = async () => {
		const newTechs = [...(project?.technologies ?? []), "New Tech"];
		await updateProjectData({ technologies: newTechs });
	};

	const handleDeleteTech = async (i: number) => {
		const newTechs = [...(project?.technologies ?? [])];
		newTechs.splice(i, 1);
		await updateProjectData({ technologies: newTechs });
	};

	// Thumbnail Handlers
	const handleUpdateThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const formData = new FormData();
			formData.append("thumbnail", e.target.files[0]);

			const { data, error } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: { "Content-Type": "multipart/form-data" }
			});

			if (error) toast.error(error.message);

			if (data) {
				toast.success(data.message);
				refetch();
			}
		}
	};

	// Preview Handlers
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
				headers: { "Content-Type": "multipart/form-data" }
			});

			if (error) toast.error(error.message);

			if (data) {
				toast.success(data.message);
				refetch();
			}
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
				headers: { "Content-Type": "multipart/form-data" }
			});

			if (error) toast.error(error.message);

			if (data) {
				toast.success(data.message);
				refetch();
			}
		}
	};

	const handleDeletePreview = async (previewUrl: string) => {
		const formData = new FormData();
		formData.append("preview_detail", JSON.stringify({ delete: [previewUrl] }));

		const { data, error } = await axiosFetch({
			method: "PATCH",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
			data: formData,
			headers: { "Content-Type": "multipart/form-data" }
		});

		if (error) toast.error(error.message);

		if (data) {
			toast.success(data.message);
			refetch();
		}
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
				headers: { "Content-Type": "multipart/form-data" }
			});

			if (error) toast.error(error.message);

			if (data) {
				toast.success(data.message);
				refetch();
			}
		}
	};

	return (
		<main className="w-full min-h-dvh bg-neutral-100 text-neutral-800">
			{/* Back button */}
			<Link href={"/project"} className="absolute top-3 left-3 btn-primary flex gap-3 items-center">
				<DoubleArrowLeftIcon className="size-4" /> <span className="text-xs tracking-wide">Back</span>
			</Link>

			<p className="absolute top-4 left-28 mb-6 text-xs tracking-wide flex gap-1 items-center">
				Content with Pencil icon is editable
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
							<h1>
								<EditableText
									value={project?.title || ""}
									onUpdate={(newVal) => handleUpdateField(newVal, "title")}
									className="w-fit font-semibold leading-none text-4xl"
								/>
							</h1>
						</div>

						{/* Tagline */}
						<div className="mt-4">
							<p className="text-xs text-neutral-500">Tagline</p>
							<p>
								<EditableText
									value={project?.tagline || ""}
									onUpdate={(newVal) => handleUpdateField(newVal, "tagline")}
									className="text-base tracking-wide"
								/>
							</p>
						</div>

						{/* Technologies */}
						<div className="mt-6">
							<p className="mb-1 text-xs text-neutral-500">Technologies</p>
							<div className="flex flex-wrap items-center gap-2 text-xs tracking-wider">
								{project?.technologies.map((tech, i) => (
									<TechTags
										key={i}
										value={tech}
										index={i}
										handleUpdateTech={handleUpdateTech}
										handleDeleteTech={handleDeleteTech}
										length={project?.technologies.length || 0}
									/>
								))}
								<button
									type="button"
									onClick={handleAddTech}
									className="btn-secondary-icon btn-secondary-blue size-6 !p-1"
								>
									<PlusIcon />
								</button>
							</div>
						</div>

						{/* Description */}
						<div className="mt-8">
							<p className="text-xs text-neutral-500">Description</p>
							<p>
								<EditableText
									value={project?.description || ""}
									onUpdate={(newVal) => handleUpdateField(newVal, "description")}
									className="text-neutral-700 max-w-3xl text-sm tracking-wide"
								/>
							</p>
						</div>

						{/* Links / Urls */}
						<div className="mt-8 flex flex-col gap-3">
							<LinkUrl
								url={project?.site_url || ""}
								label="Site URL"
								onUpdate={(newVal: string) => handleUpdateField(newVal, "site_url")}
							/>
							<LinkUrl
								url={project?.source_code_url || ""}
								label="Source Code URL"
								onUpdate={(newVal: string) => handleUpdateField(newVal, "source_code_url")}
							/>
							<LinkUrl
								url={project?.demo_url || ""}
								label="Demo URL"
								onUpdate={(newVal: string) => handleUpdateField(newVal, "demo_url")}
							/>
						</div>
					</div>

					<div className="flex flex-col">
						{/* Thumbnail */}
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

						{/* Previews */}
						<div className="mt-6">
							<p className="text-xs text-neutral-500">Previews</p>
							<div
								onDragOver={(e) => e.preventDefault()}
								onDrop={handleDropPreview}
								className="relative w-full p-2 rounded-sm border-2 border-dashed border-neutral-400 grid grid-cols-2 gap-2"
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

/**
 * SUB COMPONENT
 */

function TechTags({
	value,
	index,
	handleUpdateTech,
	handleDeleteTech,
	length
}: {
	value: string;
	index: number;
	handleUpdateTech: (newVal: string, i: number) => void;
	handleDeleteTech: (i: number) => void;
	length: number;
}) {
	return (
		<div className="px-2 py-1 ps-6 rounded-lg border border-neutral-400 flex items-center gap-2">
			<p>
				<EditableText value={value} onUpdate={async (newVal) => handleUpdateTech(newVal, index)} />
			</p>

			{length > 1 && (
				<button
					type="button"
					onClick={() => handleDeleteTech(index)}
					className="p-0.5 rounded-full text-red-400 cursor-pointer hover:bg-red-200 hover:text-red-500"
				>
					<Cross2Icon className="size-3" />
				</button>
			)}
		</div>
	);
}

function LinkUrl({ url, label, onUpdate }: { url: string; label: string; onUpdate: (newVal: string) => void }) {
	return (
		<div className="flex flex-wrap gap-x-3 items-center">
			<p className="w-full text-xs text-neutral-500">{label}</p>
			<p>
				<EditableText
					value={url}
					onUpdate={async (newVal) => onUpdate(newVal)}
					className={`${url ? "text-sm" : "text-sm text-neutral-400"}`}
					placeholder="https://example.com"
				/>
			</p>
			{url && (
				<a href={url} target="_blank">
					<ExternalLinkIcon className="size-4 text-blue-500" />
				</a>
			)}
		</div>
	);
}
