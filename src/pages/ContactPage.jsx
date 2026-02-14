import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import { ContactSection } from "../components/sections";

const ContactPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.contact[language].title,
    description: SEO_DATA.contact[language].description,
    keywords: SEO_DATA.contact[language].keywords,
    canonical: "https://www.artimonbike.com/contact"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-orange-500">{t.contact.title}</span>{t.contact.titleHighlight}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.contact.description}</p>
          </div>
        </div>
      </section>
      <ContactSection />
    </div>
  );
};

export default ContactPage;
