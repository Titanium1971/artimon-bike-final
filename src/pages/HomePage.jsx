import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import {
  HeroSection, CitiesSection, ServicesSection, PricingSection,
  FAQSection, ReviewsSection, ContactSection, CTASection
} from "../components/sections";
import BlogSection from "./BlogSection";

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
      <PricingSection />
      <ReviewsSection />
      <BlogSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </>
  );
};

export default HomePage;
