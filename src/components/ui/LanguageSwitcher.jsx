import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { GlobeIcon } from "../../icons";

export const LanguageSwitcher = ({ isScrolled = false }) => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const localFrToEn = {
    "/location-velo-marseillan": "/en/bike-rental-marseillan",
    "/location-velo-agde": "/en/bike-rental-agde",
    "/location-velo-sete": "/en/bike-rental-sete",
    "/location-velo-meze": "/en/bike-rental-meze"
  };
  const localEnToFr = Object.fromEntries(
    Object.entries(localFrToEn).map(([frPath, enPath]) => [enPath, frPath])
  );

  const switchLanguage = () => {
    const targetLanguage = language === "fr" ? "en" : "fr";
    const { pathname, search, hash } = location;
    let targetPath = pathname;

    if (targetLanguage === "en") {
      if (pathname in localFrToEn) {
        targetPath = localFrToEn[pathname];
      } else if (pathname === "/") {
        targetPath = "/en/";
      } else if (!pathname.startsWith("/en")) {
        targetPath = `/en${pathname}`;
      }
    } else {
      if (pathname in localEnToFr) {
        targetPath = localEnToFr[pathname];
      } else if (pathname === "/en" || pathname === "/en/") {
        targetPath = "/";
      } else if (pathname.startsWith("/en/")) {
        targetPath = pathname.replace(/^\/en/, "") || "/";
      }
    }

    setLanguage(targetLanguage);
    navigate(`${targetPath}${search}${hash}`);
  };
  
  return (
    <button
      onClick={switchLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
        isScrolled 
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
          : "bg-white/10 hover:bg-white/20 text-white"
      }`}
      data-testid="language-switcher"
      title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <GlobeIcon className="w-4 h-4" />
      <span className="text-sm font-medium uppercase">{language === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  );
};

export default LanguageSwitcher;
