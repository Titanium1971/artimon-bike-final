import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA, BUSINESS_INFO } from "../constants";
import { PhoneIcon } from "../icons";

const BikePathsPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.parcours[language].title,
    description: SEO_DATA.parcours[language].description,
    keywords: SEO_DATA.parcours[language].keywords,
    canonical: "https://www.artimonbike.com/parcours"
  });
  
  const [filterRoute, setFilterRoute] = useState('all');
  const routes = useMemo(() => t.bikePaths.routes || [], [t.bikePaths.routes]);

  useEffect(() => {
    // Keep filter valid when language switches and route sets differ.
    if (filterRoute !== 'all' && !routes.some((route) => route.id === parseInt(filterRoute, 10))) {
      setFilterRoute('all');
    }
  }, [filterRoute, routes]);

  const getDifficultyLabel = (difficulty) => {
    return t.bikePaths[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'veryEasy': return 'bg-green-100 text-green-700';
      case 'easy': return 'bg-blue-100 text-blue-700';
      case 'moderate': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRoutes = filterRoute === 'all'
    ? routes
    : routes.filter((r) => r.id === parseInt(filterRoute, 10));

  return (
    <div className="pt-20" data-testid="bike-paths-page">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t.bikePaths.title} <span className="text-orange-500">{t.bikePaths.titleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.bikePaths.description}</p>
          </div>
        </div>
      </section>

      {/* Map Section with Google Maps */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.bikePaths.mapTitle}</h2>
          
          {/* Route Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilterRoute('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterRoute === 'all' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
              }`}
              data-testid="filter-all"
            >
              {t.bikePaths.allRoutes}
            </button>
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setFilterRoute(route.id.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterRoute === route.id.toString() 
                    ? 'text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                }`}
                style={filterRoute === route.id.toString() ? { backgroundColor: route.color } : {}}
                data-testid={`filter-btn-${route.id}`}
              >
                {route.name}
              </button>
            ))}
          </div>

          {/* Google Maps Embed */}
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg" data-testid="bike-paths-map">
            <iframe
              src="https://maps.google.com/maps?q=Artimon+Bike+Nautique+Marseillan&t=&z=12&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={language === "fr" ? "Carte des parcours vélo" : "Bike routes map"}
            />
          </div>
        </div>
      </section>

      {/* Routes List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {filteredRoutes.map((route) => (
              <div 
                key={route.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4"
                style={{ borderLeftColor: route.color }}
                data-testid={`route-card-${route.id}`}
              >
                <div className="p-6 md:p-8">
                  {/* Header with number and title */}
                  <div className="flex items-center gap-4 mb-4">
                    <span 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.id}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{route.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-lg mb-6">{route.description}</p>
                  
                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📏</span>
                      <div>
                        <div className="text-sm text-gray-500">{t.bikePaths.distance}</div>
                        <div className="font-bold text-gray-900 text-lg">{route.distance}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⏱️</span>
                      <div>
                        <div className="text-sm text-gray-500">{t.bikePaths.duration}</div>
                        <div className="font-bold text-gray-900 text-lg">{route.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⛰️</span>
                      <div>
                        <div className="text-sm text-gray-500">{t.bikePaths.elevation}</div>
                        <div className="font-bold text-gray-900 text-lg">{route.elevation}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(route.difficulty)}`}>
                        {getDifficultyLabel(route.difficulty)}
                      </span>
                    </div>
                  </div>

                  {/* Points of Interest Tags */}
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-3">{t.bikePaths.pointsOfInterest}:</div>
                    <div className="flex flex-wrap gap-2">
                      {route.highlights.map((highlight, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Points of Interest Details */}
                  {route.pointsOfInterest && (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-700 mb-3">{t.bikePaths.toDiscover}:</div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {route.pointsOfInterest.map((poi, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl">{poi.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{poi.name}</div>
                              <div className="text-gray-500 text-xs">{poi.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start Point & Recommended Bike */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6 p-4 bg-orange-50 rounded-xl">
                    <div>
                      <span className="font-bold text-gray-900">{t.bikePaths.startPoint}:</span> {route.startPoint}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{t.bikePaths.recommendedBike}:</span> {route.recommendedBike}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={route.launchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 hover:scale-105"
                      style={{ backgroundColor: route.color }}
                      data-testid={`launch-btn-${route.id}`}
                    >
                      {t.bikePaths.launchItinerary}
                    </a>
                    <a
                      href={route.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2"
                      style={{ borderColor: route.color, color: route.color }}
                      data-testid={`view-btn-${route.id}`}
                    >
                      {t.bikePaths.viewOnMap}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t.bikePaths.tips}
            </h2>
            <ul className="space-y-4">
              {t.bikePaths.tipsContent.map((tip, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-lg">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.bikePaths.ctaTitle}</h2>
          <p className="text-white/90 text-lg mb-8">{t.bikePaths.ctaDescription}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={BUSINESS_INFO.lokkiUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all inline-flex items-center gap-2 shadow-lg"
              data-testid="parcours-cta-btn"
            >
              <img src="/logo.svg" alt="" className="w-6 h-6" />
              Réserver sur la plateforme
            </a>
            <a 
              href={BUSINESS_INFO.phoneLink} 
              className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 hover:scale-105 transition-all inline-flex items-center gap-2 backdrop-blur-sm"
            >
              <PhoneIcon className="w-5 h-5" />
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BikePathsPage;
