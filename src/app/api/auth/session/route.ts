import { successResponse, errorResponse } from "@/utils/response";
import { auth } from "@/config/nextAuth";

export const GET = async () => {
	const session = await auth();

	if (!session) {
		return errorResponse(401, "Session not found");
	}

	return successResponse(200, "Session found");
};
