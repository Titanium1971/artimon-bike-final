import { useMemo } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";

/**
 * Local SEO landing pages for specific service areas.
 * Routes:
 *  - /location-velo-marseillan
 *  - /location-velo-agde
 *  - /location-velo-sete
 *  - /location-velo-meze
 *  - /en/bike-rental-marseillan
 *  - /en/bike-rental-agde
 *  - /en/bike-rental-sete
 *  - /en/bike-rental-meze
 *
 * Note: content is intentionally "local" (Étang de Thau, etc.) to improve geo-relevance.
 */

const SITE = "https://www.artimonbike.com";

const AREAS = {
  marseillan: {
    fr: {
      city: "Marseillan",
      title: "Location de vélo à Marseillan | Vélos électriques, VTC & VTT | Artimon Bike",
      description:
        "Location de vélo à Marseillan (Hérault) : vélos électriques, VTC, VTT, vélos enfants. Réservation simple, conseils d’itinéraires autour de l’Étang de Thau.",
      h1: "Location de vélo à Marseillan",
      intro:
        "Artimon Bike vous accompagne pour louer un vélo à Marseillan, au plus près du port et des itinéraires de l’Étang de Thau. Que vous cherchiez un vélo électrique, un VTC confortable ou un VTT, vous partez avec le bon matériel et les bons conseils.",
      bulletsTitle: "Pourquoi louer un vélo à Marseillan avec Artimon Bike ?",
      bullets: [
        "Vélos électriques et classiques entretenus, prêts à rouler",
        "Conseils d’itinéraires : port, vignobles, étang, plages",
        "Tarifs clairs + assistance en cas de besoin",
        "Idéal pour explorer aussi Agde, Sète et Mèze"
      ],
      sections: [
        {
          h2: "Itinéraires vélo autour de Marseillan",
          p:
            "Marseillan est un point de départ parfait pour des balades faciles : port → étang → villages, ou direction plages selon la saison. Nous vous orientons vers les trajets les plus agréables et les plus sûrs, selon votre niveau et le temps disponible."
        },
        {
          h2: "Vélo électrique à Marseillan",
          p:
            "Le vélo électrique est idéal pour profiter sans se soucier du vent ou des longues distances. Vous avancez à votre rythme, vous faites plus de kilomètres, et vous gardez de l’énergie pour les pauses gourmandes et les points de vue."
        },
        {
          h2: "Tarifs & réservation",
          p:
            "Nos tarifs dépendent du type de vélo et de la durée (demi-journée, journée, plusieurs jours). Le plus simple : consultez la page Tarifs puis réservez — on vous confirme rapidement."
        },
        {
          h2: "FAQ",
          p:
            "Besoin d’un casque, d’un antivol, d’un siège enfant ou d’un conseil d’horaire ? Contactez-nous : on vous répond vite."
        }
      ],
      ctaPrimary: "Voir les tarifs",
      ctaSecondary: "Réserver / nous contacter"
    },
    en: {
      city: "Marseillan",
      title: "Bike rental in Marseillan | E-bikes, hybrid & MTB | Artimon Bike",
      description:
        "Bike rental in Marseillan (Hérault): e-bikes, hybrid bikes, MTB, kids bikes. Easy booking and local route tips around Étang de Thau.",
      h1: "Bike rental in Marseillan",
      intro:
        "Artimon Bike helps you rent the right bike in Marseillan, close to the harbour and the best routes around Étang de Thau. Choose an e-bike, a comfortable hybrid, or an MTB — with local advice included.",
      bulletsTitle: "Why rent with Artimon Bike?",
      bullets: [
        "Well‑maintained e-bikes and classic bikes",
        "Local route tips: harbour, vineyards, lagoon, beaches",
        "Clear pricing + help if needed",
        "Great base to explore Agde, Sète and Mèze"
      ],
      sections: [
        {
          h2: "Cycling routes around Marseillan",
          p:
            "Marseillan is a great starting point for easy rides: harbour → lagoon → villages, or towards the beaches. We suggest the safest and most enjoyable routes based on your level and time."
        },
        {
          h2: "E-bike rental in Marseillan",
          p:
            "An e-bike is perfect if you want to go further without worrying about wind or distance. Ride at your pace and keep energy for breaks and viewpoints."
        },
        {
          h2: "Pricing & booking",
          p:
            "Prices depend on the bike type and duration. Check our pricing page, then book — we’ll confirm quickly."
        },
        {
          h2: "FAQ",
          p:
            "Need a helmet, lock, child seat or timing advice? Contact us — we reply fast."
        }
      ],
      ctaPrimary: "See pricing",
      ctaSecondary: "Book / contact"
    }
  },

  agde: {
    fr: {
      city: "Agde",
      title: "Location de vélo à Agde | Vélos électriques & VTC | Artimon Bike",
      description:
        "Location de vélo à Agde : vélos électriques, VTC, VTT. Profitez des itinéraires vers le Grau d’Agde, le Cap d’Agde et l’Étang de Thau.",
      h1: "Location de vélo à Agde",
      intro:
        "Depuis Marseillan, nous desservons Agde et ses alentours : balade urbaine, bord de mer, voies cyclables. Choisissez le vélo adapté et profitez d’un parcours fluide.",
      bulletsTitle: "Pour Agde, ce qu’on recommande souvent :",
      bullets: [
        "Vélo électrique pour aller plus loin (Cap d’Agde, plages)",
        "VTC confortable pour les voies vertes et trajets mixtes",
        "Accessoires utiles : antivol, casque, siège enfant",
        "Conseils sur les meilleures heures selon la saison"
      ],
      sections: [
        { h2: "Agde, Cap d’Agde & Grau d’Agde à vélo", p: "Agde est un excellent carrefour : vous pouvez rejoindre des zones balnéaires et des itinéraires plus tranquilles. Nous vous orientons vers les sections cyclables les plus simples."},
        { h2: "Vélo électrique recommandé", p: "Avec un e-bike, vous lissez l’effort et profitez davantage des paysages. Idéal quand il y a du vent ou pour les longues sorties."},
        { h2: "Réservation", p: "Consultez les tarifs puis contactez-nous pour confirmer la disponibilité au meilleur créneau."},
        { h2: "FAQ", p: "On peut vous conseiller un itinéraire selon votre niveau et votre durée (1h, demi‑journée, journée)." }
      ],
      ctaPrimary: "Voir les tarifs",
      ctaSecondary: "Contacter"
    },
    en: {
      city: "Agde",
      title: "Bike rental in Agde | E-bikes & hybrid bikes | Artimon Bike",
      description:
        "Bike rental in Agde: e-bikes, hybrid bikes, MTB. Enjoy routes towards Grau d’Agde, Cap d’Agde and Étang de Thau.",
      h1: "Bike rental in Agde",
      intro:
        "From Marseillan, we serve Agde and nearby areas: seaside rides, greenways and mixed routes. Pick the right bike and enjoy a smooth trip.",
      bulletsTitle: "For Agde, our usual recommendation:",
      bullets: [
        "E-bike to go further (Cap d’Agde, beaches)",
        "Comfortable hybrid bike for mixed routes",
        "Useful gear: lock, helmet, child seat",
        "Best timing tips depending on season"
      ],
      sections: [
        { h2: "Agde, Cap d’Agde & Grau d’Agde by bike", p: "Agde is a great hub to reach coastal areas and calmer routes. We’ll suggest the easiest cycling sections."},
        { h2: "Why choose an e-bike", p: "An e-bike smooths the effort and lets you enjoy the scenery — great with wind or longer rides."},
        { h2: "Booking", p: "Check pricing then contact us to confirm availability at the best time slot."},
        { h2: "FAQ", p: "We can recommend a route based on your level and duration (1h, half‑day, full day)." }
      ],
      ctaPrimary: "See pricing",
      ctaSecondary: "Contact"
    }
  },

  sete: {
    fr: {
      city: "Sète",
      title: "Location de vélo à Sète | Itinéraires & vélo électrique | Artimon Bike",
      description:
        "Location de vélo à Sète : vélos électriques, VTC, VTT. Parfait pour découvrir le littoral, les canaux et l’Étang de Thau.",
      h1: "Location de vélo à Sète",
      intro:
        "Sète est idéale à vélo : entre mer, canaux et étang, on alterne vues et ambiances. Nous vous aidons à choisir un vélo confortable pour profiter sans stress.",
      bulletsTitle: "Sète à vélo, l’essentiel :",
      bullets: [
        "E-bike conseillé pour les reliefs et le vent",
        "Parcours panoramiques autour de l’étang",
        "Pause plage + centre-ville possible sur la même sortie",
        "Conseils d’itinéraires selon la saison"
      ],
      sections: [
        { h2: "Découvrir Sète et ses alentours", p: "Sète offre des itinéraires variés : bord de mer, canaux, accès aux paysages de l’étang. On vous recommande des parcours adaptés à votre niveau."},
        { h2: "Vélo électrique à Sète", p: "Le vélo électrique est souvent le meilleur choix pour Sète : vous gardez une cadence agréable, même avec du vent."},
        { h2: "Tarifs & réservation", p: "Consultez les tarifs, puis réservez. Nous confirmons la disponibilité et préparons votre vélo."},
        { h2: "FAQ", p: "Besoin d’une sortie courte ou d’une journée complète ? On vous propose une boucle simple et agréable." }
      ],
      ctaPrimary: "Voir les tarifs",
      ctaSecondary: "Réserver"
    },
    en: {
      city: "Sète",
      title: "Bike rental in Sète | Routes & e-bikes | Artimon Bike",
      description:
        "Bike rental in Sète: e-bikes, hybrid bikes, MTB. Great for the seaside, canals and Étang de Thau.",
      h1: "Bike rental in Sète",
      intro:
        "Sète is great by bike: sea, canals and lagoon views. We help you choose a comfortable bike to enjoy the ride.",
      bulletsTitle: "Cycling in Sète — key points:",
      bullets: [
        "E-bike recommended for wind and slopes",
        "Scenic routes around the lagoon",
        "Beach + city centre in the same ride",
        "Route tips depending on season"
      ],
      sections: [
        { h2: "Explore Sète and nearby areas", p: "Sète offers varied routes: seaside, canals and lagoon landscapes. We suggest routes adapted to your level."},
        { h2: "E-bike rental in Sète", p: "An e-bike is often the best option in Sète — keep a smooth pace even with wind."},
        { h2: "Pricing & booking", p: "Check pricing then book. We’ll confirm availability and prepare your bike."},
        { h2: "FAQ", p: "Short ride or full day? We’ll suggest an easy and enjoyable loop." }
      ],
      ctaPrimary: "See pricing",
      ctaSecondary: "Book"
    }
  },

  meze: {
    fr: {
      city: "Mèze",
      title: "Location de vélo à Mèze | Balades Étang de Thau | Artimon Bike",
      description:
        "Location de vélo à Mèze : vélos électriques, VTC, VTT. Idéal pour les balades autour de l’Étang de Thau et les sorties en famille.",
      h1: "Location de vélo à Mèze",
      intro:
        "Mèze et l’Étang de Thau se découvrent très bien à vélo, avec des sorties douces et accessibles. Nous vous conseillons un vélo adapté à votre rythme et à votre parcours.",
      bulletsTitle: "Mèze : ce que les clients apprécient",
      bullets: [
        "Balades faciles, parfaites en famille",
        "VTC ou e-bike selon votre envie de distance",
        "Accessoires : siège enfant, panier, antivol",
        "Conseils sur les points de vue et les pauses"
      ],
      sections: [
        { h2: "Balades autour de l’Étang de Thau", p: "Entre ports, points de vue et petites routes, l’étang offre une expérience paisible. On vous guide sur les trajets les plus fluides."},
        { h2: "Choisir entre VTC et vélo électrique", p: "Pour une sortie calme, un VTC suffit. Pour aller plus loin ou rouler sans effort, le vélo électrique est parfait."},
        { h2: "Tarifs & réservation", p: "Consultez les tarifs et contactez-nous : on vous confirme la disponibilité rapidement."},
        { h2: "FAQ", p: "On peut vous proposer un itinéraire adapté à votre durée et à la météo." }
      ],
      ctaPrimary: "Voir les tarifs",
      ctaSecondary: "Contacter"
    },
    en: {
      city: "Mèze",
      title: "Bike rental in Mèze | Étang de Thau rides | Artimon Bike",
      description:
        "Bike rental in Mèze: e-bikes, hybrid bikes, MTB. Perfect for relaxed rides around Étang de Thau and family outings.",
      h1: "Bike rental in Mèze",
      intro:
        "Mèze and Étang de Thau are wonderful by bike, with relaxed and accessible rides. We help you pick the right bike for your pace and route.",
      bulletsTitle: "Why people love cycling around Mèze",
      bullets: [
        "Easy rides, great for families",
        "Hybrid or e-bike depending on distance",
        "Gear: child seat, basket, lock",
        "Tips for viewpoints and breaks"
      ],
      sections: [
        { h2: "Rides around Étang de Thau", p: "Ports, viewpoints and small roads make the lagoon a peaceful cycling experience. We’ll guide you to the smoothest routes."},
        { h2: "Hybrid vs e-bike", p: "For a relaxed ride, a hybrid bike is enough. For longer distances with less effort, an e-bike is perfect."},
        { h2: "Pricing & booking", p: "Check pricing and contact us — we’ll confirm availability quickly."},
        { h2: "FAQ", p: "We can suggest a route adapted to your time and the weather." }
      ],
      ctaPrimary: "See pricing",
      ctaSecondary: "Contact"
    }
  }
};

