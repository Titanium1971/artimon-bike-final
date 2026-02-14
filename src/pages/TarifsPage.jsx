import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import { PricingSection, CTASection } from "../components/sections";

const TarifsPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.tarifs[language].title,
    description: SEO_DATA.tarifs[language].description,
    keywords: SEO_DATA.tarifs[language].keywords,
    canonical: "https://www.artimonbike.com/tarifs"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pricing.title} <span className="text-orange-500">{t.pricing.titleHighlight}</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.pricing.description}</p>
          </div>
        </div>
      </section>
      <PricingSection />
      <CTASection />
    </div>
  );
};

export default TarifsPage;
