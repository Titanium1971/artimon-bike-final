import { useEffect, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { SEO_DATA } from "../constants";
import { FAQSection, CTASection } from "../components/sections";

const FAQPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.faq[language].title,
    description: SEO_DATA.faq[language].description,
    keywords: SEO_DATA.faq[language].keywords,
    canonical: "https://www.artimonbike.com/faq"
  });

  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (t.faq.questions || []).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a
      }
    }))
  }), [t.faq.questions]);

  useEffect(() => {
    const scriptId = "faq-jsonld";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);
    return () => {
      const current = document.getElementById(scriptId);
      if (current) current.remove();
    };
  }, [faqSchema]);

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.faq.title} <span className="text-orange-500">{t.faq.titleHighlight}</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.faq.description}</p>
          </div>
        </div>
      </section>
      <FAQSection showFull />
      <CTASection />
    </div>
  );
};

export default FAQPage;
