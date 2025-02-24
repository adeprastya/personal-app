import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],

	callbacks: {
		async signIn({ user }) {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
				method: "POST",
				headers: {
					"x-internal-secret": `${process.env.AUTH_SECRET}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ email: user.email })
			});

			if (response.ok) {
				return true;
			}

			return false;
		}
	},
	trustHost: true
});
