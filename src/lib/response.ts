import { NextResponse } from "next/server";

const setCorsHeader = (res: NextResponse): NextResponse => {
	res.headers.set("Access-Control-Allow-Origin", "*");
	res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
	res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
	return res;
};

export const errorResponse = (statusCode: number, message: string): NextResponse => {
	return setCorsHeader(NextResponse.json({ success: false, message }, { status: statusCode }));
};

export const successResponse = <T>(statusCode: number, message: string, data: T | null = null): NextResponse => {
	if (data === null) {
		return setCorsHeader(NextResponse.json({ success: true, message }, { status: statusCode }));
	}

	return setCorsHeader(
		NextResponse.json(
			{
				success: true,
				message,
				data
			},
			{ status: statusCode }
		)
	);
};
