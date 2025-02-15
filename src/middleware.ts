import { auth } from "@/config/nextAuth";
import { errorResponse } from "./utils/response";
import { NextResponse } from "next/server";

const internalApi: Record<string, string[]> = {
	"/api/user": ["POST"]
};
const publicApi: Record<string, string[]> = {
	"/api": ["GET"],
	"/api/project": ["GET"]
};
const publicPage: string[] = ["/"];
const staticAssetsPattern =
	/^\/_next\/static\/|^\/_next\/image\/|^\/_next\/fonts\/|^\/favicon.ico|^\/robots.txt|^\/manifest.json/;

export default auth(async (req) => {
	const pathname = req.nextUrl.pathname;
	const method = req.method;

	// Static Assets
	if (staticAssetsPattern.test(pathname)) {
		return NextResponse.next();
	}

	// Public Page
	if (publicPage.includes(pathname)) {
		return NextResponse.next();
	}

	// Public API
	const publicApiMethods = publicApi[pathname];
	if (publicApiMethods && publicApiMethods.includes(method)) {
		const response = NextResponse.next();

		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", method);
		response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

		return response;
	}

	// Internal API
	const internalApiMethods = internalApi[pathname];
	if (internalApiMethods && internalApiMethods.includes(method)) {
		return NextResponse.next();
	}

	// next-auth
	if (pathname.startsWith("/api/auth")) {
		return NextResponse.next();
	}

	const isAuth = await auth();
	if (!isAuth) {
		return errorResponse(401, "Unauthorized or Unauthenticated");
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/:path*", "/api/:path*"]
};
