"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearPendingContact, readPendingContact } from "@/lib/contact-pending";

/**
 * The lock travels in `?ref=`, so a visitor who opens `/track` from the header
 * during the 10-minute window would land on the unlocked page. This quietly
 * re-attaches the pending request once per visit. A reference the server no
 * longer knows (deleted by the workshop) is forgotten instead of locking the
 * contact form forever.
 */
export function TrackLockSync({ hasRef }: { hasRef: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (hasRef) return;
    const pending = readPendingContact();
    if (!pending) return;
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(
          `/api/contact/status?id=${encodeURIComponent(pending.id)}`,
          { cache: "no-store" },
        );
        if (cancelled) return;
        if (response.status === 404) {
          clearPendingContact();
          return;
        }
        if (!response.ok) return;
        const data = (await response.json()) as {
          ok?: boolean;
          status?: string;
        };
        if (!cancelled && data.ok && data.status === "new") {
          router.replace(`/track?ref=${encodeURIComponent(pending.id)}`);
        }
      } catch {
        /* the page stays usable; a later visit retries */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasRef, router]);

  return null;
}
