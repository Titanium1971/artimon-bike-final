import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { API_URL, BUSINESS_INFO } from "../../constants";
import { fetchGooglePlaceReviewsDirect, fetchGooglePlaceReviewsRest } from "../../services/googlePlacesService";

export const ReviewsSection = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(BUSINESS_INFO.rating);
  const [totalReviews, setTotalReviews] = useState(BUSINESS_INFO.reviewCount);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(BUSINESS_INFO.googleReviewUrl);
  const [dataSource, setDataSource] = useState("fallback");

  useEffect(() => {
    const fetchReviews = async () => {
      let hasLoadedDynamicData = false;

      try {
        const googleRestData = await fetchGooglePlaceReviewsRest();
        if (googleRestData && (googleRestData.total_reviews || googleRestData.rating)) {
          if (googleRestData?.reviews?.length) {
            setReviews(googleRestData.reviews);
          }
          setRating(googleRestData.rating || BUSINESS_INFO.rating);
          setTotalReviews(googleRestData.total_reviews || BUSINESS_INFO.reviewCount);
          if (googleRestData.google_url) {
            setGoogleReviewUrl(googleRestData.google_url);
          }
          setLastUpdated(new Date());
          setDataSource("google-live");
          hasLoadedDynamicData = true;
        }
      } catch (error) {
        console.warn("Google Places REST unavailable:", error?.message || error);
      }

      if (!hasLoadedDynamicData) {
        try {
          const googleData = await fetchGooglePlaceReviewsDirect();
          if (googleData && (googleData.total_reviews || googleData.rating)) {
            if (googleData?.reviews?.length) {
              setReviews(googleData.reviews);
            }
            setRating(googleData.rating || BUSINESS_INFO.rating);
            setTotalReviews(googleData.total_reviews || BUSINESS_INFO.reviewCount);
            if (googleData.google_url) {
              setGoogleReviewUrl(googleData.google_url);
            }
            setLastUpdated(new Date());
            setDataSource("google-live");
            hasLoadedDynamicData = true;
          }
        } catch (error) {
          console.warn("Google Places JS SDK unavailable:", error?.message || error);
        }
      }

      if (!hasLoadedDynamicData) {
        try {
          const response = await fetch(`${API_URL}/api/reviews`);
          if (response.ok) {
            const data = await response.json();
            setReviews(data.reviews || []);
            setRating(data.rating || BUSINESS_INFO.rating);
            setTotalReviews(data.total_reviews || data.stats?.total_reviews || BUSINESS_INFO.reviewCount);
            if (data.google_url) {
              setGoogleReviewUrl(data.google_url);
            }
            setLastUpdated(new Date());
            setDataSource("backend-live");
            hasLoadedDynamicData = true;
          }
        } catch (error) {
          console.log("Using fallback reviews");
        }
      }

      if (!hasLoadedDynamicData) {
        setDataSource("fallback");
        setGoogleReviewUrl(BUSINESS_INFO.googleReviewUrl);
        setRating(BUSINESS_INFO.rating);
        setTotalReviews(BUSINESS_INFO.reviewCount);
        setLastUpdated(new Date());
        console.warn("Dynamic review fetch failed: REST + SDK + backend.");
      }

      setLoading(false);
    };

    fetchReviews();
    const intervalId = window.setInterval(fetchReviews, 15 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  const displayReviews = reviews.length > 0 ? reviews.map((r, i) => ({
    name: r.author_name,
    initials: r.author_name.split(' ').map(n => n[0]).join(''),
    date: r.time,
    rating: r.rating,
    text: r.text,
    type: r.rating >= 4 ? 'positive' : 'neutral',
    highlight: r.rating === 5 ? "Excellent !" : "Bon avis"
  })) : t.reviews.reviewsList;

  return (
    <section className="py-24 bg-white" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.reviews.title} <span className="text-orange-500">{t.reviews.titleHighlight}</span> {t.reviews.titleEnd}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.reviews.description}</p>
          {loading && <div className="mt-4 text-orange-500">Chargement des avis...</div>}
          {!loading && lastUpdated && (
            <div className="mt-3 text-xs text-gray-500">
              Mis a jour {dataSource === "fallback" ? "locale" : "en direct"}: {lastUpdated.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} ({dataSource === "google-live" ? "source: Google live" : dataSource === "backend-live" ? "source: backend" : "source: locale"})
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 p-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900">{rating}</div>
            <div className="flex justify-center mt-2">{renderStars(Math.round(rating))}</div>
            <div className="text-sm text-gray-500 mt-2">{t.reviews.rating}</div>
          </div>
          <div className="h-20 w-px bg-orange-200 hidden md:block"></div>
          <div className="text-center md:text-left">
            <div className="text-2xl font-semibold text-gray-900">{totalReviews}</div>
            <div className="text-gray-500">{t.reviews.basedOn}</div>
            <a 
              href={googleReviewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white border border-orange-200 rounded-full text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium"
              data-testid="leave-review-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              {t.reviews.leaveReview}
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {displayReviews.slice(0, 6).map((review, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${
                review.type === 'positive' ? 'border-green-500' : 'border-yellow-500'
              }`}
              data-testid={`review-card-${index}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  review.type === 'positive' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                }`}>
                  {review.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                "{review.text}"
              </p>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                review.type === 'positive' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {review.type === 'positive' ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                )}
                {review.highlight}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {t.reviews.verifiedReview}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </span>
            <h3 className="text-2xl font-bold">{t.reviews.strongPoints}</h3>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {t.reviews.analysis.positive.map((point, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                <span className="text-white/95 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
