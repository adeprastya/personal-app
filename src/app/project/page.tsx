"use client";

import type { MinimalProject } from "@/types/Project";
import ProjectForm from "./ProjectForm";
import ProjectTable from "./ProjectTable";
import useFetch from "@/hooks/useFetch";

export default function ProjectPage() {
	const { data, loading, error, refetch } = useFetch<MinimalProject[]>({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project`
	});

	return (
		<main className="w-full min-h-dvh bg-neutral-100 text-neutral-800 p-8 flex flex-col gap-8">
			<h1 className="text-2xl">Project</h1>

			<ProjectForm refetch={refetch} />

			<ProjectTable projects={data?.data} loading={loading} error={error} refetch={refetch} />
		</main>
	);
}
