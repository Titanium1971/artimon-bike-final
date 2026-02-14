import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { CheckIcon } from "../../icons";

export const ServicesSection = () => {
  const { t } = useLanguage();
  const services = [
    { id: "location", ...t.services.rental, icon: "🚴", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=60&auto=format" },
    { id: "reparation", ...t.services.repair, icon: "🔧", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=60&auto=format" },
    { id: "vente", ...t.services.sale, icon: "🏪", image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop&q=60&auto=format" },
  ];

  return (
    <section className="py-24 bg-gray-50" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.services.title} <span className="text-orange-500">{t.services.titleHighlight}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.services.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={service.id} className="service-card bg-white rounded-2xl overflow-hidden shadow-lg card-hover" data-testid={`service-card-${service.id}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative h-48 img-zoom">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-4xl">{service.icon}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-orange-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={`/${service.id}`} className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors" aria-label={`${t.services.learnMore} ${service.title}`}>
                  {t.services.learnMore} {service.title}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
