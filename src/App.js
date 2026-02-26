import { useState, useEffect, Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Context & Layout
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { CookieConsent } from "./components/ui/CookieConsent";

// Pages - lazy loaded to reduce initial bundle
const HomePage = lazy(() => import("./pages/HomePage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const ReparationPage = lazy(() => import("./pages/ReparationPage"));
const VentePage = lazy(() => import("./pages/VentePage"));
const BikePathsPage = lazy(() => import("./pages/BikePathsPage"));
const TarifsPage = lazy(() => import("./pages/TarifsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const LocationAreaPage = lazy(() => import("./pages/LocationAreaPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const GoogleAnalytics = lazy(() => import("./components/GoogleAnalytics"));

// Redirects configuration
import { REDIRECTS } from "./constants";

// SEO-friendly redirect handler
const RedirectHandler = () => {
  const location = useLocation();
  const redirectTo = REDIRECTS[location.pathname.toLowerCase()];
  
  if (redirectTo) {
    console.log(`[SEO Redirect 301] ${location.pathname} → ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }
  
  return null;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};


// Force language for a route (used for /en/* paths)
const WithLang = ({ lang, children }) => {
  const { setLanguage } = useLanguage();
  useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);
  return children;
};

// Main App
function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    const cookieChoice = localStorage.getItem("cookieConsent");
    return !cookieChoice;
  });
  const [gaEnabled, setGaEnabled] = useState(() => {
    const cookieChoice = localStorage.getItem("cookieConsent");
    if (!cookieChoice) return false;
    try {
      const parsed = JSON.parse(cookieChoice);
      return Boolean(parsed.accepted && parsed.preferences?.analytics !== false);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const refreshGaState = () => {
      const cookieChoice = localStorage.getItem("cookieConsent");
      if (!cookieChoice) {
        setGaEnabled(false);
        return;
      }
      try {
        const parsed = JSON.parse(cookieChoice);
        setGaEnabled(Boolean(parsed.accepted && parsed.preferences?.analytics !== false));
      } catch {
        setGaEnabled(false);
      }
    };

    window.addEventListener("cookieConsentChanged", refreshGaState);
    window.addEventListener("storage", refreshGaState);
    return () => {
      window.removeEventListener("cookieConsentChanged", refreshGaState);
      window.removeEventListener("storage", refreshGaState);
    };
  }, []);

  const handleCookieAccept = (preferences) => {
    localStorage.setItem("cookieConsent", JSON.stringify({ accepted: true, preferences }));
    setShowCookieConsent(false);
  };

  const handleCookieReject = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({ accepted: false }));
    setShowCookieConsent(false);
  };

  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <RedirectHandler />
          <Suspense fallback={null}>
            {gaEnabled && <GoogleAnalytics />}
          </Suspense>
          <Navigation />
          <main>
            <Suspense fallback={<div style={{ minHeight: "100vh" }} aria-hidden="true" />}>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/reparation" element={<ReparationPage />} />
              <Route path="/vente" element={<VentePage />} />
              <Route path="/parcours" element={<BikePathsPage />} />
              <Route path="/tarifs" element={<TarifsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />
              {/* Local SEO landing pages (FR) */}
              <Route path="/location-velo-:slug" element={<LocationAreaPage />} />
              {/* English Routes (/en/*) */}
              <Route path="/en" element={<WithLang lang="en"><HomePage /></WithLang>} />
              <Route path="/en/" element={<WithLang lang="en"><HomePage /></WithLang>} />
              <Route path="/en/location" element={<WithLang lang="en"><LocationPage /></WithLang>} />
              <Route path="/en/reparation" element={<WithLang lang="en"><ReparationPage /></WithLang>} />
              <Route path="/en/vente" element={<WithLang lang="en"><VentePage /></WithLang>} />
              <Route path="/en/parcours" element={<WithLang lang="en"><BikePathsPage /></WithLang>} />
              <Route path="/en/tarifs" element={<WithLang lang="en"><TarifsPage /></WithLang>} />
              <Route path="/en/contact" element={<WithLang lang="en"><ContactPage /></WithLang>} />
              <Route path="/en/faq" element={<WithLang lang="en"><FAQPage /></WithLang>} />
              <Route path="/en/blog" element={<WithLang lang="en"><BlogPage /></WithLang>} />
              <Route path="/en/blog/:slug" element={<WithLang lang="en"><ArticlePage /></WithLang>} />
              {/* Local SEO landing pages (EN) */}
              <Route path="/en/bike-rental-:slug" element={<WithLang lang="en"><LocationAreaPage /></WithLang>} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
              
              {/* Legacy URL Redirects (301) */}
              <Route path="/bike-routes" element={<Navigate to="/parcours" replace />} />
              <Route path="/routes" element={<Navigate to="/parcours" replace />} />
              <Route path="/nos-tarifs" element={<Navigate to="/tarifs" replace />} />
              <Route path="/donnees-personnelles" element={<Navigate to="/politique-confidentialite" replace />} />
              <Route path="/balise-h1" element={<Navigate to="/" replace />} />
              <Route path="/h1" element={<Navigate to="/" replace />} />
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/accueil" element={<Navigate to="/" replace />} />
              <Route path="/rental" element={<Navigate to="/location" replace />} />
              <Route path="/repair" element={<Navigate to="/reparation" replace />} />
              <Route path="/sale" element={<Navigate to="/vente" replace />} />
              <Route path="/prices" element={<Navigate to="/tarifs" replace />} />
              <Route path="/vente-velos-trottinettes" element={<Navigate to="/vente" replace />} />
              <Route path="/louer-velo-marseillan" element={<Navigate to="/location" replace />} />
              <Route path="/reparateur-velo-marseillan" element={<Navigate to="/reparation" replace />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
          </main>
          <Footer />
          {showCookieConsent && <CookieConsent onAccept={handleCookieAccept} onReject={handleCookieReject} />}
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
