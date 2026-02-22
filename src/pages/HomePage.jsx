import { Suspense, lazy } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import {
  HeroSection, CitiesSection, ServicesSection
} from "../components/sections";

const PricingSection = lazy(() => import("../components/sections/PricingSection").then((module) => ({ default: module.PricingSection })));
const ReviewsSection = lazy(() => import("../components/sections/ReviewsSection").then((module) => ({ default: module.ReviewsSection })));
const PartnersSection = lazy(() => import("../components/sections/PartnersSection").then((module) => ({ default: module.PartnersSection })));
const BlogSection = lazy(() => import("./BlogSection"));
const FAQSection = lazy(() => import("../components/sections/FAQSection").then((module) => ({ default: module.FAQSection })));
const CTASection = lazy(() => import("../components/sections/CTASection").then((module) => ({ default: module.CTASection })));
const ContactSection = lazy(() => import("../components/sections/ContactSection").then((module) => ({ default: module.ContactSection })));

const HomePage = () => {
  const { language } = useLanguage();

  useSEO({
    title: SEO_DATA.home[language].title,
    description: SEO_DATA.home[language].description,
    keywords: SEO_DATA.home[language].keywords,
    canonical: "https://www.artimonbike.com/"
  });
  
  return (
    <>
      <HeroSection />
      <CitiesSection />
      <ServicesSection />
      <Suspense
        fallback={
          <div aria-hidden="true" className="space-y-8 py-6">
            <div className="min-h-[420px]" />
            <div className="min-h-[480px]" />
            <div className="min-h-[320px]" />
            <div className="min-h-[480px]" />
            <div className="min-h-[380px]" />
            <div className="min-h-[260px]" />
            <div className="min-h-[560px]" />
          </div>
        }
      >
        <PricingSection />
        <ReviewsSection />
        <PartnersSection />
        <BlogSection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </Suspense>
    </>
  );
};

export default HomePage;
