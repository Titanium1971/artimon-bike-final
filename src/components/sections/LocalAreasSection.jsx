import { useLanguage } from "../../contexts/LanguageContext";

/**
 * Internal links to local SEO landing pages.
 * Place it on HomePage and/or LocationPage to strengthen crawlability & relevance.
 */
export const LocalAreasSection = () => {
  const { language } = useLanguage();

  const items = [
    {
      frLabel: "Location vélo Marseillan",
      enLabel: "Bike rental Marseillan",
      frHref: "/location-velo-marseillan",
      enHref: "/en/bike-rental-marseillan"
    },
    {
      frLabel: "Location vélo Agde",
      enLabel: "Bike rental Agde",
      frHref: "/location-velo-agde",
      enHref: "/en/bike-rental-agde"
    },
    {
      frLabel: "Location vélo Sète",
      enLabel: "Bike rental Sète",
      frHref: "/location-velo-sete",
      enHref: "/en/bike-rental-sete"
    },
    {
      frLabel: "Location vélo Mèze",
      enLabel: "Bike rental Mèze",
      frHref: "/location-velo-meze",
      enHref: "/en/bike-rental-meze"
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {language === "fr"
            ? "Zones desservies : Marseillan, Agde, Sète, Mèze"
            : "Service areas: Marseillan, Agde, Sète, Mèze"}
        </h2>

        <p className="mt-3 text-gray-700">
          {language === "fr"
            ? "Pour un SEO local maximal, accédez à nos pages dédiées par ville : itinéraires, conseils, vélos recommandés."
            : "For maximum local SEO, use our city pages: routes, tips and recommended bikes."}
        </p>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((it) => {
            const href = language === "fr" ? it.frHref : it.enHref;
            const label = language === "fr" ? it.frLabel : it.enLabel;
            return (
              <li key={href}>
                <a
                  href={href}
                  className="block rounded-xl border border-gray-200 p-4 hover:border-orange-400 hover:bg-orange-50 transition"
                >
                  <span className="font-semibold text-gray-900">{label}</span>
                  <span className="block text-sm text-gray-600 mt-1">
                    {language === "fr"
                      ? "Infos locales + itinéraires"
                      : "Local info + routes"}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 text-sm text-gray-500">
          {language === "fr"
            ? "Astuce : ces liens internes aident Google à découvrir et indexer vos pages locales."
            : "Tip: internal links help Google discover and index local pages."}
        </div>
      </div>
    </section>
  );
};
