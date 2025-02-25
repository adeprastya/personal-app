import { errorResponse } from "@/lib/response";
import { CustomErrorResponse } from "@/lib/CustomErrorResponse";
import { NextRequest, NextResponse } from "next/server";

export function ErrorHandler<P>(handler: (req: NextRequest, params: P) => Promise<NextResponse>) {
	return async (req: NextRequest, params: P) => {
		try {
			return await handler(req, params);
		} catch (err) {
			console.error("__ERROR__ :", err);

			if (err instanceof CustomErrorResponse) {
				return errorResponse(err.statusCode, err.message);
			}

			return errorResponse(500, "Internal server error");
		}
	};
}
