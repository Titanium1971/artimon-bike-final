import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getAccessoryBySlug } from "../data/accessories";
import { BUSINESS_INFO } from "../constants";
import { CTASection, ContactSection } from "../components/sections";

const AccessoryDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const prefix = language === "en" ? "/en" : "";
  const accessory = getAccessoryBySlug(slug);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // JSON-LD
  useEffect(() => {
    if (!accessory) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: accessory.name[language],
      image: accessory.images,
      description: accessory.description[language],
      sku: accessory.reference,
      category: accessory.categoryLabel[language],
      offers: {
        "@type": "Offer",
        url: `https://www.artimonbike.com${prefix}/vente/${accessory.category === "pneus" ? "pneus" : "chambres-a-air"}/${accessory.id}`,
        priceCurrency: "EUR",
        price: accessory.price,
        availability: "https://schema.org/InStock",
        seller: { "@type": "LocalBusiness", name: BUSINESS_INFO.name },
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = "accessory-product-schema";
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("accessory-product-schema");
      if (el) el.remove();
    };
  }, [accessory, language, prefix]);

  useEffect(() => {
    if (!accessory) return;
    document.title = `${accessory.name[language]} - ${accessory.price}\u20AC | Artimon Bike`;
    return () => { document.title = "Artimon Bike"; };
  }, [accessory, language]);

  if (!accessory) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === "fr" ? "Produit non trouvé" : "Product not found"}
          </h1>
          <Link to={`${prefix}/vente`} className="text-orange-500 font-semibold hover:underline">
            &larr; {language === "fr" ? "Retour à la boutique" : "Back to shop"}
          </Link>
        </div>
      </div>
    );
  }

  const backPath = accessory.category === "pneus" ? `${prefix}/vente/pneus` : `${prefix}/vente/chambres-a-air`;
  const backLabel = accessory.category === "pneus"
    ? (language === "fr" ? "Retour aux pneus" : "Back to tires")
    : (language === "fr" ? "Retour aux chambres à air" : "Back to inner tubes");

  const specLabels = {
    size: { fr: "Taille", en: "Size" },
    type: { fr: "Type", en: "Type" },
    gel: { fr: "Protection", en: "Protection" },
    brand: { fr: "Marque", en: "Brand" },
    valve: { fr: "Valve", en: "Valve" },
    thickness: { fr: "Épaisseur", en: "Thickness" },
    quantity: { fr: "Conditionnement", en: "Packaging" },
    compatibility: { fr: "Compatibilité", en: "Compatibility" },
  };

  const getSpecValue = (value) => {
    if (typeof value === "object" && value[language]) return value[language];
    return value;
  };

  const whatsappMessage = encodeURIComponent(
    language === "fr"
      ? `Bonjour, je suis intéressé(e) par : ${accessory.name.fr} (réf: ${accessory.reference}) à ${accessory.price}\u20AC`
      : `Hello, I'm interested in: ${accessory.name.en} (ref: ${accessory.reference}) at ${accessory.price}\u20AC`
  );

  const images = accessory.images && accessory.images.length > 0 ? accessory.images : [""];

  return (
    <div className="pt-20">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to={backPath} className="text-orange-500 font-semibold hover:underline inline-flex items-center gap-1">
          &larr; {backLabel}
        </Link>
      </div>

      {/* Main content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image gallery */}
            <div>
              <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square mb-4">
                <img
                  src={images[selectedImage]}
                  alt={`${accessory.name[language]} - ${selectedImage + 1}`}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                  {images.slice(0, 7).map((img, i) => (
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
                        alt={`${accessory.name[language]} ${i + 1}`}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {accessory.categoryLabel[language]}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {accessory.name[language]}
              </h1>

              <div className="text-3xl font-bold text-orange-500 mb-4">
                {accessory.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;&euro;
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-green-600 font-medium">
                  {language === "fr" ? "En stock" : "In stock"}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {accessory.description[language]}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href={`https://wa.me/33671326547?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-center inline-flex items-center justify-center gap-2"
                >
                  {language === "fr" ? "Commander sur WhatsApp" : "Order on WhatsApp"}
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
                  {language === "fr" ? "Caractéristiques" : "Specifications"}
                </h3>
                <dl className="divide-y divide-gray-200">
                  {Object.entries(accessory.specs).map(([key, value]) => {
                    const displayValue = getSpecValue(value);
                    if (!displayValue) return null;
                    return (
                      <div key={key} className="py-3 flex justify-between items-center">
                        <dt className="text-sm text-gray-500 font-medium">
                          {specLabels[key]?.[language] || key}
                        </dt>
                        <dd className="text-sm font-semibold text-gray-900">
                          {displayValue}
                        </dd>
                      </div>
                    );
                  })}
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

export default AccessoryDetailPage;
