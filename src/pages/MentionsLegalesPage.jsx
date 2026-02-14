import { Link } from "react-router-dom";

const MentionsLegalesPage = () => (
  <div className="pt-20">
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
        <div className="prose prose-lg max-w-none">
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Éditeur du Site Internet</h2>
          <p className="text-gray-600 mb-4"><strong>ARILLA SEBASTIEN (MIKADOC - MISCOOTER)</strong><br />Entrepreneur individuel<br />SIRET: 832 331 235<br />Adresse: Quai de Toulon, Zone Technique du Port, 34340 Marseillan<br />Email: sebarilla@gmail.com<br />Téléphone: 06 71 32 65 47<br />Directeur de la publication: ARILLA SEBASTIEN</p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Hébergeur du Site Internet</h2>
          <p className="text-gray-600 mb-4">Google Cloud Platform - société Google LLC<br />1600 Amphitheatre Parkway, MOUNTAIN VIEW CA 94043, États-Unis</p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Propriété Intellectuelle</h2>
          <p className="text-gray-600 mb-4">Toutes les informations ou documents contenus dans le Site Internet ainsi que tous les éléments créés pour le Site Internet et sa structure générale, sont soit la propriété de l'Éditeur du Site Internet, soit font l'objet de droits d'utilisation consentis au profit de ce dernier.</p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Loi Applicable</h2>
          <p className="text-gray-600 mb-4">Les présentes mentions légales sont soumises au droit français et relèvent de la compétence des tribunaux français compétents.</p>
        </div>
      </div>
    </section>
  </div>
);

export default MentionsLegalesPage;
