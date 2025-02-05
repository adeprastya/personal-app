"use client";

import type { Project } from "@/types/Project";
import ProjectForm from "./ProjectForm";
import ProjectTable from "./ProjectTable";
import useFetch from "@/hooks/useFetch";

export default function ProjectPage() {
	const { data, loading, error, refetch } = useFetch<Project[]>({
		method: "GET",
		url: process.env.NEXT_PUBLIC_BACKEND_URL + "/project"
	});

	return (
		<main className="w-full min-h-dvh p-8 flex flex-col gap-8">
			<h1 className="text-2xl">Project</h1>

			<ProjectForm refetch={refetch} />

			<ProjectTable projects={data?.data} loading={loading} error={error} refetch={refetch} />
		</main>
	);
}
