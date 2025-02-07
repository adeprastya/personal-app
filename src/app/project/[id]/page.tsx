"use client";

import type { Project } from "@/types/Project";
import { useParams } from "next/navigation";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";

export default function ProjectDetailPage() {
	const { id } = useParams();
	const { data, loading, error, refetch } = useFetch<Project>({
		method: "GET",
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`
	});

	return (
		<main className="w-full min-h-dvh p-8 flex flex-col gap-8">
			<Image src={data?.data?.image_url || ""} alt={data?.data?.title || ""} width={800} height={300} />

			<h1 className="text-2xl">{data?.data?.title}</h1>

			<p>{data?.data?.description}</p>

			<div>
				{data?.data?.technologies.map((tech, i) => (
					<span key={i}>{tech}, </span>
				))}
			</div>

			<p>{data?.data?.site_url}</p>

			<p>{data?.data?.source_code_url}</p>

			<p>{data?.data?.demo_url}</p>

			<p>{data?.data?.created_at}</p>

			<p>{data?.data?.id}</p>
		</main>
	);
}
