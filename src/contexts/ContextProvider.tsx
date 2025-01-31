"use client";

import { AuthContextProvider } from "./useAuth";

export default function ContextProvider({ children }: { children: React.ReactNode }) {
	return <AuthContextProvider>{children}</AuthContextProvider>;
}
