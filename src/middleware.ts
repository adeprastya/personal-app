import { NextResponse } from "next/server";
import { auth } from "@/config/nextAuth";
import { errorResponse, successResponse } from "@/lib/response";

/**
 * Include all APIs and Pages
 * Exclude: /api/auth, /_next/static, /_next/image, /favicon.ico, /robots.txt, /manifest.json
 */
export const config = {
	matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)"]
};

/**
 * Bypassed Endpoint
 * Dynamic Path / Slug must be wrapped in square brackets !!
 */
const internalApi: Record<string, string[]> = {
	"/api/user": ["POST"]
};
const publicApi: Record<string, string[]> = {
	"/api": ["GET"],
	"/api/project": ["GET"],
	"/api/project/[project-id]": ["GET"]
};
const publicPage: string[] = ["/", "/generate/portfolio"];

/**
 * Helper
 */
const getRegexPattern = (() => {
	const regexCache: Record<string, RegExp> = {};

	return (pattern: string): RegExp => {
		if (regexCache[pattern]) return regexCache[pattern];

		const regex = new RegExp(`^${pattern.replace(/\[.*?\]/g, "([^/]+)")}$`);
		regexCache[pattern] = regex;
		return regex;
	};
})();

const testDynamicPath = (pattern: string, reqPath: string): boolean => {
	const regex = getRegexPattern(pattern);
	return regex.test(reqPath);
};

const matchDynamicRoute = (routePatterns: Record<string, string[]>, reqPath: string): string[] | null => {
	for (const [pattern, methods] of Object.entries(routePatterns)) {
		if (testDynamicPath(pattern, reqPath)) return methods;
	}
	return null;
};

/**
 * Custom Middleware
 * Next.js Middleware + Next Auth
 */
export default auth(async (req) => {
	const {
		nextUrl: { pathname },
		method,
		auth
	} = req;

	if (method === "OPTIONS") {
		return successResponse(200, "OK");
	}

	// Public Page
	const isPublicPage = publicPage.some((pattern) => testDynamicPath(pattern, pathname));
	if (isPublicPage) {
		return NextResponse.next();
	}

	// Public API
	const publicApiMethods = publicApi[pathname] || matchDynamicRoute(publicApi, pathname);
	if (publicApiMethods && publicApiMethods.includes(method)) {
		return NextResponse.next();
	}

	// Internal API
	const internalApiMethods = internalApi[pathname] || matchDynamicRoute(internalApi, pathname);
	if (internalApiMethods && internalApiMethods.includes(method)) {
		return NextResponse.next();
	}

	// Protected Route
	if (auth) {
		return NextResponse.next();
	}

	return errorResponse(401, "Unauthorized or Unauthenticated");
});
