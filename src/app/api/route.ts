import { successResponse } from "@/lib/response";
import { timestampToReadable } from "@/utils/helper";

// PUBLIC API / Check Server Health
export const GET = async () =>
	successResponse(200, "Server is running", {
		date: timestampToReadable(new Date().toISOString(), {
			hour: "numeric",
			minute: "numeric",
			second: "numeric"
		})
	});
