import { successResponse } from "@/utils/response";

export const GET = async () => successResponse(200, "Server is running", { timestamp: new Date().toISOString() });
