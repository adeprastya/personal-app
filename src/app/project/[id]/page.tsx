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

	const handleFocusTech = (e: React.FocusEvent<HTMLElement>) => {
		e.currentTarget.dataset.oldValue = e.currentTarget.textContent?.trim() ?? "";
	};

	const handleUpdateTech = async (e: React.FocusEvent<HTMLElement>, i: number) => {
		const target = e.currentTarget;
		const newValue = target.textContent?.trim() ?? "";
		const oldValue = target.dataset.oldValue;

		if (newValue === oldValue) return;

		const newTechs = [...(project?.technologies ?? [])];
		newTechs[i] = newValue;

		try {
			validate(UpdateProjectSchema, { technologies: [newValue] });

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
				data: { technologies: newTechs }
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

		try {
			validate(UpdateProjectSchema, { technologies: newTechs });

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
				data: { technologies: newTechs }
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

		try {
			validate(UpdateProjectSchema, { technologies: newTechs });

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
				data: { technologies: newTechs }
			});

			console.log("Update success:", data);

			refetch();
		} catch (err) {
			console.error(err);
		}
	};

	const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
		e.currentTarget.dataset.oldValue = e.currentTarget.textContent?.trim() ?? "";
	};

	const handleUpdate = async (e: React.FocusEvent<HTMLElement>, field: string) => {
		const target = e.currentTarget;
		const newValue = target.textContent?.trim() ?? "";
		const oldValue = target.dataset.oldValue || newValue;

		if (newValue === oldValue) return;

		try {
			validate(UpdateProjectSchema, { [field]: newValue });

			const { data } = await axiosFetch({
				method: "PATCH",
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`,
				data: { [field]: newValue }
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

						{/* Technologies */}
						<div className="flex items-center gap-2 text-xs tracking-wider">
							<div className="flex flex-row flex-wrap gap-3">
								{project?.technologies.map((tech, i) => (
									<div key={i} className="px-2 py-0.5 rounded-md bg-neutral-200 flex items-center gap-2">
										<p
											contentEditable
											suppressContentEditableWarning
											spellCheck={false}
											onFocus={handleFocusTech}
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
					<div className="flex items-center gap-2">
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
										className="text-sm text-neutral-400 cursor-pointer"
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

					{/* Image */}
					<Image
						src={project?.image_url || ""}
						alt={project?.title || ""}
						width={800}
						height={300}
						className="w-xl aspect-video object-cover rounded-sm"
					/>
				</div>
			)}
		</main>
	);
}
