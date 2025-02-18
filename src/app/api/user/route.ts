import { successResponse, errorResponse } from "@/utils/response";
import UserCollection from "@/models/User";
import { NextRequest } from "next/server";

// INTERNAL API / Check User Registration
export const POST = async (req: NextRequest) => {
	const secret = req.headers.get("x-internal-secret");
	if (!secret || secret !== process.env.AUTH_SECRET) {
		return errorResponse(401, "Unauthorized");
	}

	const { email } = await req.json();
	if (!email) {
		return errorResponse(400, "Email is required");
	}

	const registeredUser = await UserCollection.findByField("email", "==", email);

	if (!registeredUser) {
		return errorResponse(404, "User not found");
	}

	return successResponse(200, "User found", registeredUser);
};
