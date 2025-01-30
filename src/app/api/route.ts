import { successResponse } from "@/utils/response";
import { timestampToReadable } from "@/utils/helper";

export const GET = async () =>
	successResponse(200, "Server is running", {
		date: timestampToReadable(new Date().toISOString(), {
			hour: "numeric",
			minute: "numeric",
			second: "numeric"
		})
	});
