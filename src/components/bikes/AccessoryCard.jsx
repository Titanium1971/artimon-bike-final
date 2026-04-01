import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const AccessoryCard = ({ accessory }) => {
  const { language } = useLanguage();
  const prefix = language === "en" ? "/en" : "";

  const getSpec = (val) => {
    if (!val) return null;
    return typeof val === "object" ? val[language] || val.fr : val;
  };

  const detailPath = accessory.category === "pneus"
    ? `${prefix}/vente/pneus/${accessory.id}`
    : `${prefix}/vente/chambres-a-air/${accessory.id}`;

  return (
    <Link
      to={detailPath}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-white">
        <img
          src={accessory.images ? accessory.images[0] : accessory.image}
          alt={accessory.name[language]}
          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {accessory.categoryLabel[language]}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-2 line-clamp-2">
          {accessory.name[language]}
        </h3>

        {/* Specs tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {accessory.specs.size && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {accessory.specs.size}
            </span>
          )}
          {getSpec(accessory.specs.type) && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {getSpec(accessory.specs.type)}
            </span>
          )}
          {getSpec(accessory.specs.quantity) && (
            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded font-medium">
              {getSpec(accessory.specs.quantity)}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {accessory.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;&euro;
          </span>
          <span className="text-orange-500 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            {language === "fr" ? "Voir" : "View"} &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AccessoryCard;
