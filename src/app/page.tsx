import { signIn } from "@/config/nextAuth";

export default async function LandingPage() {
	return (
		<main className="w-full min-h-dvh bg-neutral-100 text-neutral-900 p-8 flex flex-col justify-center items-center gap-8">
			<h1 className="text-5xl font-semibold">Personal Dashboard</h1>
			<p className="text-2xl">This is just a private dashboard to manage my personal data</p>

			<form
				action={async () => {
					"use server";
					await signIn("google", { redirectTo: "/project" });
				}}
			>
				<button
					type="submit"
					className="cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-neutral-100 bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-2 focus:outline-neutral-900 transition-all"
				>
					Signin with Google
				</button>
			</form>
		</main>
	);
}
