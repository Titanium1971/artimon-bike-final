import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { BUSINESS_INFO, API_URL } from "../constants";
import { CTASection, ContactSection } from "../components/sections";

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

const UsedBikeDetailPage = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const prefix = language === "en" ? "/en" : "";
  const ub = t.usedBikes || {};

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await fetch(`${API_URL}/api/used-bikes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBike(data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  // Update page title
  useEffect(() => {
    if (!bike) return;
    document.title = `${bike.title} - ${bike.price}€ | Artimon Bike`;
    return () => {
      document.title = "Artimon Bike";
    };
  }, [bike]);

  // JSON-LD schema
  useEffect(() => {
    if (!bike) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: bike.title,
      description: bike.description || "",
      brand: bike.brand ? { "@type": "Brand", name: bike.brand } : undefined,
      offers: {
        "@type": "Offer",
        url: `https://www.artimonbike.com${prefix}/vente/occasion/${bike.id}`,
        priceCurrency: "EUR",
        price: bike.price,
        availability: bike.sold
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
        itemCondition: "https://schema.org/UsedCondition",
        seller: { "@type": "LocalBusiness", name: BUSINESS_INFO.name },
      },
    };
    if (bike.image_url) schema.image = resolveImageUrl(bike.image_url);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = "used-bike-product-schema";
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("used-bike-product-schema");
      if (existing) existing.remove();
    };
  }, [bike, prefix]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !bike) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === "fr" ? "Vélo non trouvé" : "Bike not found"}
          </h1>
          <Link
            to={`${prefix}/vente#occasion`}
            className="text-orange-500 font-semibold hover:underline"
          >
            &larr; {t.bikeCatalog?.backToCatalog || "Retour au catalogue"}
          </Link>
        </div>
      </div>
    );
  }

  const conditionLabel = ub.conditions?.[bike.condition] || bike.condition;
  const bikeTypeLabel = ub.bikeTypes?.[bike.bike_type] || bike.bike_type;

  const discount =
    bike.original_price && bike.original_price > bike.price
      ? Math.round(((bike.original_price - bike.price) / bike.original_price) * 100)
      : null;

  const whatsappMessage = encodeURIComponent(
    language === "fr"
      ? `Bonjour, je suis intéressé(e) par le vélo d'occasion "${bike.title}" à ${bike.price}€. Est-il toujours disponible ?`
      : `Hello, I'm interested in the used bike "${bike.title}" at ${bike.price}€. Is it still available?`
  );

  const imageUrl = resolveImageUrl(bike.image_url);

  return (
    <div className="pt-20">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to={`${prefix}/vente#occasion`}
          className="text-orange-500 font-semibold hover:underline inline-flex items-center gap-1"
        >
          &larr; {t.bikeCatalog?.backToCatalog || "Retour au catalogue"}
        </Link>
      </div>

      {/* Main content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={bike.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {/* Sold overlay */}
                {bike.sold && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-2xl font-bold px-8 py-3 rounded-full -rotate-12 shadow-lg">
                      {ub.sold || "Vendu"}
                    </span>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {ub.occasion || "Occasion"}
                  </span>
                  {bike.electric && (
                    <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {ub.electric || "Électrique"}
                    </span>
                  )}
                </div>
                {discount && !bike.sold && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Product info */}
            <div>
              {/* Meta badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${conditionColors[bike.condition] || "bg-gray-100 text-gray-600"}`}>
                  {conditionLabel}
                </span>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {bikeTypeLabel}
                </span>
                {bike.brand && (
                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {bike.brand}
                  </span>
                )}
                {bike.year && (
                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {bike.year}
                  </span>
                )}
                {bike.size && (
                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {ub.sizeLabel || "Taille"} : {bike.size}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {bike.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-orange-500">
                  {bike.price.toLocaleString("fr-FR")}&nbsp;€
                </span>
                {bike.original_price && bike.original_price > bike.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {bike.original_price.toLocaleString("fr-FR")}&nbsp;€
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-6">
                {bike.sold ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-red-500 font-medium">
                      {ub.sold || "Vendu"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-green-600 font-medium">
                      {language === "fr" ? "Disponible" : "Available"}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              {bike.description && (
                <p className="text-gray-600 leading-relaxed mb-8">
                  {bike.description}
                </p>
              )}

              {/* CTA Buttons */}
              {!bike.sold && (
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href={`${BUSINESS_INFO.whatsappLink}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl text-white font-semibold text-center inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {ub.contactWhatsApp || "Contacter via WhatsApp"}
                  </a>
                  <a
                    href={BUSINESS_INFO.phoneLink}
                    className="px-8 py-4 rounded-xl font-semibold text-center border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              )}

              {/* Details table */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t.bikeCatalog?.specifications || "Fiche technique"}
                </h3>
                <dl className="divide-y divide-gray-200">
                  {bike.brand && (
                    <div className="py-3 flex justify-between items-center">
                      <dt className="text-sm text-gray-500 font-medium">
                        {language === "fr" ? "Marque" : "Brand"}
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">{bike.brand}</dd>
                    </div>
                  )}
                  {bike.year && (
                    <div className="py-3 flex justify-between items-center">
                      <dt className="text-sm text-gray-500 font-medium">
                        {language === "fr" ? "Année" : "Year"}
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">{bike.year}</dd>
                    </div>
                  )}
                  {bike.size && (
                    <div className="py-3 flex justify-between items-center">
                      <dt className="text-sm text-gray-500 font-medium">
                        {ub.sizeLabel || "Taille"}
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">{bike.size}</dd>
                    </div>
                  )}
                  <div className="py-3 flex justify-between items-center">
                    <dt className="text-sm text-gray-500 font-medium">
                      {language === "fr" ? "Type" : "Type"}
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900">{bikeTypeLabel}</dd>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <dt className="text-sm text-gray-500 font-medium">
                      {language === "fr" ? "État" : "Condition"}
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900">{conditionLabel}</dd>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <dt className="text-sm text-gray-500 font-medium">
                      {language === "fr" ? "Électrique" : "Electric"}
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {bike.electric
                        ? language === "fr" ? "Oui" : "Yes"
                        : language === "fr" ? "Non" : "No"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <ContactSection />
    </div>
  );
};

export default UsedBikeDetailPage;
