import { connection } from "next/server";
import { ContactSection } from "@/components/contact-section";
import { EstimatorSection } from "@/components/estimator-section";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhyMeSection } from "@/components/why-me-section";
import { getEstimatorConfig } from "@/lib/content";

/** The estimator is editable in the console, so the page reads it per request. */
export const instant = false;

export default async function Home() {
  await connection();
  const estimator = await getEstimatorConfig();

  return (
    <>
      <SiteHeader />
      <main className='flex w-full flex-1 flex-col bg-paper pt-15' dir='rtl'>
        <HeroSection />
        <WhyMeSection />
        <ProjectsSection />
        <EstimatorSection config={estimator} />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
