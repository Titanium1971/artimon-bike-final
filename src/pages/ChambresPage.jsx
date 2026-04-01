import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import AccessoryCard from "../components/bikes/AccessoryCard";
import { chambres } from "../data/accessories";

const ChambresPage = () => {
  const { language } = useLanguage();
  const prefix = language === "en" ? "/en" : "";
  const [search, setSearch] = useState("");

  useSEO({
    title: language === "fr"
      ? "Chambres à air vélo & trottinette | Artimon Bike"
      : "Inner tubes bike & scooter | Artimon Bike",
    description: language === "fr"
      ? "Chambres à air pour vélos et trottinettes électriques. Standard et premium renforcées anti-crevaison."
      : "Inner tubes for electric bikes and scooters. Standard and premium puncture-resistant.",
    canonical: `https://www.artimonbike.com${prefix}/vente/chambres-a-air`,
  });

  const filtered = search
    ? chambres.filter((p) =>
        p.name.fr.toLowerCase().includes(search.toLowerCase()) ||
        p.specs.size?.toLowerCase().includes(search.toLowerCase()) ||
        p.reference.toLowerCase().includes(search.toLowerCase())
      )
    : chambres;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <Link
              to={`${prefix}/vente`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm mb-6 transition-colors"
            >
              &larr; {language === "fr" ? "Retour à la vente" : "Back to shop"}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-orange-500">
                {language === "fr" ? "Chambres à air" : "Inner Tubes"}
              </span>{" "}
              {language === "fr" ? "vélo & trottinette" : "bike & scooter"}
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              {language === "fr"
                ? `${chambres.length} chambres à air disponibles — standard et premium renforcées`
                : `${chambres.length} inner tubes available — standard and premium reinforced`}
            </p>
          </div>
        </div>
      </section>

      {/* Search + Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="max-w-md mx-auto mb-10">
            <input
              type="text"
              placeholder={language === "fr" ? "Rechercher par taille, marque..." : "Search by size, brand..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm"
            />
          </div>

          {/* Count */}
          <p className="text-gray-500 text-sm mb-6 text-center">
            {filtered.length} {language === "fr" ? "chambres à air" : "inner tubes"}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((accessory) => (
              <AccessoryCard key={accessory.id} accessory={accessory} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400">
                {language === "fr" ? "Aucune chambre à air trouvée." : "No inner tubes found."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChambresPage;
