import { google } from "googleapis";

const GOAUTH_CLIENT_ID = process.env.GOAUTH_CLIENT_ID;
if (!GOAUTH_CLIENT_ID) {
	throw new Error("Environment variable GOAUTH_CLIENT_ID is not defined");
}
const GOAUTH_CLIENT_SECRET = process.env.GOAUTH_CLIENT_SECRET;
if (!GOAUTH_CLIENT_SECRET) {
	throw new Error("Environment variable GOAUTH_CLIENT_SECRET is not defined");
}
const GOAUTH_REDIRECT_CALLBACK_URL = process.env.GOAUTH_REDIRECT_CALLBACK_URL;
if (!GOAUTH_REDIRECT_CALLBACK_URL) {
	throw new Error("Environment variable GOAUTH_REDIRECT_CALLBACK_URL is not defined");
}

export const oAuth2Client = new google.auth.OAuth2(
	GOAUTH_CLIENT_ID,
	GOAUTH_CLIENT_SECRET,
	GOAUTH_REDIRECT_CALLBACK_URL
);

const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

export const oAuthUrl = oAuth2Client.generateAuthUrl({
	access_type: "offline",
	scope: scopes,
	include_granted_scopes: true
});