function StructuredData({ areaKey, lang }) {
  const area = AREAS[areaKey]?.[lang];
  if (!area) return null;

  const pathname = window.location.pathname || "/";
  const url = `${SITE}${pathname}`;

  // Minimal JSON-LD to reinforce local relevance (Service + areaServed)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": lang === "fr" ? `Location de vélo à ${area.city}` : `Bike rental in ${area.city}`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Artimon Bike",
      "url": SITE
    },
    "areaServed": {
      "@type": "City",
      "name": area.city
    },
    "url": url
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

export default function LocationAreaPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const location = useLocation();

  const isEnglishPath = location.pathname.startsWith("/en/");
  const lang = isEnglishPath ? "en" : "fr";

  // Keep language context aligned with the URL (important for menus & translation keys).
  // If you already enforce language in routes, this is harmless.
  const effectiveLang = lang;

  const data = useMemo(() => AREAS[slug]?.[effectiveLang], [slug, effectiveLang]);

  if (!data) {
    return <Navigate to={isEnglishPath ? "/en/" : "/"} replace />;
  }

  const canonical = `${SITE}${location.pathname}`; // ensures /en/... canonicals are correct

  useSEO({
    title: data.title,
    description: data.description,
    keywords: (data.keywords || ""),
    canonical
  });

  const pricingUrl = isEnglishPath ? "/en/tarifs" : "/tarifs";
  const contactUrl = isEnglishPath ? "/en/contact" : "/contact";

  return (
    <main className="min-h-screen bg-white">
      <StructuredData areaKey={slug} lang={effectiveLang} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          {data.h1}
        </h1>

        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          {data.intro}
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 p-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{data.bulletsTitle}</h2>
          <ul className="mt-4 space-y-2 text-gray-700">
            {data.bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={pricingUrl}
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-white font-semibold hover:bg-orange-700 transition"
            >
              {data.ctaPrimary}
            </a>
            <a
              href={contactUrl}
              className="inline-flex items-center justify-center rounded-xl border border-orange-600 px-5 py-3 text-orange-700 font-semibold hover:bg-orange-50 transition"
            >
              {data.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {data.sections.map((s, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-gray-900">{s.h2}</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500">
          {effectiveLang === "fr"
            ? "Astuce SEO : ces pages locales améliorent votre visibilité sur les recherches 'location vélo + ville'."
            : "SEO tip: local pages help you rank for 'bike rental + city' searches."}
        </div>
      </section>
    </main>
  );
}
