import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  GOOGLE_SCOPES,
  GOOGLE_STATE_COOKIE,
  exchangeCode,
  fetchUserEmail,
  isGoogleConfigured,
  verifyOAuthState,
} from "@/lib/google-calendar";
import { getGoogleAccount, saveGoogleAccount } from "@/lib/content";
import { encryptSecret } from "@/lib/secrets";

/**
 * Google redirects here with `?code&state`. Everything that can go wrong ends
 * up as a `?google=…` hint on `/admin/plan` — never as a raw OAuth error page.
 */
export async function GET(request: NextRequest) {
  const redirect = (query: string) =>
    NextResponse.redirect(new URL(`/admin/plan?${query}`, request.nextUrl));

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }

  const params = request.nextUrl.searchParams;
  const code = params.get("code") ?? "";
  const state = params.get("state") ?? "";
  const denied = params.get("error");

  const jar = await cookies();
  const expected = jar.get(GOOGLE_STATE_COOKIE)?.value ?? "";
  jar.delete(GOOGLE_STATE_COOKIE);

  if (denied) return redirect("google=denied");
  if (!code || !state || !expected || state !== expected || !verifyOAuthState(state)) {
    return redirect("google=state");
  }
  if (!isGoogleConfigured()) return redirect("google=missing");

  try {
    const token = await exchangeCode(code);
    const email = await fetchUserEmail(token.access_token);
    const existing = await getGoogleAccount();

    await saveGoogleAccount({
      accountEmail: email,
      accessToken: encryptSecret(token.access_token),
      accessExpiresAt: new Date(
        Date.now() + token.expires_in * 1000,
      ).toISOString(),
      // Google only returns a refresh token on a consent screen; keep the old
      // one instead of wiping the connection when it does not.
      refreshToken: token.refresh_token
        ? encryptSecret(token.refresh_token)
        : (existing?.refreshToken ?? ""),
      scope: token.scope ?? GOOGLE_SCOPES.join(" "),
      // A fresh grant may cover a different calendar, so pull from scratch.
      syncToken: "",
      needsReauth: false,
      lastError: "",
    });
  } catch (error) {
    console.error("[google] callback failed:", error);
    return redirect("google=error");
  }

  return redirect("google=connected");
}
