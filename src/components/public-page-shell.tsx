import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Public pages keep the site chrome; only the console drops it. */
export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main
        dir='rtl'
        className='flex w-full flex-1 flex-col bg-paper pt-15'
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
