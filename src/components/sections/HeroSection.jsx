import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { BUSINESS_INFO } from "../../constants";
import { StarIcon, ChevronDownIcon } from "../../icons";
import { useLiveGoogleReviewStats } from "../../hooks/useLiveGoogleReviewStats";

export const HeroSection = () => {
  const { t } = useLanguage();
  const { rating, totalReviews, googleReviewUrl } = useLiveGoogleReviewStats();
  
  return (
    <section className="relative min-h-screen flex items-center" data-testid="hero-section">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 -right-28 w-72 h-72 bg-orange-500/10 rounded-full blur-xl" />
        <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-blue-500/10 rounded-full blur-xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge with animation */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-300 text-sm font-medium">{t.hero.badge}</span>
            </div>
            
            {/* Title with animation */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {t.hero.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{t.hero.titleHighlight}</span>{" "}
              {t.hero.titleEnd}
            </h1>
            
            {/* Description with animation */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>{t.hero.description}</p>

            {/* Buttons with animation */}
            <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-shine px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2 hover-glow" data-testid="hero-reservation-btn">
                <img src="/logo.svg" alt="" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} width="24" height="24" decoding="async" />
                Réserver sur la plateforme
              </a>
              <Link to="/tarifs" className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2 hover:scale-105" data-testid="hero-tarifs-btn">
                {t.hero.pricesBtn}
              </Link>
            </div>

            {/* Reviews with animation */}
            <div className="flex items-center gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className={`w-5 h-5 ${star <= Math.floor(rating) ? "text-yellow-400" : "text-gray-500"}`} filled={star <= Math.floor(rating)} />
                ))}
              </div>
              <span className="text-white font-semibold">{rating}/5</span>
              <a href={googleReviewUrl || BUSINESS_INFO.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors link-underline">
                ({totalReviews} {t.hero.reviews})
              </a>
            </div>
          </div>

          {/* Image section with animation */}
          <div className="hidden lg:block animate-fade-in-right opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-lg opacity-20 transform rotate-2" />
              <div className="img-zoom rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=400&fit=crop&q=60&auto=format" alt="Vélo électrique Artimon Bike" className="relative rounded-3xl shadow-2xl w-full object-cover" loading="lazy" decoding="async" width="500" height="400" />
              </div>
              
              {/* Floating card with animation */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold">{t.hero.electricBikes}</p>
                    <p className="text-gray-500 text-sm">{t.hero.fromPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with bounce animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDownIcon className="w-8 h-8 text-white/50" />
      </div>
    </section>
  );
};

export default HeroSection;
