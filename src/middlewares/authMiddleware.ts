import { NextRequest, NextResponse } from "next/server";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";
import { decodeToken } from "@/utils/token";

const authMiddleware = async (req: NextRequest) => {
	try {
		const authorization = req.headers.get("authorization");

		if (!authorization) {
			throw new CustomErrorResponse(400, "Authorization header is missing");
		}

		if (!authorization.startsWith("Bearer ")) {
			throw new CustomErrorResponse(400, "Invalid authorization header format");
		}

		await decodeToken(authorization.split(" ")[1]);

		return NextResponse.next();
	} catch (err) {
		return NextResponse.next(err as NextResponse);
	}
};

export default authMiddleware;
