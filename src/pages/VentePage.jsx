import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import { CheckIcon } from "../icons";
import { CTASection, ContactSection } from "../components/sections";

const VentePage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.vente[language].title,
    description: SEO_DATA.vente[language].description,
    keywords: SEO_DATA.vente[language].keywords,
    canonical: "https://www.artimonbike.com/vente"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-orange-500">{t.salePage.title}</span> {t.salePage.titleHighlight}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.salePage.description}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.salePage.findPerfect} <span className="text-orange-500">{t.salePage.findPerfectHighlight}</span></h2>
              <p className="text-gray-600 mb-6">{t.salePage.intro}</p>
              <ul className="space-y-4 mb-8">
                {t.salePage.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3"><CheckIcon className="w-5 h-5 text-orange-500" /><span className="text-gray-700">{item}</span></li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary px-8 py-4 rounded-xl text-white font-semibold inline-flex items-center gap-2">{t.salePage.contactUs}</Link>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500&h=400&fit=crop&q=60&auto=format" alt="Vélos en vente" className="rounded-2xl shadow-xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
      <CTASection />
      <ContactSection />
    </div>
  );
};

export default VentePage;
