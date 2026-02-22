const isDevelopment = process.env.NODE_ENV === "development";
const PROD_BACKEND_FALLBACK = "https://artimon-backend.onrender.com";

// In local dev, use CRA proxy to avoid CORS issues with the backend.
export const API_URL = isDevelopment
  ? ""
  : (process.env.REACT_APP_BACKEND_URL || PROD_BACKEND_FALLBACK);

export const REDIRECTS = {
  "/nos-tarifs": "/tarifs",
  "/donnees-personnelles": "/politique-confidentialite",
  "/balise-h1": "/",
  "/h1": "/",
  "/index": "/",
  "/home": "/",
  "/accueil": "/",
  "/rental": "/location",
  "/repair": "/reparation",
  "/sale": "/vente",
  "/prices": "/tarifs",
  "/vente-velos-trottinettes": "/vente",
  "/louer-velo-marseillan": "/location",
  "/reparateur-velo-marseillan": "/reparation",
};

export const BUSINESS_INFO = {
  name: "Artimon Bike Nautique",
  phone: "06 71 32 65 47",
  phoneLink: "tel:+33671326547",
  whatsapp: "06 71 32 65 47",
  whatsappLink: "https://wa.me/33671326547",
  email: "sebarilla@gmail.com",
  address: "Quai de Toulon, Zone Technique du Port",
  city: "34340 Marseillan",
  googleMapsUrl: "https://g.page/r/Cfk6UbA9DChAEAE",
  googleReviewUrl: "https://g.page/r/Cfk6UbA9DChAEAg/review",
  lokkiUrl: "https://www.lokki.rent/loueur/artimon",
  facebookUrl: "https://www.facebook.com/ArtimonBike",
  instagramUrl: "https://www.instagram.com/artimonbike/",
  coordinates: [43.3521372, 3.53385181],
  rating: 4.6,
  reviewCount: 174,
};

export const FALLBACK_BLOG_ARTICLES = [
  {
    id: "fallback-fr-2026-cyclables",
    slug: "nouvelles-pistes-cyclables-herault-2026",
    title: "Les nouvelles pistes cyclables 2026 dans l'Hérault",
    excerpt: "Les nouveautés 2026 autour de l'Étang de Thau, avec nos conseils pour préparer vos sorties vélo.",
    image_url: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1200&h=600&fit=crop",
    category: "Actualités",
    tags: ["velo", "etang-de-thau", "herault", "2026"],
    author: "Artimon Bike",
    created_at: "2026-02-07T09:00:00.000Z",
    content:
      "## Les nouvelles pistes cyclables 2026\n\nLe réseau cyclable autour de l'Étang de Thau continue de s'améliorer. Nous recommandons de partir tôt, d'emporter de l'eau et de privilégier les voies vertes sécurisées pour les sorties en famille.\n\n### Nos conseils\n\n- Vérifier la météo avant de partir\n- Prévoir un itinéraire avec pauses\n- Utiliser un vélo adapté au parcours",
  },
  {
    id: "fallback-en-2026-cyclables",
    slug: "new-bike-paths-herault-2026",
    title: "New Bike Paths in Hérault for 2026",
    excerpt: "What changes in 2026 around the Étang de Thau area and practical tips for your cycling rides.",
    image_url: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1200&h=600&fit=crop",
    category: "News",
    tags: ["english", "cycling", "etang-de-thau", "herault", "2026"],
    author: "Artimon Bike",
    created_at: "2026-02-07T09:00:00.000Z",
    content:
      "## New bike paths in 2026\n\nThe cycling network around Étang de Thau keeps improving. We recommend early departures, enough water, and secure greenways for family rides.\n\n### Our tips\n\n- Check weather conditions before leaving\n- Plan your route with break points\n- Choose a bike suited to the route",
  },
];

export const PRICING_DATA = [
  { icon: "👶", halfDay: "6€", day: "10€", threeDays: "27€", fiveDays: "40€", week: "55€" },
  { icon: "🚲", halfDay: "12€", day: "20€", threeDays: "46€", fiveDays: "85€", week: "112€" },
  { icon: "🏔️", halfDay: "15€", day: "25€", threeDays: "60€", fiveDays: "90€", week: "140€" },
  { icon: "⚡", halfDay: "22€", day: "35€", threeDays: "90€", fiveDays: "140€", week: "196€" },
  { icon: "🔋", halfDay: "28€", day: "45€", threeDays: "120€", fiveDays: "190€", week: "252€" },
];

