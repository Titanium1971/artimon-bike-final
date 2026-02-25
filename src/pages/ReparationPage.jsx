import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import { CTASection, ContactSection } from "../components/sections";

const ReparationPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.reparation[language].title,
    description: SEO_DATA.reparation[language].description,
    keywords: SEO_DATA.reparation[language].keywords,
    canonical: "https://www.artimonbike.com/reparation"
  });
  
  const services = Object.entries(t.repairPage.services).map(([key, value]) => ({
    ...value,
    icon: { puncture: "⏱️", revision: "🔧", brakes: "🛑", derailleur: "⚙️", chain: "🔗", tire: "🛞" }[key]
  }));

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-orange-500">{t.repairPage.title}</span> {t.repairPage.titleHighlight}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.repairPage.description}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.name} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.desc}</p>
                <p className="text-orange-500 font-semibold">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {language === "en" && (
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Professional bike repair service in Marseillan</h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              We repair everyday bikes, e-bikes and MTB models for local riders and visitors. Typical requests include
              puncture repairs, brake adjustments, drivetrain tuning and full safety checks before long rides around
              Etang de Thau.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              If your bike needs urgent maintenance during your trip, call us and we will prioritize quick diagnostics.
              For larger repairs, we provide clear recommendations and realistic timelines.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/en/contact" className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 transition">
                Request a repair
              </a>
              <a href="/en/location" className="inline-flex items-center rounded-lg border border-orange-600 px-4 py-2 text-orange-700 font-semibold hover:bg-orange-50 transition">
                Need a rental bike?
              </a>
            </div>
          </div>
        </section>
      )}
      <CTASection />
      <ContactSection />
    </div>
  );
};

export default ReparationPage;
