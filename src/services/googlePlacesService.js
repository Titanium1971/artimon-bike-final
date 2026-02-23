let googleMapsScriptPromise = null;

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-sdk";

const getConfig = () => ({
  apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
  placeId: process.env.REACT_APP_GOOGLE_PLACE_ID,
});

const loadGoogleMapsPlacesSdk = async (apiKey) => {
  if (typeof window === "undefined") {
    throw new Error("Google Places SDK can only run in browser");
  }

  if (window.google?.maps?.places) {
    return window.google;
  }

  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.google));
        existing.addEventListener("error", () => reject(new Error("Google Maps SDK failed to load")));
        return;
      }

      const script = document.createElement("script");
      script.id = GOOGLE_MAPS_SCRIPT_ID;
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Google Maps SDK failed to load"));
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptPromise;
};

const normalizeReviewDate = (review) => {
  if (review.relative_time_description) {
    return review.relative_time_description;
  }

  if (typeof review.time === "number") {
    return new Date(review.time * 1000).toLocaleDateString("fr-FR");
  }

  return "";
};

const normalizeRestReviewDate = (publishTime) => {
  if (!publishTime) {
    return "";
  }

  try {
    return new Date(publishTime).toLocaleDateString("fr-FR");
  } catch (error) {
    return "";
  }
};

export const fetchGooglePlaceReviewsRest = async () => {
  const { apiKey, placeId } = getConfig();
  if (!apiKey || !placeId) {
    return null;
  }

  const placeResourceName = placeId.startsWith("places/") ? placeId : `places/${placeId}`;
  const endpoint =
    `https://places.googleapis.com/v1/${placeResourceName}` +
    `?languageCode=fr&fields=rating,userRatingCount,reviews,googleMapsUri&key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Places REST failed with status ${response.status}`);
  }

  const data = await response.json();
  const normalizedReviews = (data.reviews || []).slice(0, 6).map((review) => ({
    author_name: review.authorAttribution?.displayName || "Client",
    rating: review.rating || 0,
    text: review.originalText?.text || review.text?.text || "",
    time: review.relativePublishTimeDescription || normalizeRestReviewDate(review.publishTime),
  }));

  return {
    source: "google-places-rest",
    rating: data.rating,
    total_reviews: data.userRatingCount,
    google_url: data.googleMapsUri,
    reviews: normalizedReviews,
  };
};

export const fetchGooglePlaceReviewsDirect = async () => {
  const { apiKey, placeId } = getConfig();
  if (!apiKey || !placeId) {
    return null;
  }

  const google = await loadGoogleMapsPlacesSdk(apiKey);

  return new Promise((resolve, reject) => {
    const placesService = new google.maps.places.PlacesService(document.createElement("div"));

    placesService.getDetails(
      {
        placeId,
        fields: ["rating", "user_ratings_total", "reviews", "url"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          reject(new Error(`Google Places status: ${status}`));
          return;
        }

        const normalizedReviews = (place.reviews || []).slice(0, 6).map((review) => ({
          author_name: review.author_name || "Client",
          rating: review.rating || 0,
          text: review.text || "",
          time: normalizeReviewDate(review),
        }));

        resolve({
          source: "google-places-direct",
          rating: place.rating,
          total_reviews: place.user_ratings_total,
          google_url: place.url,
          reviews: normalizedReviews,
        });
      }
    );
  });
};
