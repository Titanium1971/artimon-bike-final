import { useLanguage } from "../../contexts/LanguageContext";
import { GlobeIcon } from "../../icons";

export const LanguageSwitcher = ({ isScrolled = false }) => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
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
