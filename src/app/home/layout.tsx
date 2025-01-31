import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Personal App | Home",
	description: "Ade Prastya's Personal App"
};

export default function HomeLayout({
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
