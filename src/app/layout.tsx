import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Personal App",
	description: "Ade Prastya's Personal App"
};

export default function RootLayout({
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
