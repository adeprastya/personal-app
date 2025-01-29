import { NextResponse } from "next/server";

export const errorResponse = (statusCode: number, message: string): NextResponse => {
	return NextResponse.json(
		{
			success: false,
			message
		},
		{ status: statusCode }
	);
};

export const successResponse = <T>(statusCode: number, message: string, data: T | null = null): NextResponse => {
	if (data === null) {
		return NextResponse.json({ success: true, message }, { status: statusCode });
	}

	return NextResponse.json(
		{
			success: true,
			message,
			data
		},
		{ status: statusCode }
	);
};
