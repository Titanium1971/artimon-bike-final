import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('artimon-language');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('artimon-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];
  const toggleLanguage = () => setLanguage(prev => prev === 'fr' ? 'en' : 'fr');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
