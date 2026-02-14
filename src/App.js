import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Context & Layout
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { CookieConsent } from "./components/ui/CookieConsent";
import GoogleAnalytics from "./components/GoogleAnalytics";

// Pages
import {
  HomePage,
  LocationPage,
  ReparationPage,
  VentePage,
  BikePathsPage,
  TarifsPage,
  ContactPage,
  FAQPage,
  BlogPage,
  ArticlePage,
  AdminPage,
  MentionsLegalesPage,
  PolitiqueConfidentialitePage,
  NotFoundPage
} from "./pages";

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

// Main App
function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const cookieChoice = localStorage.getItem("cookieConsent");
    if (!cookieChoice) {
      setTimeout(() => setShowCookieConsent(true), 1500);
    }
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
          <GoogleAnalytics />
          <Navigation />
          <main>
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
          </main>
          <Footer />
          {showCookieConsent && <CookieConsent onAccept={handleCookieAccept} onReject={handleCookieReject} />}
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
