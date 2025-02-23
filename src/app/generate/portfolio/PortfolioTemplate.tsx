"use client";

import type { Project } from "@/types/Project";
import Image from "next/image";

interface PortfolioTemplateProps {
	projects: Project[];
}

export default function PortfolioTemplate({ projects }: PortfolioTemplateProps) {
	return (
		<div className="relative">
			<main className="w-full min-h-dvh bg-neutral-50 text-neutral-900">
				{/* Intro */}
				<div className="w-full aspect-[297/209] px-20 flex flex-col justify-center">
					<h1 className="font-bold tracking-tighter text-[15rem] text-neutral-700 italic underline">PORTFOLIO</h1>

					<h2 className="font-bold leading-loose text-5xl text-neutral-700 italic">By Ade Fathoni Prastya</h2>

					<p className="font-semibold tracking-wide text-sm text-neutral-600">* Generated from my personal dashboard</p>
				</div>

				{/* Projects */}
				<div className="flex flex-col">
					{projects.map((project, i) => (
						<article key={i} className="w-full aspect-[297/209] box-border px-10 grid grid-cols-12 gap-y-10 gap-x-4">
							<div className="mt-8 col-span-4 flex flex-col justify-between">
								<div className="flex flex-col gap-2">
									<h2 className="font-bold text-3xl text-neutral-700 uppercase">{project.title}</h2>

									<p className="font-semibold tracking-wide text-sm text-neutral-600 italic">{project.tagline}</p>
								</div>

								<ul className="flex flex-wrap gap-2">
									{project.technologies.map((tech) => (
										<li
											key={tech}
											className="px-3 py-1 rounded-lg bg-neutral-700 text-xs text-neutral-200 tracking-widest"
										>
											{tech}
										</li>
									))}
								</ul>
							</div>

							<div className="col-span-1" />

							<div className="mt-8 col-span-4">
								<p className="font-semibold text-xs text-neutral-500 text-justify italic">{project.description}</p>
							</div>

							<div className="col-span-1" />

							<div className="mt-8 col-span-2 flex flex-col gap-2 justify-start">
								{project.site_url && (
									<a
										href={project.site_url}
										target="_blank"
										rel="noopener noreferrer"
										className="font-semibold text-base text-neutral-700 italic underline underline-offset-2"
									>
										Visit Site
									</a>
								)}
								{project.source_code_url && (
									<a
										href={project.source_code_url}
										target="_blank"
										rel="noopener noreferrer"
										className="font-semibold text-base text-neutral-700 italic underline underline-offset-2"
									>
										Source Code
									</a>
								)}
								{project.demo_url && (
									<a
										href={project.demo_url}
										target="_blank"
										rel="noopener noreferrer"
										className="font-semibold text-base text-neutral-700 italic underline underline-offset-2"
									>
										Demo Video
									</a>
								)}
							</div>

							<div className="col-span-full grid grid-cols-10 grid-rows-4 gap-2">
								<Image
									src={project.image_thumbnail_url}
									alt={project.title}
									width={1000}
									height={500}
									unoptimized
									className="col-span-6 row-span-3 size-full aspect-[16/10] object-cover rounded-sm border border-neutral-300 box-border"
								/>
								{project.image_preview_urls.slice(0, 6).map((url, i) => (
									<Image
										key={i}
										src={url}
										alt={project.title}
										width={200}
										height={100}
										unoptimized
										className="col-span-2 size-full aspect-[16/10] object-cover object-center rounded-sm border border-neutral-300 box-border"
									/>
								))}
								<div className="col-span-full grid grid-cols-10" style={{ direction: "rtl" }}>
									{project.image_preview_urls.slice(6)?.map((url, i) => (
										<Image
											key={i}
											src={url}
											alt={project.title}
											width={200}
											height={100}
											unoptimized
											className="col-span-2 size-full aspect-[16/10] object-cover object-center rounded-sm border border-neutral-300 box-border"
										/>
									))}
								</div>
							</div>
						</article>
					))}
				</div>
			</main>
		</div>
	);
}
