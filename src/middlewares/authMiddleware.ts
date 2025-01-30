import { NextRequest, NextResponse } from "next/server";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";
import { decodeToken } from "@/utils/token";

export const AuthMiddleware = async (req: NextRequest): Promise<NextResponse> => {
	try {
		const authorization: string | null = req.headers.get("authorization");

		if (!authorization) {
			throw new CustomErrorResponse(400, "Authorization header is missing");
		}

		if (!authorization.startsWith("Bearer ")) {
			throw new CustomErrorResponse(400, "Invalid authorization header format");
		}

		await decodeToken(authorization.split(" ")[1]);

		return NextResponse.next();
	} catch (err) {
		throw new CustomErrorResponse(401, "Unauthorized", err);
	}
};