export const SEO_DATA = {
  home: {
    fr: { 
      title: "Artimon Bike | Location de vélo à Marseillan, Agde, Mèze", 
      description: "Location, vente et réparation de vélos à Marseillan. Vélos électriques, VTT, VTC. Explorez l'Étang de Thau avec nos vélos de qualité !",
      keywords: "location vélo Marseillan, location VTT Agde, vélo électrique Mèze, réparation vélo Hérault, Étang de Thau vélo"
    },
    en: { 
      title: "Artimon Bike | Bike Rental in Marseillan, Agde, Mèze", 
      description: "Bike rental, sales and repair in Marseillan. Electric bikes, MTB, hybrid bikes. Explore the Étang de Thau with our quality bikes!",
      keywords: "bike rental Marseillan, MTB rental Agde, electric bike Mèze, bike repair Hérault, Étang de Thau cycling"
    }
  },
  location: {
    fr: { 
      title: "Location de Vélos à Marseillan | VTT, VTC, Électriques | Artimon Bike", 
      description: "Louez votre vélo à Marseillan : VTT, VTC, vélos électriques, vélos enfants. Tarifs dégressifs, équipements inclus. Réservation en ligne !",
      keywords: "location vélo Marseillan, louer VTT Agde, location vélo électrique Sète, vélo enfant location, tarif location vélo"
    },
    en: { 
      title: "Bike Rental in Marseillan | MTB, Hybrid, Electric | Artimon Bike", 
      description: "Rent your bike in Marseillan: MTB, hybrid, electric bikes, children's bikes. Discounted rates, equipment included. Book online!",
      keywords: "bike rental Marseillan, rent MTB Agde, electric bike rental Sète, children bike rental, bike rental prices"
    }
  },
  reparation: {
    fr: { 
      title: "Réparation de Vélos à Marseillan | Crevaison Minute | Artimon Bike", 
      description: "Service de réparation vélo professionnel à Marseillan. Crevaison minute, révision complète, toutes réparations. Devis gratuit !",
      keywords: "réparation vélo Marseillan, crevaison vélo Agde, réparateur vélo Mèze, révision vélo Hérault, entretien vélo"
    },
    en: { 
      title: "Bike Repair in Marseillan | Quick Puncture Fix | Artimon Bike", 
      description: "Professional bike repair service in Marseillan. Quick puncture repair, complete overhaul, all repairs. Free quote!",
      keywords: "bike repair Marseillan, puncture repair Agde, bike mechanic Mèze, bike service Hérault, bike maintenance"
    }
  },
  vente: {
    fr: { 
      title: "Vente de Vélos à Marseillan | Neufs & Occasion | Artimon Bike", 
      description: "Achetez votre vélo à Marseillan : VTT, VTC, vélos électriques neufs et d'occasion. Conseils experts et SAV inclus.",
      keywords: "vente vélo Marseillan, acheter VTT Agde, vélo occasion Mèze, vélo électrique vente, magasin vélo Hérault"
    },
    en: { 
      title: "Bike Sales in Marseillan | New & Used | Artimon Bike", 
      description: "Buy your bike in Marseillan: MTB, hybrid, new and used electric bikes. Expert advice and after-sales service included.",
      keywords: "buy bike Marseillan, MTB for sale Agde, used bike Mèze, electric bike sale, bike shop Hérault"
    }
  },
  parcours: {
    fr: { 
      title: "Parcours Vélo autour de l'Étang de Thau | Itinéraires GPS | Artimon Bike", 
      description: "Découvrez les meilleurs parcours vélo autour de Marseillan et l'Étang de Thau. Cartes GPS, conseils, difficultés. Tour de l'étang 60km !",
      keywords: "parcours vélo Étang de Thau, piste cyclable Marseillan, itinéraire vélo Agde, tour Étang de Thau, balade vélo Hérault"
    },
    en: { 
      title: "Bike Routes around Étang de Thau | GPS Tracks | Artimon Bike", 
      description: "Discover the best bike routes around Marseillan and Étang de Thau. GPS maps, tips, difficulty levels. 60km lagoon tour!",
      keywords: "bike routes Étang de Thau, cycling path Marseillan, bike itinerary Agde, Étang de Thau tour, bike ride Hérault"
    }
  },
  tarifs: {
    fr: { 
      title: "Tarifs Location Vélo Marseillan | Prix 2025 | Artimon Bike", 
      description: "Consultez nos tarifs de location vélo à Marseillan. Tarifs dégressifs, -25% sur la semaine. Vélos enfants dès 10€/jour.",
      keywords: "tarif location vélo Marseillan, prix location VTT, location vélo pas cher Agde, tarif vélo électrique"
    },
    en: { 
      title: "Bike Rental Prices Marseillan | 2025 Rates | Artimon Bike", 
      description: "Check our bike rental prices in Marseillan. Discounted rates, 25% off weekly. Children's bikes from €10/day.",
      keywords: "bike rental prices Marseillan, MTB rental cost, cheap bike rental Agde, electric bike rental rates"
    }
  },
  contact: {
    fr: { 
      title: "Contact Artimon Bike Marseillan | Téléphone, Adresse, Horaires", 
      description: "Contactez Artimon Bike à Marseillan : 06 71 32 65 47. Quai de Toulon, Zone Technique du Port. Ouvert tous les jours de 9h30 à 12h / 14h30 à 18h30.",
      keywords: "contact Artimon Bike, téléphone location vélo Marseillan, adresse Artimon Bike, horaires magasin vélo"
    },
    en: { 
      title: "Contact Artimon Bike Marseillan | Phone, Address, Hours", 
      description: "Contact Artimon Bike in Marseillan: +33 6 71 32 65 47. Quai de Toulon, Port Technical Zone. Open every day 9:30am-12pm / 2:30pm-6:30pm.",
      keywords: "contact Artimon Bike, bike rental phone Marseillan, Artimon Bike address, bike shop hours"
    }
  },
  faq: {
    fr: { 
      title: "FAQ Location Vélo Marseillan | Questions Fréquentes | Artimon Bike", 
      description: "Réponses à vos questions sur la location de vélo à Marseillan : documents, livraison, crevaison, réservation, garanties.",
      keywords: "FAQ location vélo, questions location VTT, comment louer vélo Marseillan, documents location vélo"
    },
    en: { 
      title: "FAQ Bike Rental Marseillan | Frequently Asked Questions | Artimon Bike", 
      description: "Answers to your questions about bike rental in Marseillan: documents, delivery, punctures, booking, warranties.",
      keywords: "FAQ bike rental, bike rental questions, how to rent bike Marseillan, bike rental documents"
    }
  }
};
