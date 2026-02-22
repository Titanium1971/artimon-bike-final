import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

// Track if GA is already initialized
let gaInitialized = false;

// Initialize GA4
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.log('Google Analytics not configured (REACT_APP_GA_MEASUREMENT_ID missing)');
    return false;
  }

  if (gaInitialized) {
    console.log('Google Analytics already initialized');
    return true;
  }

  // Add gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  gaInitialized = true;
  console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
  return true;
};

// Track page view
export const trackPageView = (path, title) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title
  });
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Track conversions
export const trackConversion = (conversionType, details = {}) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  
  window.gtag('event', 'conversion', {
    send_to: GA_MEASUREMENT_ID,
    conversion_type: conversionType,
    ...details
  });
};

// Analytics Provider Component
const GoogleAnalytics = () => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check and init GA based on cookie consent
  const checkAndInitGA = useCallback(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent) {
      try {
        const consent = JSON.parse(cookieConsent);
        if (consent.accepted && consent.preferences?.analytics !== false) {
          const success = initGA();
          setIsInitialized(success);
          return success;
        }
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
    return false;
  }, []);

  useEffect(() => {
    // Initial check
    checkAndInitGA();

    // Listen for storage changes (when user accepts cookies)
    const handleStorageChange = (e) => {
      if (e.key === 'cookieConsent') {
        checkAndInitGA();
      }
    };

    // Listen for custom event from CookieConsent component
    const handleConsentChange = () => {
      checkAndInitGA();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cookieConsentChanged', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, [checkAndInitGA]);

  useEffect(() => {
    // Track page views when initialized
    if (isInitialized) {
      trackPageView(location.pathname + location.search, document.title);
    }
  }, [location, isInitialized]);

  return null;
};

export default GoogleAnalytics;
