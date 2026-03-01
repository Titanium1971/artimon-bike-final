import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { BUSINESS_INFO } from "../../constants";
import { PhoneIcon, MenuIcon, CloseIcon, WhatsAppIcon } from "../../icons";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export const Navigation = () => {
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Détecte si on est sur la page d'accueil (seule page avec hero sombre)
  const isHomePage = location.pathname === "/";
  
  // Le menu doit être en mode "sombre sur clair" si :
  // - On n'est PAS sur la page d'accueil, OU
  // - On a scrollé
  const shouldShowDarkNav = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  const prefix = language === "en" ? "/en" : "";
  const navLinks = [
    { name: t.nav.home, path: language === "en" ? "/en/" : "/" },
    { name: t.nav.rental, path: `${prefix}/location` },
    { name: t.nav.repair, path: `${prefix}/reparation` },
    { name: t.nav.sale, path: `${prefix}/vente` },
    { name: t.nav.routes, path: `${prefix}/parcours` },
    { name: t.nav.prices, path: `${prefix}/tarifs` },
    { name: t.nav.blog, path: `${prefix}/blog` },
    { name: t.nav.contact, path: `${prefix}/contact` },
  ];

  const handleLogoClick = (e) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${shouldShowDarkNav ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`} data-testid="main-navigation">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3" data-testid="logo-link">
              <img 
                src="/logo.svg" 
                alt="Artimon Bike Logo" 
                className="w-12 h-12 object-contain"
                width="48"
                height="48"
                decoding="async"
                style={{ filter: shouldShowDarkNav ? 'none' : 'brightness(0) invert(1)' }}
              />
              <div>
                <span className={`text-xl font-bold ${shouldShowDarkNav ? "text-gray-900" : "text-white"}`}>Artimon Bike</span>
                <p className={`text-xs ${shouldShowDarkNav ? "text-gray-500" : "text-white/70"}`}>Marseillan</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const activeClass = isActive ? (shouldShowDarkNav ? "text-orange-500" : "text-white") : "";
                return (
                <Link key={link.path} to={link.path} className={`nav-link font-medium transition-colors ${shouldShowDarkNav ? "text-gray-700 hover:text-orange-500" : "text-white hover:text-orange-300"} ${activeClass}`}>
                  {link.name}
                </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <LanguageSwitcher isScrolled={shouldShowDarkNav} />
              <a href={BUSINESS_INFO.phoneLink} className={`flex items-center gap-2 font-medium ${shouldShowDarkNav ? "text-gray-700" : "text-white"}`}>
                <PhoneIcon className="w-5 h-5" />
                {BUSINESS_INFO.phone}
              </a>
              <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-2.5 rounded-xl text-white font-semibold" data-testid="reservation-cta">
                {t.nav.book}
              </a>
            </div>

            <div className="flex lg:hidden items-center gap-3">
              <LanguageSwitcher isScrolled={shouldShowDarkNav} />
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 rounded-lg ${shouldShowDarkNav ? "text-gray-900" : "text-white"}`} data-testid="mobile-menu-btn" aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[999] lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl">
              <div className="p-6 pt-24">
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link key={link.path} to={link.path} className={`block py-3 px-4 rounded-lg font-medium transition-colors ${location.pathname === link.path ? "bg-orange-50 text-orange-500" : "text-gray-700 hover:bg-gray-50"}`}>
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 space-y-4">
                  <a href={BUSINESS_INFO.phoneLink} className="flex items-center gap-3 py-3 px-4 text-gray-700">
                    <PhoneIcon className="w-5 h-5 text-orange-500" />
                    {BUSINESS_INFO.phone}
                  </a>
                  <a href={BUSINESS_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3 px-4 text-gray-700">
                    <WhatsAppIcon className="w-5 h-5 text-green-500" />
                    WhatsApp
                  </a>
                  <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="block w-full btn-primary py-3 px-4 rounded-xl text-white font-semibold text-center">
                    {t.nav.book}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      
    </>
  );
};

export default Navigation;
