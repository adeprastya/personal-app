"use client";

import type { Project } from "@/types/Project";
import ProjectForm from "./ProjectForm";
import ProjectCard from "./ProjectCard";
import useFetch from "@/hooks/useFetch";
import { SuccessResponse } from "@/types/ApiResponse";

const sty = {
	container: "w-full min-h-dvh p-8 flex flex-col gap-8",

	h1: "font-semibold tracking-wide text-3xl",

	cardWrap: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
};

export default function ProjectPage() {
	const { data, loading, error, refetch } = useFetch<SuccessResponse<Project[]>>({
		method: "GET",
		url: process.env.NEXT_PUBLIC_BACKEND_URL + "/project"
	});

	return (
		<main className={sty.container}>
			<h1 className={sty.h1}>Project</h1>

			<ProjectForm refetch={refetch} />

			{loading && <p>Loading...</p>}

			{error && <p>{error.message}</p>}

			<div className={sty.cardWrap}>
				{Array.isArray(data?.data) &&
					data.data.map((p) => {
						return <ProjectCard key={p.id} project={p} refetch={refetch} />;
					})}
			</div>
		</main>
	);
}
