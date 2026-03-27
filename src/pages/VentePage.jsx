import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA, BUSINESS_INFO } from "../constants";
import { CTASection, ContactSection } from "../components/sections";
import BikeCard from "../components/bikes/BikeCard";
import BikeFilters from "../components/bikes/BikeFilters";
import { bikes, getBikesByCategory } from "../data/bikes";

const VentePage = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const prefix = language === "en" ? "/en" : "";

  useSEO({
    title: SEO_DATA.vente[language].title,
    description: SEO_DATA.vente[language].description,
    keywords: SEO_DATA.vente[language].keywords,
    canonical: `https://www.artimonbike.com${prefix}/vente`,
  });

  const filteredBikes = getBikesByCategory(activeFilter);

  // JSON-LD Product schemas for all visible bikes
  useEffect(() => {
    const schemas = filteredBikes.map((bike) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: bike.name[language],
      image: bike.images[0],
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
    }));

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemas);
    script.id = "bikes-catalog-schema";
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("bikes-catalog-schema");
      if (existing) existing.remove();
    };
  }, [filteredBikes, language, prefix]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-orange-500">
                {t.bikeCatalog?.heroTitle || t.salePage.title}
              </span>{" "}
              {t.bikeCatalog?.heroTitleEnd || t.salePage.titleHighlight}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t.bikeCatalog?.heroDescription || t.salePage.description}
            </p>
            <p className="text-sm text-gray-400 mt-4">
              {t.bikeCatalog?.bikeCount
                ? t.bikeCatalog.bikeCount.replace("{count}", bikes.length)
                : `${bikes.length} ${language === "fr" ? "velos electriques disponibles" : "electric bikes available"}`}
            </p>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-12">
            <BikeFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Results count */}
          <p className="text-gray-500 text-sm mb-6 text-center">
            {filteredBikes.length}{" "}
            {language === "fr"
              ? filteredBikes.length > 1
                ? "velos trouves"
                : "velo trouve"
              : filteredBikes.length > 1
                ? "bikes found"
                : "bike found"}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>

          {/* Empty state */}
          {filteredBikes.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                {language === "fr"
                  ? "Aucun velo dans cette categorie."
                  : "No bikes in this category."}
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
      <ContactSection />
    </div>
  );
};

export default VentePage;
