import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const BikeCard = ({ bike, stockInfo }) => {
  const { language, t } = useLanguage();
  const prefix = language === "en" ? "/en" : "";

  return (
    <Link
      to={`${prefix}/vente/${bike.id}`}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
        <img
          src={bike.images[0]}
          alt={bike.name[language]}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {bike.categoryLabel[language]}
        </span>
        {/* Featured badge */}
        {bike.featured && (
          <span className="absolute top-3 right-3 bg-gray-900 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
            {t.bikeCatalog?.bestSeller || "Best-seller"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
          {bike.name[language]}
        </h3>

        {/* Key specs */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {typeof bike.specs.motor === "object" ? bike.specs.motor[language] : bike.specs.motor}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {typeof bike.specs.range === "object" ? bike.specs.range[language] : bike.specs.range}
          </span>
        </div>

        {/* Stock (live from eWheel API) */}
        <div className="flex items-center gap-2 mb-4">
          {(stockInfo?.inStock ?? bike.inStock) ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-green-600">
                {t.bikeCatalog?.inStock || "En stock"}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-sm text-red-500">
                {t.bikeCatalog?.onOrder || "Sur commande"}
              </span>
            </>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {bike.price.toLocaleString("fr-FR")}&nbsp;&euro;
          </span>
          <span className="text-orange-500 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            {t.bikeCatalog?.viewBike || "Voir le velo"} &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BikeCard;
