import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getBikeBySlug } from "../data/bikes";
import { BUSINESS_INFO } from "../constants";
import { CTASection, ContactSection } from "../components/sections";
import { useStock } from "../hooks/useStock";

const BikeDetailPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const prefix = language === "en" ? "/en" : "";
  const bike = getBikeBySlug(slug);
  const { getStock } = useStock();
  const stockInfo = bike ? getStock(bike.reference) : null;
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // JSON-LD Product schema
  useEffect(() => {
    if (!bike) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: bike.name[language],
      image: bike.images,
      description: bike.description[language],
      brand: { "@type": "Brand", name: "Viketory" },
      sku: bike.reference,
      category: bike.categoryLabel[language],
      offers: {
        "@type": "Offer",
        url: `https://www.artimonbike.com${prefix}/vente/${bike.id}`,
        priceCurrency: "EUR",
        price: bike.price,
        availability: bike.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
        seller: {
          "@type": "LocalBusiness",
          name: BUSINESS_INFO.name,
        },
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = "bike-product-schema";
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("bike-product-schema");
      if (existing) existing.remove();
    };
  }, [bike, language, prefix]);

  // Update page title
  useEffect(() => {
    if (!bike) return;
    document.title = `${bike.name[language]} - ${bike.price}\u20AC | Artimon Bike`;
    return () => {
      document.title = "Artimon Bike";
    };
  }, [bike, language]);

  if (!bike) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === "fr" ? "Velo non trouve" : "Bike not found"}
          </h1>
          <Link
            to={`${prefix}/vente`}
            className="text-orange-500 font-semibold hover:underline"
          >
            &larr; {t.bikeCatalog?.backToCatalog || "Retour au catalogue"}
          </Link>
        </div>
      </div>
    );
  }

  const specLabels = {
    motor: { fr: "Moteur", en: "Motor" },
    torque: { fr: "Couple", en: "Torque" },
    battery: { fr: "Batterie", en: "Battery" },
    range: { fr: "Autonomie", en: "Range" },
    weight: { fr: "Poids", en: "Weight" },
    wheels: { fr: "Roues", en: "Wheels" },
    brakes: { fr: "Freins", en: "Brakes" },
    gears: { fr: "Vitesses", en: "Gears" },
    suspension: { fr: "Suspension", en: "Suspension" },
    frame: { fr: "Cadre", en: "Frame" },
    folding: { fr: "Pliable", en: "Foldable" },
    dimensions: { fr: "Dimensions", en: "Dimensions" },
    brand: { fr: "Marque", en: "Brand" },
  };

  const getSpecValue = (value) => {
    if (typeof value === "object" && value[language]) return value[language];
    return value;
  };

  const whatsappMessage = encodeURIComponent(
    language === "fr"
      ? `Bonjour, je suis interesse(e) par le ${bike.name.fr} a ${bike.price}\u20AC. Pouvez-vous me donner plus d'informations ?`
      : `Hello, I'm interested in the ${bike.name.en} at ${bike.price}\u20AC. Can you give me more information?`
  );

  return (
    <div className="pt-20">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to={`${prefix}/vente`}
          className="text-orange-500 font-semibold hover:underline inline-flex items-center gap-1"
        >
          &larr; {t.bikeCatalog?.backToCatalog || "Retour au catalogue"}
        </Link>
      </div>

      {/* Main content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image gallery */}
            <div>
              {/* Main image */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square mb-4">
                <img
                  src={bike.images[selectedImage]}
                  alt={`${bike.name[language]} - ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {bike.images.slice(0, 7).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${bike.name[language]} ${i + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              {/* Category */}
              <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {bike.categoryLabel[language]}
              </span>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {bike.name[language]}
              </h1>

              {/* Price */}
              <div className="text-3xl font-bold text-orange-500 mb-4">
                {bike.price.toLocaleString("fr-FR")}&nbsp;&euro;
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                {(stockInfo?.inStock ?? bike.inStock) ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-green-600 font-medium">
                      {t.bikeCatalog?.inStock || "En stock"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-red-500 font-medium">
                      {t.bikeCatalog?.onOrder || "Sur commande"}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {bike.description[language]}
              </p>

              {/* Colors */}
              {bike.colors && bike.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t.bikeCatalog?.availableColors || "Coloris disponibles"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {bike.colors.map((c, i) => (
                      <span
                        key={i}
                        className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {c[language]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href={`${BUSINESS_INFO.whatsappLink}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-center inline-flex items-center justify-center gap-2"
                >
                  {t.bikeCatalog?.orderBike || "Commander ce velo"}
                </a>
                <a
                  href={`tel:${BUSINESS_INFO.phoneLink}`}
                  className="px-8 py-4 rounded-xl font-semibold text-center border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors inline-flex items-center justify-center gap-2"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>

              {/* Specs table */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t.bikeCatalog?.specifications || "Fiche technique"}
                </h3>
                <dl className="divide-y divide-gray-200">
                  {Object.entries(bike.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="py-3 flex justify-between items-center"
                    >
                      <dt className="text-sm text-gray-500 font-medium">
                        {specLabels[key]?.[language] || key}
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">
                        {getSpecValue(value)}
                      </dd>
                    </div>
                  ))}
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

export default BikeDetailPage;
