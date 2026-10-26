import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  GOOGLE_STATE_COOKIE,
  buildAuthUrl,
  createOAuthState,
  isGoogleConfigured,
} from "@/lib/google-calendar";

/**
 * Kicks off the OAuth dance with Google. The signed `state` lands in an
 * HttpOnly cookie, so `/callback` can prove the response belongs to the browser
 * that started the flow.
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/plan?google=missing", request.nextUrl),
    );
  }

  const state = createOAuthState();
  const jar = await cookies();
  jar.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(buildAuthUrl(state));
}
