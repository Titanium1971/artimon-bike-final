import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import { FAQSection, CTASection } from "../components/sections";

const FAQPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.faq[language].title,
    description: SEO_DATA.faq[language].description,
    keywords: SEO_DATA.faq[language].keywords,
    canonical: "https://www.artimonbike.com/faq"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.faq.title} <span className="text-orange-500">{t.faq.titleHighlight}</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.faq.description}</p>
          </div>
        </div>
      </section>
      {language === "en" && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions about bike hire in Marseillan</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              This FAQ helps visitors plan bike rental around Marseillan, Agde, Sete and Meze. We cover practical
              topics such as required documents, included equipment, booking timing, puncture support and route tips.
              If you are visiting the region for a short stay, we recommend booking in advance during high season.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              For specific requests (family setup, electric range, custom itinerary), contact our team directly and
              we will suggest the most suitable option for your trip.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/en/contact" className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 transition">
                Contact us
              </a>
              <a href="/en/location" className="inline-flex items-center rounded-lg border border-orange-600 px-4 py-2 text-orange-700 font-semibold hover:bg-orange-50 transition">
                See bike rental options
              </a>
            </div>
          </div>
        </section>
      )}
      <FAQSection showFull />
      <CTASection />
    </div>
  );
};

export default FAQPage;
