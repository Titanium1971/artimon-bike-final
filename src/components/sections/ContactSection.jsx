import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { API_URL, BUSINESS_INFO } from "../../constants";
import { PhoneIcon, MapPinIcon, ClockIcon, CheckIcon, WhatsAppIcon } from "../../icons";

export const ContactSection = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error('Contact form error:', error);
    }
    
    setIsSubmitting(false);
  };

  const whatsappMessage = encodeURIComponent("Bonjour Artimon Bike ! J'aimerais avoir des informations...");
  const whatsappUrl = `${BUSINESS_INFO.whatsappLink}?text=${whatsappMessage}`;

  return (
    <section className="py-24 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-orange-500">{t.contact.title}</span>{t.contact.titleHighlight}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.contact.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            {submitted ? (
              <div className="bg-green-50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.contact.form.success}</h3>
                <p className="text-gray-600 mb-4">{t.contact.form.successDesc}</p>
                <button onClick={() => setSubmitted(false)} className="text-orange-500 font-semibold">{t.contact.form.sendAnother}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.name} *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder={t.contact.form.namePlaceholder} data-testid="contact-name-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.email} *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder={t.contact.form.emailPlaceholder} data-testid="contact-email-input" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.phone}</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" placeholder={t.contact.form.phonePlaceholder} data-testid="contact-phone-input" />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.subject} *</label>
                    <select id="contact-subject" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all" data-testid="contact-subject-select">
                      <option value="">{t.contact.form.subjectPlaceholder}</option>
                      {t.contact.form.subjectOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.message} *</label>
                  <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none" placeholder={t.contact.form.messagePlaceholder} data-testid="contact-message-textarea" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" data-testid="contact-submit-btn">
                  {isSubmitting ? <span className="flex items-center justify-center gap-2"><div className="spinner w-5 h-5" />{t.contact.form.sending}</span> : t.contact.form.send}
                </button>
                
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all hover:scale-[1.02] shadow-lg"
                  data-testid="contact-whatsapp-link"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                  {t.contact.whatsappCta}
                </a>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="h-80 rounded-2xl overflow-hidden shadow-lg" data-testid="contact-map">
              {showMap ? (
                <iframe
                  src="https://maps.google.com/maps?q=Artimon+Bike+Nautique+Marseillan&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Artimon Bike Location"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6 text-center">
                  <div className="max-w-sm">
                    <p className="text-gray-700 font-medium mb-4">
                      {language === "fr" ? "Carte désactivée pour un chargement plus rapide." : "Map disabled initially for faster loading."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="px-5 py-3 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-semibold transition-colors"
                    >
                      {language === "fr" ? "Afficher la carte" : "Show map"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPinIcon className="w-6 h-6 text-orange-500" /></div>
                <div>
                  <p className="font-semibold text-gray-900">{t.contact.info.address}</p>
                  <p className="text-gray-600">{BUSINESS_INFO.address}</p>
                  <p className="text-gray-600">{BUSINESS_INFO.city}</p>
                  <a href={BUSINESS_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-orange-500 text-sm font-medium hover:underline">{t.contact.info.viewOnMaps}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0"><ClockIcon className="w-6 h-6 text-orange-500" /></div>
                <div>
                  <p className="font-semibold text-gray-900">{t.contact.info.hours}</p>
                  <p className="text-gray-600">{t.contact.info.hoursValue}</p>
                  <p className="text-gray-600 text-sm">{t.contact.info.hoursNote}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0"><PhoneIcon className="w-6 h-6 text-orange-500" /></div>
                <div>
                  <p className="font-semibold text-gray-900">{t.contact.info.phone}</p>
                  <a href={BUSINESS_INFO.phoneLink} className="text-orange-500 font-semibold hover:underline">{BUSINESS_INFO.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
