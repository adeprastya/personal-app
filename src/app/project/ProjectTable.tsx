import type { MinimalProject } from "@/types/Project";
import type { ErrorResponse } from "@/types/ApiResponse";
import Image from "next/image";
import Link from "next/link";
import { axiosFetch } from "@/hooks/useFetch";
import { TrashIcon } from "@radix-ui/react-icons";

export default function ProjectTable({
	projects,
	loading,
	error,
	refetch
}: {
	projects: Array<MinimalProject> | undefined;
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
						<td className="px-4 py-2">Tagline</td>
						<td className="px-4 py-2">Created</td>
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

function ProjectRow({ project, refetch }: { project: MinimalProject; refetch: () => void }) {
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
		<tr className="hover:bg-neutral-200">
			{/* Image */}
			<td className="px-4 py-2">
				<Image
					src={project.image_thumbnail_url}
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

			{/* Tagline */}
			<td className="px-4 py-2">{project.tagline}</td>

			{/* Created */}
			<td className="px-4 py-2 text-sm">{project.created_at}</td>

			{/* Action */}
			<td className="px-4 py-2">
				{/* Delete */}
				<button
					type="button"
					onClick={handleDelete}
					className="p-2 rounded-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-neutral-50 cursor-pointer transition-colors"
				>
					<TrashIcon className="size-4" />
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

			{/* Action */}
			<td className="px-4 py-2">
				<div className="w-10 h-5 rounded-lg bg-neutral-300 animate-pulse" />
			</td>
		</tr>
	);
}
