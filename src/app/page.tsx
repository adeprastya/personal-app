import { signIn } from "@/config/nextAuth";

const sty = {
	container: "w-full min-h-dvh p-8 flex flex-col justify-center items-center gap-8",
	title: "font-semibold tracking-wide text-3xl",
	desc: "font-semibold tracking-wide text-2xl",
	button:
		"cursor-pointer w-fit h-8 px-5 rounded-sm tracking-wider text-white bg-neutral-900 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-2 focus:outline-neutral-900 transition-all"
};

export default async function LandingPage() {
	return (
		<main className={sty.container}>
			<h1 className="text-5xl font-semibold">Personal Dashboard</h1>
			<p className="text-2xl">This is just a private dashboard to manage my personal data</p>

			<form
				action={async () => {
					"use server";
					await signIn("google", { redirectTo: "/project" });
				}}
			>
				<button type="submit" className={sty.button}>
					Signin with Google
				</button>
			</form>
		</main>
	);
}
