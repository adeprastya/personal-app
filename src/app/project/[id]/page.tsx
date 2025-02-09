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
	const { data, loading, error, refetch } = useFetch<Project>({
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
			{!loading && !error && (
				<div className="p-8 flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<p className="text-xs tracking-wide">{timestampToReadable(project?.created_at as string)}</p>

						{/* Title */}
						<h1
							contentEditable
							suppressContentEditableWarning
							spellCheck={false}
							onFocus={handleFocus}
							onBlur={(e) => handleUpdate(e, "title")}
							title={project?.id}
							className="font-semibold text-4xl"
						>
							{project?.title}
						</h1>

						<div className="flex flex-row flex-wrap gap-3">
							{project?.technologies.map((tech, i) => (
								<p key={i} className="px-2 py-0.5 rounded-md bg-neutral-200 tracking-wider text-xs">
									{tech}
								</p>
							))}
						</div>
					</div>

					<p
						contentEditable
						suppressContentEditableWarning
						spellCheck={false}
						onFocus={handleFocus}
						onBlur={(e) => handleUpdate(e, "description")}
						className="block max-w-3xl text-base"
					>
						{project?.description}
					</p>

					<div className="flex flex-col gap-2">
						{project?.site_url && (
							<div className="flex gap-2 items-center">
								<p className="text-xs">Site: </p>
								<p
									contentEditable
									suppressContentEditableWarning
									spellCheck={false}
									onFocus={handleFocus}
									onBlur={(e) => handleUpdate(e, "site_url")}
									className="text-sm"
								>
									{project.site_url}
								</p>
								<a
									href={project.site_url}
									target="_blank"
									className="text-xs text-blue-500 underline underline-offset-2"
								>
									Visit
								</a>
							</div>
						)}

						{project?.source_code_url && (
							<div className="flex gap-2 items-center">
								<p className="text-xs">Source Code: </p>
								<p
									contentEditable
									suppressContentEditableWarning
									spellCheck={false}
									onFocus={handleFocus}
									onBlur={(e) => handleUpdate(e, "source_code_url")}
									className="text-sm"
								>
									{project.source_code_url}
								</p>
								<a
									href={project.source_code_url || ""}
									target="_blank"
									className="text-xs text-blue-500 underline underline-offset-2"
								>
									Visit
								</a>
							</div>
						)}

						{project?.demo_url && (
							<div className="flex gap-2 items-center">
								<p className="text-xs">Demo: </p>
								<p
									contentEditable
									suppressContentEditableWarning
									spellCheck={false}
									onFocus={handleFocus}
									onBlur={(e) => handleUpdate(e, "demo_url")}
									className="text-sm"
								>
									{project.demo_url}
								</p>
								<a
									href={project.demo_url || ""}
									target="_blank"
									className="text-xs text-blue-500 underline underline-offset-2"
								>
									Visit
								</a>
							</div>
						)}
					</div>

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
