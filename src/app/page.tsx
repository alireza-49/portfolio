import { ContactSection } from "@/components/contact-section";
import { CraftValuesSection } from "@/components/craft-values-section";
import { EstimatorSection } from "@/components/estimator-section";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhyMeSection } from "@/components/why-me-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col bg-paper pt-20" dir="rtl">
        <HeroSection />
        <WhyMeSection />
        <ProjectsSection />
        <EstimatorSection />
        <CraftValuesSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
