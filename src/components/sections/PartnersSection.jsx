import { useLanguage } from "../../contexts/LanguageContext";

export const PartnersSection = () => {
  const { language } = useLanguage();

  const title = language === "fr" ? "Nos Partenaires" : "Our Partners";
  const subtitle =
    language === "fr"
      ? "Retrouvez Artimon Bike sur des plateformes reconnues."
      : "Find Artimon Bike on trusted tourism platforms.";

  return (
    <section className="py-16 bg-white" data-testid="partners-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://www.petitfute.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src="/petit-fute-logo.png"
                alt="Petit Futé"
                className="w-14 h-14 object-contain rounded-xl bg-white p-1"
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">Petit Futé</h3>
                <p className="text-sm text-gray-600">
                  {language === "fr" ? "Guide touristique et bonnes adresses" : "Travel guide and local recommendations"}
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://www.familleplus.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src="/famille-plus.png"
                alt="Famille Plus"
                className="w-14 h-14 object-contain rounded-xl bg-white p-1"
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">Famille Plus</h3>
                <p className="text-sm text-gray-600">
                  {language === "fr" ? "Label qualité pour l'accueil des familles" : "Quality label for family-friendly destinations"}
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
