import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "@/middlewares/AuthMiddleware";
import { errorResponse } from "@/utils/response";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";

const protectedRoutes: { [key: string]: string[] } = {
	"/api/project": ["POST", "PATCH", "DELETE"]
};

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const method = req.method;

	for (const route in protectedRoutes) {
		if (pathname.startsWith(route)) {
			const protectedMethods = protectedRoutes[route];

			if (protectedMethods.includes(method)) {
				try {
					return await AuthMiddleware(req);
				} catch (err) {
					return errorResponse(
						(err as CustomErrorResponse).statusCode || 500,
						(err as CustomErrorResponse).message || "Internal server error"
					);
				}
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/api/:path*"]
};
