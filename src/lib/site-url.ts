import { headers } from "next/headers";

/**
 * The absolute origin used inside SMS bodies.
 *
 * A link in a text message cannot be relative, and the console often runs on a
 * host the server cannot see (a reverse proxy, a preview deployment). The
 * configured value wins; otherwise the request's own forwarded host is the best
 * answer available, and localhost keeps a dev send from producing garbage.
 */
export async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  try {
    const list = await headers();
    const host = list.get("x-forwarded-host") ?? list.get("host");
    if (host) {
      const proto =
        list.get("x-forwarded-proto") ??
        (/^(localhost|127\.|\[::1\])/.test(host) ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // Outside a request (a script, a cron): fall through to the dev default.
  }

  return "http://localhost:3000";
}
