import { useLanguage } from "../../contexts/LanguageContext";
import { BUSINESS_INFO, PRICING_DATA } from "../../constants";

export const PricingSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.pricing.title} <span className="text-orange-500">{t.pricing.titleHighlight}</span> {t.pricing.titleEnd}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.pricing.description}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <th className="px-6 py-4 text-left font-semibold">{t.pricing.bikeType}</th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.halfDay}</th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.day}</th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.threeDays}<br/><span className="text-xs font-normal">-10%</span></th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.fiveDays}<br/><span className="text-xs font-normal">-20%</span></th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.week}<br/><span className="text-xs font-normal">-25%</span></th>
              </tr>
            </thead>
            <tbody>
              {PRICING_DATA.map((item, index) => (
                <tr key={index} className="pricing-row border-b border-gray-100 last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold text-gray-900">{t.pricing.types[index]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.halfDay}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">{item.day}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.threeDays}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.fiveDays}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.week}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-6">{t.pricing.equipmentIncluded}</p>
          <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2" data-testid="pricing-reservation-btn">
            <img src="/logo.svg" alt="" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} width="24" height="24" decoding="async" />
            Réserver sur la plateforme
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
