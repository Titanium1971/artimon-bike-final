import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BUSINESS_INFO, API_URL } from "../../constants";

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
};

const conditionColors = {
  excellent: "bg-green-100 text-green-700",
  bon: "bg-blue-100 text-blue-700",
  correct: "bg-yellow-100 text-yellow-700",
};

const UsedBikeCard = ({ bike }) => {
  const { t, language } = useLanguage();
  const prefix = language === "en" ? "/en" : "";
  const ub = t.usedBikes || {};

  const conditionLabel =
    ub.conditions?.[bike.condition] || bike.condition;
  const bikeTypeLabel =
    ub.bikeTypes?.[bike.bike_type] || bike.bike_type;

  const discount =
    bike.original_price && bike.original_price > bike.price
      ? Math.round(((bike.original_price - bike.price) / bike.original_price) * 100)
      : null;

  const whatsappMessage = encodeURIComponent(
    language === "fr"
      ? `Bonjour, je suis intéressé(e) par le vélo d'occasion "${bike.title}" à ${bike.price}€. Est-il toujours disponible ?`
      : `Hello, I'm interested in the used bike "${bike.title}" at ${bike.price}€. Is it still available?`
  );

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group ${
        bike.sold ? "opacity-70" : ""
      }`}
    >
      {/* Full-card link overlay (sits below interactive elements) */}
      <Link
        to={`${prefix}/vente/occasion/${bike.id}`}
        className="absolute inset-0 z-0"
        aria-label={bike.title}
      />
      {/* Sold overlay */}
      {bike.sold && (
        <div className="absolute inset-0 bg-gray-900/60 z-10 flex items-center justify-center">
          <span className="bg-red-500 text-white text-lg font-bold px-6 py-2 rounded-full -rotate-12 shadow-lg">
            {ub.sold || "Vendu"}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
        {bike.image_url ? (
          <img
            src={resolveImageUrl(bike.image_url)}
            alt={bike.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {ub.occasion || "Occasion"}
          </span>
          {bike.electric && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {ub.electric || "Electrique"}
            </span>
          )}
        </div>

        {/* Discount badge top-right */}
        {discount && !bike.sold && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-1">{bike.title}</h3>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${conditionColors[bike.condition] || "bg-gray-100 text-gray-600"}`}>
            {conditionLabel}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {bikeTypeLabel}
          </span>
          {bike.brand && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {bike.brand}
            </span>
          )}
          {bike.year && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {bike.year}
            </span>
          )}
          {bike.size && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {ub.sizeLabel || "Taille"}: {bike.size}
            </span>
          )}
        </div>

        {/* Description */}
        {bike.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{bike.description}</p>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-orange-500">{bike.price.toLocaleString("fr-FR")}&euro;</span>
            {bike.original_price && bike.original_price > bike.price && (
              <span className="text-sm text-gray-400 line-through">
                {bike.original_price.toLocaleString("fr-FR")}&euro;
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <Link
              to={`${prefix}/vente/occasion/${bike.id}`}
              className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-center rounded-xl font-semibold transition-colors"
            >
              {ub.viewDetails || "Voir la fiche →"}
            </Link>
            {!bike.sold && (
              <a
                href={`${BUSINESS_INFO.whatsappLink}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-green-500 hover:bg-green-600 text-white text-center rounded-xl font-semibold transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {ub.contactWhatsApp || "Contacter via WhatsApp"}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsedBikeCard;
