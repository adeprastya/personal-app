"use client";

import type { MinimalProject, Project } from "@/types/Project";
import PortfolioTemplate from "./PortfolioTemplate";
import { useState, useEffect } from "react";
import { axiosFetch } from "@/hooks/useFetch";

export default function PortfolioPage() {
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		const fetchProjects = async () => {
			const { data: minProject, error } = await axiosFetch<Array<MinimalProject>>({
				method: "GET",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project`
			});

			if (error) throw new Error(error.message);
			if (!minProject?.data) throw new Error("Failed to fetch projects");

			const projects = await Promise.all(
				minProject.data.map(async (project) => {
					const { data, error } = await axiosFetch<Project>({
						method: "GET",
						url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/project/${project.id}`
					});

					if (error) throw new Error(error.message);
					if (!data?.data) throw new Error("Failed to fetch detailed project");

					return data.data;
				})
			);

			setProjects(projects);
		};

		fetchProjects();
	}, []);

	return <PortfolioTemplate projects={projects} />;
}
