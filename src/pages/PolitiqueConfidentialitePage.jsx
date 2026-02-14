import { Link } from "react-router-dom";

const PolitiqueConfidentialitePage = () => (
  <div className="pt-20">
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">La présente Charte Données Personnelles et Cookies vise à vous informer des droits et libertés que vous pouvez faire valoir à l'égard de notre utilisation de vos données personnelles.</p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Responsable du Traitement</h2>
          <p className="text-gray-600 mb-4">ARILLA SEBASTIEN (MIKADOC - MISCOOTER) est le responsable du traitement des données personnelles.</p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Données Collectées et Finalités</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Réponse aux demandes</strong> : Nom, prénom, email, téléphone - Durée du traitement</li>
            <li><strong>Statistiques</strong> : IPs, Logs, Navigation - 13 mois maximum</li>
          </ul>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Cookies Utilisés</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Cookies essentiels</strong> : Nécessaires au fonctionnement du site</li>
            <li><strong>Cookies analytiques</strong> : Google Analytics (durée: 6 mois max)</li>
            <li><strong>Cookies marketing</strong> : Publicités personnalisées (avec consentement)</li>
          </ul>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Vos Droits (RGPD)</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement ("droit à l'oubli")</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition</li>
          </ul>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact & Réclamation</h2>
          <p className="text-gray-600 mb-4">Pour exercer vos droits : <Link to="/contact" className="text-orange-500 hover:underline">Contactez-nous</Link></p>
          <p className="text-gray-600 mb-4">Réclamation CNIL : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">www.cnil.fr</a></p>
        </div>
      </div>
    </section>
  </div>
);

export default PolitiqueConfidentialitePage;
