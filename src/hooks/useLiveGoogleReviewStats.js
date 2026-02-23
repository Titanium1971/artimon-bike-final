import { useEffect, useState } from "react";
import { BUSINESS_INFO } from "../constants";
import { fetchGooglePlaceReviewsDirect, fetchGooglePlaceReviewsRest } from "../services/googlePlacesService";

export const useLiveGoogleReviewStats = () => {
  const [rating, setRating] = useState(BUSINESS_INFO.rating);
  const [totalReviews, setTotalReviews] = useState(BUSINESS_INFO.reviewCount);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(BUSINESS_INFO.googleReviewUrl);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const restData = await fetchGooglePlaceReviewsRest();
        if (!isMounted) return;

        if (restData?.rating) {
          setRating(restData.rating);
        }
        if (restData?.total_reviews) {
          setTotalReviews(restData.total_reviews);
        }
        if (restData?.google_url) {
          setGoogleReviewUrl(restData.google_url);
        }
        return;
      } catch (error) {
        // Continue with JS SDK fallback.
      }

      try {
        const sdkData = await fetchGooglePlaceReviewsDirect();
        if (!isMounted) return;

        if (sdkData?.rating) {
          setRating(sdkData.rating);
        }
        if (sdkData?.total_reviews) {
          setTotalReviews(sdkData.total_reviews);
        }
        if (sdkData?.google_url) {
          setGoogleReviewUrl(sdkData.google_url);
        }
      } catch (error) {
        // Keep static constants fallback.
      }
    };

    loadStats();
    const intervalId = window.setInterval(loadStats, 15 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return { rating, totalReviews, googleReviewUrl };
};

export default useLiveGoogleReviewStats;
