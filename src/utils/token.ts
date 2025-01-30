import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { CustomErrorResponse } from "./CustomErrorResponse";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
	throw new Error("Environment variable JWT_SECRET_KEY is not defined");
}

export const generateToken = async (data: string | Buffer | object) => {
	try {
		const token = jwt.sign(data, JWT_SECRET_KEY, { algorithm: "HS256", expiresIn: "1d" });
		return token;
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed generating token", err);
	}
};

export const decodeToken = async (token: string) => {
	const secret = new TextEncoder().encode(JWT_SECRET_KEY);

	try {
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (err) {
		throw new CustomErrorResponse(401, "Invalid or expired token", err);
	}
};
