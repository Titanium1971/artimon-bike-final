import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { BikeIcon } from "../icons";

const NotFoundPage = () => {
  const { language } = useLanguage();
  
  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div>
          <div className="text-8xl mb-6">🚴</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {language === 'fr' ? 'Page non trouvée' : 'Page not found'}
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {language === 'fr' 
              ? 'Oups ! Cette page semble avoir pris un autre chemin. Retournez à l\'accueil pour continuer votre visite.'
              : 'Oops! This page seems to have taken another path. Return to the homepage to continue your visit.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="btn-primary px-8 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2"
            >
              <BikeIcon className="w-5 h-5" />
              {language === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-semibold hover:bg-orange-50 transition-colors"
            >
              {language === 'fr' ? 'Nous contacter' : 'Contact us'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
