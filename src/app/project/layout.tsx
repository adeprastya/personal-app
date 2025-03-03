import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Personal App | Project",
	description: "Ade Prastya's Personal App / Project"
};

export default function ProjectLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
