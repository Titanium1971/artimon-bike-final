import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { ChevronDownIcon } from "../../icons";

export const FAQSection = ({ showFull = false }) => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  const displayedFAQ = showFull ? t.faq.questions : t.faq.questions.slice(0, 4);

  return (
    <section className="py-24 bg-gray-50" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.faq.title} <span className="text-orange-500">{t.faq.titleHighlight}</span>
          </h2>
          <p className="text-gray-600">{t.faq.description}</p>
        </div>

        <div className="space-y-4">
          {displayedFAQ.map((faq, index) => (
            <div key={index} className="faq-item bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`faq-item-${index}`}>
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                <span className="font-semibold text-gray-900">{faq.q}</span>
                <ChevronDownIcon className={`w-5 h-5 text-orange-500 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              
              {openIndex === index && (
                <div>
                  <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showFull && (
          <div className="mt-8 text-center">
            <Link to="/faq" className="text-orange-500 font-semibold hover:text-orange-600 inline-flex items-center gap-2">
              {t.faq.seeAll}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
