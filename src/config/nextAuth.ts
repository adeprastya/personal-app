import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import UserCollection from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],

	callbacks: {
		async signIn({ user }) {
			const registeredUser = await UserCollection.findByField("email", "==", user.email);

			if (!registeredUser) {
				return false;
			}

			return true;
		}
	}
});
