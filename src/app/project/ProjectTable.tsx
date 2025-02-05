import type { Project } from "@/types/Project";
import Image from "next/image";
import { axiosFetch } from "@/hooks/useFetch";
import Link from "next/link";

export default function ProjectTable({
	projects,
	refetch
}: {
	projects: Array<Project> | undefined;
	refetch: () => void;
}) {
	return (
		<div className="overflow-x-auto border border-neutral-400 rounded-sm">
			<table className="min-w-full">
				<thead className="border-b border-neutral-400 tracking-wider font-semibold text-left text-sm">
					<tr>
						<td className="px-4 py-2">Image</td>
						<td className="px-4 py-2">Title</td>
						<td className="px-4 py-2">Created</td>
						<td className="px-4 py-2">URL</td>
						<td className="px-4 py-2">Actions</td>
					</tr>
				</thead>

				<tbody className="divide-y divide-neutral-400">
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
					className="w-30 border border-neutral-500 aspect-video object-cover object-center"
				/>
			</td>

			{/* Title */}
			<td className="px-4 py-2">
				<Link
					href={`/project/${project.id}`}
					className="tracking-wide font-semibold text-base underline underline-offset-2"
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
