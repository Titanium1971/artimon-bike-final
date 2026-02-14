import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

export const CookieConsent = ({ onAccept, onReject }) => {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({ essential: true, analytics: true, marketing: false });

  const handleAccept = (prefs) => {
    onAccept(prefs);
    // Dispatch custom event for GoogleAnalytics component
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { accepted: true, preferences: prefs } }));
  };

  const handleReject = () => {
    onReject();
    // Dispatch custom event for GoogleAnalytics component
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { accepted: false } }));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1001] p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🍪</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.cookies.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{t.cookies.description}</p>
              
              {showDetails && (
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div><p className="font-semibold text-gray-900">{t.cookies.essential}</p><p className="text-xs text-gray-500">{t.cookies.essentialDesc}</p></div>
                    <input type="checkbox" checked disabled className="w-5 h-5 accent-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div><p className="font-semibold text-gray-900">{t.cookies.analytics}</p><p className="text-xs text-gray-500">{t.cookies.analyticsDesc}</p></div>
                    <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div><p className="font-semibold text-gray-900">{t.cookies.marketing}</p><p className="text-xs text-gray-500">{t.cookies.marketingDesc}</p></div>
                    <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleAccept(preferences)} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all" data-testid="cookie-accept-btn">{t.cookies.acceptAll}</button>
                <button onClick={handleReject} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all" data-testid="cookie-reject-btn">{t.cookies.rejectAll}</button>
                <button onClick={() => setShowDetails(!showDetails)} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all" data-testid="cookie-customize-btn">{showDetails ? t.cookies.hide : t.cookies.customize}</button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                {t.cookies.continueText} <Link to="/politique-confidentialite" className="text-orange-500 hover:underline">{t.footer.privacyPolicy}</Link> {t.cookies.and} <Link to="/mentions-legales" className="text-orange-500 hover:underline">{t.footer.legalNotice}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
