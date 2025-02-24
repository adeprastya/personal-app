"use server";

import type { MinimalProject, Project } from "@/types/Project";
import PortfolioTemplate from "./PortfolioTemplate";

export default async function PortfolioPage() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project`, { method: "GET" });
	const minProjects = await res.json();

	const projects: Project[] = await Promise.all(
		minProjects.data.map(async (project: MinimalProject) => {
			const res2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${project.id}`, {
				method: "GET"
			});
			const fullProject = await res2.json();
			return fullProject.data;
		})
	);

	return <PortfolioTemplate projects={projects} />;
}
