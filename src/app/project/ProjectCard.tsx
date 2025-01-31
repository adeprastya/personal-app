import type { Project } from "@/types/Project";
import Image from "next/image";

const sty = {
	container: "aspect-[5/2] p-4 border border-neutral-200 rounded-2xl shadow-sm flex flex-col gap-6",

	image: "aspect-video object-cover border border-neutral-200 rounded-lg",

	detailsWrap: "flex flex-col gap-3",
	title: "font-semibold text-xl text-gray-800",
	desc: "truncate text-sm text-gray-600",

	techWrap: "flex flex-wrap gap-2",
	tech: "px-2 rounded-sm bg-neutral-200 text-sm text-gray-700",

	linkWrap: "flex flex-wrap gap-4",
	link: "text-sky-600 hover:underline"
};

export default function ProjectCard({ project }: { project: Project }) {
	return (
		<div className={sty.container}>
			{/* Image */}
			<a target="_blank" href={project.image_url} title={project.image_url} className="block">
				<Image src={project.image_url} alt={project.title} width={500} height={300} className={sty.image} />
			</a>

			{/* Details */}
			<div className={sty.detailsWrap}>
				{/* Title */}
				<h3 className={sty.title}>{project.title}</h3>

				{/* Description */}
				<p className={sty.desc}>{project.description}</p>

				{/* Technologies */}
				<div className={sty.techWrap}>
					<span className={sty.desc}>Tech:</span>

					{project.technologies.map((tech, i) => (
						<span key={i} className={sty.tech}>
							{tech}
						</span>
					))}
				</div>

				{/* Links */}
				<div className={sty.linkWrap}>
					{project.site_url && (
						<a target="_blank" href={project.site_url} title={project.site_url} className={sty.link}>
							Live Site
						</a>
					)}

					{project.source_code_url && (
						<a target="_blank" href={project.source_code_url} title={project.source_code_url} className={sty.link}>
							Source Code
						</a>
					)}

					{project.demo_url && (
						<a target="_blank" href={project.demo_url} title={project.demo_url} className={sty.link}>
							Demo
						</a>
					)}
				</div>
			</div>
		</div>
	);
}
