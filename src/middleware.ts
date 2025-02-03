import { auth } from "@/config/nextAuth";
import { errorResponse } from "./utils/response";
import { NextResponse } from "next/server";

const publicPage: string[] = ["/"];
const publicApi: Record<string, string[]> = {
	"/api": ["GET"],
	"/api/project": ["GET"]
};

const staticAssetsPattern =
	/^\/_next\/static\/|^\/_next\/image\/|^\/_next\/fonts\/|^\/favicon.ico|^\/robots.txt|^\/manifest.json/;

export default auth(async (req) => {
	// Static Assets
	if (staticAssetsPattern.test(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	// Public Page
	if (publicPage.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}

	// Public API
	const allowedMethods = publicApi[req.nextUrl.pathname];
	if (allowedMethods && allowedMethods.includes(req.method)) {
		return NextResponse.next();
	}

	if (!(await auth())) {
		return errorResponse(401, "Unauthorized or Unauthenticated");
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/:path*", "/api/:path*"]
};
