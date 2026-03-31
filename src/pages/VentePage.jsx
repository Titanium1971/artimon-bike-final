import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA, BUSINESS_INFO, API_URL } from "../constants";
import { CTASection, ContactSection } from "../components/sections";
import BikeCard from "../components/bikes/BikeCard";
import BikeFilters from "../components/bikes/BikeFilters";
import UsedBikeCard from "../components/bikes/UsedBikeCard";
import AccessoryCard from "../components/bikes/AccessoryCard";
import { bikes, getBikesByCategory } from "../data/bikes";
import { accessories, ACCESSORY_CATEGORIES } from "../data/accessories";
import { useStock } from "../hooks/useStock";

const VentePage = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const { getStock } = useStock();
  const prefix = language === "en" ? "/en" : "";
  const [usedBikes, setUsedBikes] = useState([]);
  const [usedBikesLoading, setUsedBikesLoading] = useState(true);
  const [accessoryFilter, setAccessoryFilter] = useState("all");

  // Fetch used bikes
  useEffect(() => {
    const fetchUsedBikes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/used-bikes`);
        if (res.ok) {
          const data = await res.json();
          setUsedBikes(data);
        }
      } catch (err) {
        console.error("Error fetching used bikes:", err);
      } finally {
        setUsedBikesLoading(false);
      }
    };
    fetchUsedBikes();
  }, []);

  useSEO({
    title: SEO_DATA.vente[language].title,
    description: SEO_DATA.vente[language].description,
    keywords: SEO_DATA.vente[language].keywords,
    canonical: `https://www.artimonbike.com${prefix}/vente`,
  });

  const filteredBikes = getBikesByCategory(activeFilter);
  const filteredAccessories = accessoryFilter === "all"
    ? accessories
    : accessories.filter((a) => a.category === accessoryFilter);

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
              <BikeCard key={bike.id} bike={bike} stockInfo={getStock(bike.reference)} />
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

      {/* Accessories Section */}
      <section id="accessoires" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Separator */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              {language === "fr" ? "Pièces & Accessoires" : "Parts & Accessories"}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === "fr" ? "Pneus & Chambres à air" : "Tires & Inner Tubes"}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {language === "fr"
                ? "Pneus et chambres à air pour vélos et trottinettes électriques. Livraison rapide."
                : "Tires and inner tubes for electric bikes and scooters. Fast delivery."}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(ACCESSORY_CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setAccessoryFilter(key)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                  accessoryFilter === key
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "bg-white text-gray-600 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {label[language]}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-gray-500 text-sm mb-6 text-center">
            {filteredAccessories.length}{" "}
            {language === "fr"
              ? filteredAccessories.length > 1 ? "produits" : "produit"
              : filteredAccessories.length > 1 ? "products" : "product"}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAccessories.map((accessory) => (
              <AccessoryCard key={accessory.id} accessory={accessory} />
            ))}
          </div>
        </div>
      </section>

      {/* Used Bikes Section */}
      {(usedBikes.length > 0 || usedBikesLoading) && (
        <section id="occasion" className="py-16 bg-gray-50 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Separator */}
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
                {t.usedBikes?.sectionBadge || "Bonnes affaires"}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.usedBikes?.sectionTitle || "Vélos d'occasion"}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                {t.usedBikes?.sectionDescription ||
                  "Des vélos révisés et garantis à prix réduit. Chaque vélo est vérifié par notre atelier avant la mise en vente."}
              </p>
            </div>

            {/* Loading */}
            {usedBikesLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Grid */}
            {!usedBikesLoading && usedBikes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {usedBikes.map((bike) => (
                  <UsedBikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            )}

            {/* Empty (after load) */}
            {!usedBikesLoading && usedBikes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {t.usedBikes?.noBikes || "Aucun vélo d'occasion disponible pour le moment."}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <CTASection />
      <ContactSection />
    </div>
  );
};

export default VentePage;
