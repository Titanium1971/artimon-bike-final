import { useLanguage } from "../../contexts/LanguageContext";
import { BUSINESS_INFO } from "../../constants";
import { PhoneIcon } from "../../icons";

export const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden" data-testid="cta-section">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.cta.title}</h2>
          <p className="text-white/90 text-lg mb-8">{t.cta.description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl" data-testid="cta-reservation-btn">
              <img src="/logo.svg" alt="" className="w-6 h-6" width="300" height="150" />
              Réserver sur la plateforme
            </a>
            <a href={BUSINESS_INFO.phoneLink} className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 hover:scale-105 transition-all inline-flex items-center gap-2 backdrop-blur-sm">
              <PhoneIcon className="w-5 h-5" />
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
