import { auth } from "@/config/nextAuth";
import { errorResponse } from "./utils/response";
import { NextResponse } from "next/server";

export default auth(async (req) => {
	console.log(`__middleware__ running on ${req.nextUrl.pathname} : ${req.method}\n`);

	const authenticated = await auth();
	if (!authenticated) {
		return errorResponse(401, "Unauthorized or Unauthenticated");
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/:path*", "/api/:path*"]
};
