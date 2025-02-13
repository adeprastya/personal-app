import type { Project } from "@/types/Project";
import { ErrorResponse } from "@/types/ApiResponse";
import Image from "next/image";
import Link from "next/link";
import { axiosFetch } from "@/hooks/useFetch";

export default function ProjectTable({
	projects,
	loading,
	error,
	refetch
}: {
	projects: Array<Project> | undefined;
	loading: boolean;
	error: ErrorResponse | null;
	refetch: () => void;
}) {
	return (
		<div className="overflow-x-auto border border-neutral-600 rounded-sm">
			<table className="min-w-full">
				<thead className="border-b border-neutral-600 tracking-wider font-semibold text-left text-sm">
					<tr>
						<td className="px-4 py-2">Image</td>
						<td className="px-4 py-2">Title</td>
						<td className="px-4 py-2">Created</td>
						<td className="px-4 py-2">URL</td>
						<td className="px-4 py-2">Actions</td>
					</tr>
				</thead>

				<tbody className="divide-y divide-neutral-400">
					{loading && <ProjectSkeleton />}

					{error && (
						<tr>
							<td colSpan={5} className="px-8 py-4 text-center text-lg text-neutral-600">
								Error, {error.message}
							</td>
						</tr>
					)}

					{Array.isArray(projects) &&
						projects.map((p) => {
							return <ProjectRow key={p.id} project={p} refetch={refetch} />;
						})}
				</tbody>
			</table>
		</div>
	);
}

function ProjectRow({ project, refetch }: { project: Project; refetch: () => void }) {
	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this project?")) {
			const { data, error } = await axiosFetch({
				method: "DELETE",
				url: process.env.NEXT_PUBLIC_BACKEND_URL + `/project/${project.id}`
			});

			if (error) {
				console.error(error);
				return;
			}

			if (data) {
				refetch();
			}
		}
	};

	return (
		<tr className="hover:bg-neutral-100">
			{/* Image */}
			<td className="px-4 py-2">
				<Image
					src={project.image_url}
					alt={project.title}
					width={160}
					height={90}
					unoptimized
					className="w-30 border border-neutral-500 aspect-video object-cover object-center"
				/>
			</td>

			{/* Title */}
			<td className="px-4 py-2">
				<Link
					href={`/project/${project.id}`}
					className="tracking-wide font-normal text-base underline underline-offset-2"
				>
					{project.title}
				</Link>
			</td>

			{/* Created */}
			<td className="px-4 py-2 text-sm">{project.created_at}</td>

			{/* URL */}
			<td className="px-4 py-2">
				{/* Site URL */}
				{project.site_url && (
					<a
						target="_blank"
						href={project.site_url}
						title={project.site_url}
						className="me-3 underline underline-offset-2 text-sm text-blue-500"
					>
						Live Site
					</a>
				)}

				{/* Source Code URL */}
				{project.source_code_url && (
					<a
						target="_blank"
						href={project.source_code_url}
						title={project.source_code_url}
						className="me-3 underline underline-offset-2 text-sm text-blue-500"
					>
						Source Code
					</a>
				)}

				{/* Demo URL */}
				{project.demo_url && (
					<a
						target="_blank"
						href={project.demo_url}
						title={project.demo_url}
						className="me-3 underline underline-offset-2 text-sm text-blue-500"
					>
						Demo
					</a>
				)}
			</td>

			{/* Action */}
			<td className="px-4 py-2">
				{/* Delete */}
				<button
					type="button"
					onClick={handleDelete}
					className="px-2 py-0.5 rounded-xs bg-red-500 tracking-wider text-xs text-white cursor-pointer"
				>
					Delete
				</button>
			</td>
		</tr>
	);
}

function ProjectSkeleton() {
	return (
		<tr>
			{/* Image */}
			<td className="px-4 py-2">
				<div className="w-30 aspect-video rounded-lg bg-neutral-300 animate-pulse" />
			</td>

			{/* Title */}
			<td className="px-4 py-2">
				<div className="w-30 h-5 rounded-lg bg-neutral-300 animate-pulse" />
			</td>

			{/* Created */}
			<td className="px-4 py-2">
				<div className="w-30 h-5 rounded-lg bg-neutral-300 animate-pulse" />
			</td>

			{/* URL */}
			<td className="px-4 py-2">
				<div className="w-50 h-5 rounded-lg bg-neutral-300 animate-pulse" />
			</td>

			{/* Action */}
			<td className="px-4 py-2">
				<div className="w-10 h-5 rounded-lg bg-neutral-300 animate-pulse" />
			</td>
		</tr>
	);
}
