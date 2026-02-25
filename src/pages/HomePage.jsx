import { Suspense, lazy, useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import {
  HeroSection, CitiesSection, LocalAreasSection, ServicesSection
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
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enableDeferredSections = () => {
      if (!cancelled) setShowDeferredSections(true);
    };

    let timerId;
    let idleId;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(enableDeferredSections, { timeout: 1800 });
    } else {
      timerId = window.setTimeout(enableDeferredSections, 1200);
    }

    return () => {
      cancelled = true;
      if (typeof idleId === "number" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (typeof timerId === "number") {
        window.clearTimeout(timerId);
      }
    };
  }, []);

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
      <LocalAreasSection />
      <ServicesSection />
      {language === "en" && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Bike rental around Etang de Thau: local service from Marseillan
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Artimon Bike provides bike rental, repair and sales in Marseillan, with easy access to Agde,
              Sete and Meze. We help visitors and local riders choose the right bike for lagoon routes,
              beaches, canals and family rides. Our fleet includes e-bikes, hybrid bikes and MTB options,
              with practical equipment for safe day trips.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              If you are planning a short ride or a full-day loop, start with our local rental page and route
              recommendations. You can also check pricing and contact us directly for availability and route advice.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/en/location" className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 transition">
                Bike rental in Marseillan
              </a>
              <a href="/en/parcours" className="inline-flex items-center rounded-lg border border-orange-600 px-4 py-2 text-orange-700 font-semibold hover:bg-orange-50 transition">
                Bike routes around Etang de Thau
              </a>
            </div>
          </div>
        </section>
      )}
      {showDeferredSections ? (
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
      ) : (
        <div aria-hidden="true" className="space-y-8 py-6">
          <div className="min-h-[420px]" />
          <div className="min-h-[480px]" />
          <div className="min-h-[320px]" />
          <div className="min-h-[480px]" />
          <div className="min-h-[380px]" />
          <div className="min-h-[260px]" />
          <div className="min-h-[560px]" />
        </div>
      )}
    </>
  );
};

export default HomePage;
