import { useLanguage } from "../../contexts/LanguageContext";

export const CitiesSection = () => {
  const { language } = useLanguage();
  
  const cities = [
    {
      name: "Marseillan",
      description: language === 'fr' 
        ? "Notre base principale, au cœur du port" 
        : "Our main base, in the heart of the port",
      color: "from-blue-500 to-blue-600",
      url: "https://www.marseillan-tourisme.com/",
      emblem: (
        <svg viewBox="0 0 100 120" className="w-20 h-24">
          <defs>
            <linearGradient id="marseillan-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d="M50 5 L95 25 L95 75 Q95 110 50 115 Q5 110 5 75 L5 25 Z" fill="url(#marseillan-bg)" stroke="#fbbf24" strokeWidth="3"/>
          <circle cx="50" cy="50" r="20" fill="#fbbf24"/>
          <path d="M50 35 L55 45 L65 47 L58 55 L60 65 L50 60 L40 65 L42 55 L35 47 L45 45 Z" fill="#1e40af"/>
          <rect x="35" y="75" width="30" height="8" fill="#fbbf24" rx="2"/>
          <text x="50" y="95" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">⚓</text>
        </svg>
      ),
    },
    {
      name: "Agde",
      description: language === 'fr' 
        ? "La perle noire de la Méditerranée" 
        : "The black pearl of the Mediterranean",
      color: "from-gray-700 to-gray-900",
      url: "https://www.capdagde.com/",
      emblem: (
        <svg viewBox="0 0 100 120" className="w-20 h-24">
          <defs>
            <linearGradient id="agde-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
          </defs>
          <path d="M50 5 L95 25 L95 75 Q95 110 50 115 Q5 110 5 75 L5 25 Z" fill="url(#agde-bg)" stroke="#dc2626" strokeWidth="3"/>
          <path d="M30 40 L50 25 L70 40 L70 80 L30 80 Z" fill="#dc2626"/>
          <rect x="42" y="55" width="16" height="25" fill="#1f2937"/>
          <circle cx="50" cy="45" r="8" fill="#fbbf24"/>
          <path d="M25 85 L75 85" stroke="#dc2626" strokeWidth="4"/>
          <text x="50" y="100" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">AGDE</text>
        </svg>
      ),
    },
    {
      name: "Mèze",
      description: language === 'fr' 
        ? "Village typique au bord de l'étang de Thau" 
        : "Typical village on the Thau lagoon",
      color: "from-emerald-500 to-emerald-600",
      url: "https://www.thau-mediterranee.com/",
      emblem: (
        <svg viewBox="0 0 100 120" className="w-20 h-24">
          <defs>
            <linearGradient id="meze-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path d="M50 5 L95 25 L95 75 Q95 110 50 115 Q5 110 5 75 L5 25 Z" fill="url(#meze-bg)" stroke="#fbbf24" strokeWidth="3"/>
          <ellipse cx="50" cy="55" rx="30" ry="15" fill="#0ea5e9" opacity="0.7"/>
          <path d="M30 50 Q40 40 50 50 Q60 40 70 50" stroke="#fbbf24" strokeWidth="2" fill="none"/>
          <circle cx="35" cy="65" r="5" fill="#fbbf24"/>
          <circle cx="50" cy="70" r="5" fill="#fbbf24"/>
          <circle cx="65" cy="65" r="5" fill="#fbbf24"/>
          <text x="50" y="95" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">🦪</text>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden" data-testid="cities-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {language === 'fr' ? 'Nous desservons' : 'We serve'}
            <span className="text-orange-500"> 3 {language === 'fr' ? 'communes' : 'towns'}</span>
          </h2>
          <p className="text-gray-600">
            {language === 'fr' 
              ? "Découvrez l'Étang de Thau et ses trésors à vélo" 
              : "Discover the Thau Lagoon and its treasures by bike"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <a
              key={city.name}
              href={city.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group cursor-pointer block"
              data-testid={`city-card-${city.name.toLowerCase()}`}
            >
              <div className={`bg-gradient-to-br ${city.color} rounded-2xl p-6 text-white text-center shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-300`}>
                <div className="flex justify-center mb-4">
                  {city.emblem}
                </div>
                <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                <p className="text-white/80 text-sm">{city.description}</p>
                <p className="mt-3 text-xs text-white/60 flex items-center justify-center gap-1">
                  <span>🏛️</span>
                  <span>Office de tourisme</span>
                  <svg className="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700" />
              </div>
            </a>
          ))}
        </div>

        <div className="flex justify-center items-center mt-8 gap-4">
          <div className="text-3xl animate-bike-left">🚴</div>
          <div className="flex-1 max-w-xs h-1 bg-gradient-to-r from-blue-500 via-gray-700 to-emerald-500 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          </div>
          <div className="text-3xl transform scale-x-[-1] animate-bike-right">🚴</div>
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
