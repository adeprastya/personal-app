import "@/styles/globals.css";
import type { Metadata } from "next";
import ContextProvider from "@/contexts/ContextProvider";

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
			<body>
				<ContextProvider>{children}</ContextProvider>
			</body>
		</html>
	);
}
