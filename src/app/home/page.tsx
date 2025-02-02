import { auth } from "@/config/nextAuth";

export default async function Home() {
	const session = await auth();
	console.log("session", session);

	return <h1>Home</h1>;
}
