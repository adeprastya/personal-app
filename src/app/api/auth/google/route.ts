import { NextResponse } from "next/server";
import { oAuthUrl } from "@/config/GOAuth";

export const GET = async () => NextResponse.redirect(oAuthUrl, 302);
