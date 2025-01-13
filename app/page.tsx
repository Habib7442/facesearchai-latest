import { Suspense } from "react";
import { Metadata } from "next";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PricingSection from "@/components/Pricing-section/pricing-section";
import TestimonialSection from "@/components/Testimonial-section/testimonial-section";
import AboutSection from "@/components/AboutSection";
import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Metadata for SEO
export const metadata: Metadata = {
  title: "Face Search AI - Advanced Facial Recognition Technology",
  description: 
    "Leading facial recognition technology with advanced face check ID verification and powerful photo search capabilities.",
  openGraph: {
    title: "Face Search AI - Advanced Facial Recognition Technology",
    description:
      "Leading facial recognition technology with advanced face check ID verification and powerful photo search capabilities.",
    images: ["/og-image.jpg"],
  },
};

// Custom loading component for sections
const SectionLoading = () => (
  <div className="w-full h-[50vh] flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Gradient Background */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent pointer-events-none" /> */}

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Center container for all sections */}
        <div className="max-w-[1920px] mx-auto">
          {/* Hero Section */}
          <section className="min-h-full relative">
            <Suspense fallback={<SectionLoading />}>
              <HeroSection />
            </Suspense>
          </section>

          {/* About Section */}
          <section className="w-full py-16 lg:pt-28" id="about">
            <Suspense fallback={<SectionLoading />}>
              <AboutSection />
            </Suspense>
          </section>

          {/* Pricing Section */}
          <section 
            className="w-full py-16 lg:pt-28" 
            id="pricing"
          >
            <Suspense fallback={<SectionLoading />}>
              <PricingSection />
            </Suspense>
          </section>

          {/* Testimonial Section */}
          <section 
            className="w-full py-16 lg:pt-28 scroll-mt-20" 
            id="testimonials"
          >
            <Suspense fallback={<SectionLoading />}>
              <TestimonialSection />
            </Suspense>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full container mx-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <Suspense fallback={<SectionLoading />}>
            <FooterSection />
          </Suspense>
        </footer>
      </div>
    </main>
  );
}
