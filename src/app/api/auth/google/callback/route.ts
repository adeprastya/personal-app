import type { User } from "@/types/User";
import { NextRequest, NextResponse } from "next/server";
import { oAuth2Client } from "@/config/GOAuth";
import { google } from "googleapis";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";
import UserCollection from "@/models/User";
import { generateToken } from "@/utils/token";

const GOAUTH_REDIRECT_FE_URL = process.env.GOAUTH_REDIRECT_FE_URL;
if (!GOAUTH_REDIRECT_FE_URL) {
	throw new Error("Environment variable GOAUTH_REDIRECT_FE_URL is not defined");
}

export const GET = async (req: NextRequest) => {
	try {
		const code = req.nextUrl.searchParams.get("code");

		const { tokens } = await oAuth2Client.getToken(code as string);

		oAuth2Client.setCredentials(tokens);

		const oauth2 = google.oauth2({
			version: "v2",
			auth: oAuth2Client
		});

		const { data } = await oauth2.userinfo.get();

		const user = await UserCollection.findByField("email", "==", data.email).then((user: User | null) => {
			if (!user) {
				throw new CustomErrorResponse(400, "Email not registered");
			}
			return user;
		});

		const token = await generateToken(user);

		return NextResponse.redirect(GOAUTH_REDIRECT_FE_URL + `?success=true&message=Login successful&token=${token}`, 302);
	} catch (err) {
		return NextResponse.redirect(
			GOAUTH_REDIRECT_FE_URL + `?success=false&message=${(err as CustomErrorResponse).message}`,
			302
		);
	}
};
