import { createContext, useContext, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const protectedRoutes = ["/home", "/project"];

const isProtectedRoute = (currentRoute: string) => protectedRoutes.some((route) => currentRoute.includes(route));

type AuthData = string | null;

export type AuthContextType = {
	auth: AuthData;
	signIn: (authData: AuthData) => void;
	signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [auth, setAuth] = useLocalStorage<AuthData>("personal-app-auth", null);

	useEffect(() => {
		console.log("__useAuth__ useEffect Running...");

		if (!auth && isProtectedRoute(pathname)) {
			router.push("/");
		}

		if (auth && !isProtectedRoute(pathname)) {
			router.push("/home");
		}
	});

	const signIn = (authData: AuthData) => {
		setAuth(authData);
		router.push("/home");
	};

	const signOut = () => {
		setAuth(null);
		router.push("/");
	};

	return <AuthContext.Provider value={{ auth, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error("__useAuth__ useAuth must be used within an AuthContextProvider");
	}
	return context;
}
