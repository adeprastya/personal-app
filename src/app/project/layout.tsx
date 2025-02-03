import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Personal App | Project",
	description: "Ade Prastya's Personal App"
};

export default function ProjectLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
