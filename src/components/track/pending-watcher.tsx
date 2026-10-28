"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 20_000;

/**
 * Bumps the locked `/track?ref=…` page when the workshop changes the request
 * status in the console. One small status request every 20 s, plus one when the
 * tab comes back to the foreground; the server decides what the page shows.
 */
export function PendingWatcher({ submissionId }: { submissionId: string }) {
  const router = useRouter();

  useEffect(() => {
    let stopped = false;
    let inFlight = false;

    const check = async () => {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch(
          `/api/contact/status?id=${encodeURIComponent(submissionId)}`,
          { cache: "no-store" },
        );
        if (stopped || !response.ok) return;
        const data = (await response.json()) as {
          ok?: boolean;
          status?: string;
        };
        if (!stopped && data.ok && data.status && data.status !== "new") {
          stopped = true;
          router.refresh();
        }
      } catch {
        /* offline for a beat — the next tick retries */
      } finally {
        inFlight = false;
      }
    };

    const interval = window.setInterval(check, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [submissionId, router]);

  return null;
}
