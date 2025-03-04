"use client";

import type { Project } from "@/types/Project";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EditableText } from "@/components/template/customEditable/EditableText";
import useFetch, { axiosFetch } from "@/hooks/useFetch";
import { timestampToReadable } from "@/utils/helper";
import { UpdateProjectSchema } from "@/validations/ProjectSchema";
import { validate } from "@/validations/validate";
import { DoubleArrowLeftIcon, Cross2Icon, PlusIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { HotToast, useHotToast } from "@/contexts/HotToastContext";
import EditableImage from "@/components/template/customEditable/EditableImage";
import EditableArrayImage from "@/components/template/customEditable/EditableArrayImage";

export default function ProjectDetailPage() {
	const { toast } = useHotToast();
	const { id } = useParams();
	const { data, refetch } = useFetch<Project>({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`
	});
	const project = data?.data;

	// Field Handlers
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
										length={project.technologies.length}
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

					<div className="flex flex-col gap-4">
						{/* Thumbnail */}
						<ThumbnailImage
							id={id as string}
							image_url={project?.image_thumbnail_url as string}
							toast={toast}
							refetch={refetch}
						/>

						{/* Previews */}
						<PreviewImages
							id={id as string}
							previews={project?.image_preview_urls || []}
							toast={toast}
							refetch={refetch}
						/>
					</div>
				</div>
			)}
		</main>
	);
}

/**
 * Sub Components
 */
interface TechTagsProps {
	value: string;
	index: number;
	handleUpdateTech: (newVal: string, index: number) => void;
	handleDeleteTech: (index: number) => void;
	length: number;
}
function TechTags({ value, index, handleUpdateTech, handleDeleteTech, length }: TechTagsProps) {
	return (
		<div className="ps-6 px-2 py-1 rounded-lg border border-neutral-400 flex items-center gap-2">
			<EditableText value={value} onUpdate={async (newVal) => handleUpdateTech(newVal, index)} />
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

interface LinkUrlProps {
	url: string;
	label: string;
	onUpdate: (newVal: string) => Promise<void>;
}
function LinkUrl({ url, label, onUpdate }: LinkUrlProps) {
	return (
		<div className="flex flex-wrap gap-x-3 items-center">
			<p className="w-full text-xs text-neutral-500">{label}</p>
			<EditableText
				value={url}
				onUpdate={onUpdate}
				className={`${url ? "text-sm" : "text-sm text-neutral-400"}`}
				placeholder="https://example.com"
			/>
			{url && (
				<a href={url} target="_blank" rel="noopener noreferrer">
					<ExternalLinkIcon className="size-4 text-blue-500" />
				</a>
			)}
		</div>
	);
}

interface ThumbnailImageProps {
	id: string;
	image_url: string;
	toast: HotToast;
	refetch: () => void;
}
function ThumbnailImage({ id, image_url, toast, refetch }: ThumbnailImageProps) {
	const handleUpdateThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files[0]) {
			const formData = new FormData();
			formData.append("thumbnail", files[0]);

			const { data, error } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
				data: formData,
				headers: { "Content-Type": "multipart/form-data" }
			});

			if (error) {
				toast.error(error.message);
			} else if (data) {
				toast.success(data.message);
				refetch();
			}
			e.target.value = "";
		}
	};

	return (
		<div>
			<p className="text-xs text-neutral-500">Thumbnail</p>

			<p className="text-xs text-neutral-700">Click image to expand, Click edit or Drag n Drop to update</p>

			<EditableImage
				src={image_url}
				onUpdate={handleUpdateThumbnail}
				onDropFiles={(files: FileList) => {
					if (files && files[0]) {
						handleUpdateThumbnail({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
					}
				}}
			/>
		</div>
	);
}

interface PreviewImagesProps {
	id: string;
	previews: string[];
	toast: HotToast;
	refetch: () => void;
}
function PreviewImages({ id, previews, toast, refetch }: PreviewImagesProps) {
	const uploadPreviews = async (files: File[], previewDetail?: object, onSuccess?: () => void) => {
		const formData = new FormData();
		files.forEach((file) => formData.append("previews", file));
		if (previewDetail) {
			formData.append("preview_detail", JSON.stringify(previewDetail));
		}
		const { data, error } = await axiosFetch({
			method: "PATCH",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
			data: formData,
			headers: { "Content-Type": "multipart/form-data" }
		});
		if (error) {
			toast.error(error.message);
		} else if (data) {
			toast.success(data.message);
			refetch();
			onSuccess?.();
		}
	};

	const handleFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
		previewDetail?: object,
		onSuccess?: () => void
	) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			await uploadPreviews(files, previewDetail, onSuccess);
			e.target.value = "";
		}
	};

	const handleParentUpdate = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e);

	const handleParentDrop = async (files: FileList) => {
		if (files.length > 0) {
			const fileArray = Array.from(files);
			await uploadPreviews(fileArray);
		}
	};

	const handleChildUpdate = (e: React.ChangeEvent<HTMLInputElement>, previewUrl: unknown) => {
		handleFileChange(e, { update: [previewUrl] });
	};

	const handleChildDrop = async (files: FileList, previewUrl: unknown) => {
		if (files.length > 0) {
			const fileArray = Array.from(files);
			await uploadPreviews(fileArray, { update: [previewUrl] });
		}
	};

	const handleChildDelete = async (previewUrl: unknown) => {
		const formData = new FormData();
		formData.append("preview_detail", JSON.stringify({ delete: [previewUrl] }));

		const { data, error } = await axiosFetch({
			method: "PATCH",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${id}`,
			data: formData,
			headers: { "Content-Type": "multipart/form-data" }
		});

		if (error) {
			toast.error(error.message);
		} else if (data) {
			toast.success(data.message);
			refetch();
		}
	};

	return (
		<div>
			<p className="text-xs text-neutral-500">Previews</p>

			<p className="text-xs text-neutral-700">
				Click image to expand, Click edit or Drag n Drop in image to update, Click delete to remove
			</p>

			<EditableArrayImage
				srcs={previews}
				onParentUpdate={handleParentUpdate}
				onParentDrop={handleParentDrop}
				onChildUpdate={handleChildUpdate}
				onChildDrop={handleChildDrop}
				onChildDelete={handleChildDelete}
			/>
		</div>
	);
}
