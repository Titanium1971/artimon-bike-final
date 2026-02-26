import { useEffect, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA, BUSINESS_INFO } from "../constants";
import { CheckIcon } from "../icons";
import { PricingSection, CTASection } from "../components/sections";

const LocationPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.location[language].title,
    description: SEO_DATA.location[language].description,
    keywords: SEO_DATA.location[language].keywords,
    canonical: "https://www.artimonbike.com/location"
  });
  
  const bikes = Object.entries(t.rentalPage.bikes).map(([key, value]) => ({
    ...value,
    image: {
      child: "https://images.pexels.com/photos/14576823/pexels-photo-14576823.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      vtc: "https://images.pexels.com/photos/2224696/pexels-photo-2224696.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      mtb: "https://images.pexels.com/photos/16066068/pexels-photo-16066068.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      electric: "https://images.pexels.com/photos/13633045/pexels-photo-13633045.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      electricMtb: "https://images.pexels.com/photos/27368838/pexels-photo-27368838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      tandem: "https://images.pexels.com/photos/17169173/pexels-photo-17169173.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    }[key]
  }));

  const productSchema = useMemo(() => {
    const baseUrl = language === "en" ? "https://www.artimonbike.com/en/location" : "https://www.artimonbike.com/location";
    const parsePrice = (value) => {
      const normalized = String(value || "").replace(",", ".").match(/[0-9]+(?:\.[0-9]+)?/);
      return normalized ? normalized[0] : "0";
    };

    return {
      "@context": "https://schema.org",
      "@graph": bikes.map((bike) => ({
        "@type": "Product",
        name: bike.name,
        image: [bike.image],
        description: bike.features?.join(", "),
        brand: {
          "@type": "Brand",
          name: "Artimon Bike"
        },
        category: language === "en" ? "Bike rental" : "Location de vélo",
        sku: bike.name.toLowerCase().replace(/\s+/g, "-"),
        offers: {
          "@type": "Offer",
          url: baseUrl,
          priceCurrency: "EUR",
          price: parsePrice(bike.price),
          availability: "https://schema.org/InStock",
          eligibleRegion: {
            "@type": "Country",
            name: "FR"
          },
          seller: {
            "@type": "LocalBusiness",
            name: "Artimon Bike"
          }
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(BUSINESS_INFO.rating),
          reviewCount: String(BUSINESS_INFO.reviewCount)
        }
      }))
    };
  }, [bikes, language]);

  useEffect(() => {
    const scriptId = "location-products-jsonld";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(productSchema);

    return () => {
      const current = document.getElementById(scriptId);
      if (current) current.remove();
    };
  }, [productSchema]);

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.rentalPage.title} <span className="text-orange-500">{t.rentalPage.titleHighlight}</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.rentalPage.description}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bikes.map((bike, index) => (
              <div key={bike.name} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden"><img src={bike.image} alt={bike.name} className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="300" /></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{bike.name}</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 font-semibold rounded-full text-sm">{bike.price}{t.rentalPage.perDay}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {bike.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><CheckIcon className="w-4 h-4 text-orange-500" />{feature}</li>
                    ))}
                  </ul>
                  <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="block w-full btn-primary py-3 rounded-xl text-white font-semibold text-center">{t.rentalPage.book}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PricingSection />
      <CTASection />
    </div>
  );
};

export default LocationPage;
