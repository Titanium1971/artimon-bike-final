import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { BUSINESS_INFO } from "../../constants";
import { 
  PhoneIcon, MapPinIcon, ClockIcon, StarIcon,
  FacebookIcon, InstagramIcon, WhatsAppIcon 
} from "../../icons";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/logo.svg" 
                alt="Artimon Bike Logo" 
                className="w-12 h-12 object-contain"
                width="48"
                height="48"
                decoding="async"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <div>
                <span className="text-xl font-bold">Artimon Bike</span>
                <p className="text-gray-400 text-xs">Marseillan</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">{t.footer.description}</p>
            <div className="flex gap-4">
              <a href={BUSINESS_INFO.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 hover:text-orange-500" aria-label="Facebook" data-testid="social-facebook"><FacebookIcon /></a>
              <a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 hover:text-orange-500" aria-label="Instagram" data-testid="social-instagram"><InstagramIcon /></a>
              <a href={BUSINESS_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 hover:text-green-500" aria-label="WhatsApp" data-testid="social-whatsapp"><WhatsAppIcon /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">{t.footer.services}</h3>
            <ul className="space-y-3">
              <li><Link to="/location" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.bikeRental}</Link></li>
              <li><Link to="/reparation" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.repair}</Link></li>
              <li><Link to="/vente" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.sale}</Link></li>
              <li><Link to="/parcours" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.bikeRoutes || t.nav.routes}</Link></li>
              <li><Link to="/tarifs" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.ourPrices}</Link></li>
              <li><a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.onlineBooking}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">{t.footer.contact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">{BUSINESS_INFO.address}<br />{BUSINESS_INFO.city}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href={BUSINESS_INFO.phoneLink} className="text-gray-400 hover:text-orange-500 transition-colors">{BUSINESS_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href={BUSINESS_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">{t.contact.info.whatsapp}</a>
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">{t.contact.info.hoursValue} - {t.contact.info.hoursNote}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">{t.footer.info}</h3>
            <ul className="space-y-3">
              <li><Link to="/mentions-legales" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.legalNotice}</Link></li>
              <li><Link to="/politique-confidentialite" className="text-gray-400 hover:text-orange-500 transition-colors">{t.footer.privacyPolicy}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-orange-500 transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-orange-500 transition-colors">{t.nav.blog}</Link></li>
              <li>
                <a href={BUSINESS_INFO.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  {BUSINESS_INFO.rating}/5 ({BUSINESS_INFO.reviewCount} {t.hero.reviews})
                </a>
              </li>
              <li><Link to="/admin" className="text-gray-400 hover:text-orange-500 transition-colors">{t.nav.espacePro}</Link></li>
            </ul>
            
            {/* Tourism Offices */}
            <h3 className="text-lg font-bold mb-4 mt-8">{t.tourismOffices.title}</h3>
            <ul className="space-y-2">
              {t.tourismOffices.offices.map((office, index) => (
                <li key={index}>
                  <a 
                    href={office.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <span>{office.icon}</span>
                    <span>{office.city}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Artimon Bike Nautique. {t.footer.allRights}</p>
          <p className="text-gray-400 text-sm">SIRET: 832 331 235 - ARILLA SEBASTIEN (MIKADOC - MISCOOTER)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
