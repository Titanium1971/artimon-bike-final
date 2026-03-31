import { useLanguage } from "@/contexts/LanguageContext";

const AccessoryCard = ({ accessory }) => {
  const { language } = useLanguage();

  const getSpec = (val) => {
    if (!val) return null;
    return typeof val === "object" ? val[language] || val.fr : val;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-white">
        <img
          src={accessory.image}
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
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {accessory.specs.size}
          </span>
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

        {/* Description */}
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
          {accessory.description[language]}
        </p>

        {/* Price + Contact CTA */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {accessory.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;&euro;
          </span>
          <a
            href={`https://wa.me/33671326547?text=${encodeURIComponent(
              `Bonjour, je suis intéressé par : ${accessory.name.fr} (réf: ${accessory.reference})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-green-600 font-semibold text-sm hover:text-green-700 inline-flex items-center gap-1"
          >
            Commander &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccessoryCard;
