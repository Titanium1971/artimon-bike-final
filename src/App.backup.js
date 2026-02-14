import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate, useParams, useNavigate } from "react-router-dom";

// ==================== API CONFIGURATION ====================
const API_URL = process.env.REACT_APP_BACKEND_URL || "";

// ==================== REDIRECTIONS 301 ====================
// Mapping des anciennes URLs vers les nouvelles pour préserver le SEO
const REDIRECTS = {
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

// Composant de redirection SEO-friendly
const RedirectHandler = () => {
  const location = useLocation();
  const redirectTo = REDIRECTS[location.pathname.toLowerCase()];
  
  if (redirectTo) {
    // Log pour le suivi des redirections (utile pour analytics)
    console.log(`[SEO Redirect 301] ${location.pathname} → ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }
  
  return null;
};

// ==================== SEO HOOK ====================
const useSEO = ({ title, description, canonical }) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    
    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    let ogDesc = document.querySelector('meta[property="og:description"]');
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDesc) ogDesc.setAttribute('content', description);
    if (ogUrl && canonical) ogUrl.setAttribute('content', canonical);
    
    // Update Twitter tags
    let twTitle = document.querySelector('meta[property="twitter:title"]');
    let twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twTitle) twTitle.setAttribute('content', title);
    if (twDesc) twDesc.setAttribute('content', description);
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink && canonical) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (canonicalLink && canonical) canonicalLink.setAttribute('href', canonical);
  }, [title, description, canonical]);
};

// SEO data per page (FR/EN)
const SEO_DATA = {
  home: {
    fr: { title: "Artimon Bike | Location de vélo à Marseillan, Agde, Mèze", description: "Location, vente et réparation de vélos à Marseillan. Vélos électriques, VTT, VTC. Explorez l'Étang de Thau avec nos vélos de qualité !" },
    en: { title: "Artimon Bike | Bike Rental in Marseillan, Agde, Mèze", description: "Bike rental, sales and repair in Marseillan. Electric bikes, MTB, hybrid bikes. Explore the Étang de Thau with our quality bikes!" }
  },
  location: {
    fr: { title: "Location de Vélos à Marseillan | VTT, VTC, Électriques | Artimon Bike", description: "Louez votre vélo à Marseillan : VTT, VTC, vélos électriques, vélos enfants. Tarifs dégressifs, équipements inclus. Réservation en ligne !" },
    en: { title: "Bike Rental in Marseillan | MTB, Hybrid, Electric | Artimon Bike", description: "Rent your bike in Marseillan: MTB, hybrid, electric bikes, children's bikes. Discounted rates, equipment included. Book online!" }
  },
  reparation: {
    fr: { title: "Réparation de Vélos à Marseillan | Crevaison Minute | Artimon Bike", description: "Service de réparation vélo professionnel à Marseillan. Crevaison minute, révision complète, toutes réparations. Devis gratuit !" },
    en: { title: "Bike Repair in Marseillan | Quick Puncture Fix | Artimon Bike", description: "Professional bike repair service in Marseillan. Quick puncture repair, complete overhaul, all repairs. Free quote!" }
  },
  vente: {
    fr: { title: "Vente de Vélos à Marseillan | Neufs & Occasion | Artimon Bike", description: "Achetez votre vélo à Marseillan : VTT, VTC, vélos électriques neufs et d'occasion. Conseils experts et SAV inclus." },
    en: { title: "Bike Sales in Marseillan | New & Used | Artimon Bike", description: "Buy your bike in Marseillan: MTB, hybrid, new and used electric bikes. Expert advice and after-sales service included." }
  },
  parcours: {
    fr: { title: "Parcours Vélo autour de l'Étang de Thau | Itinéraires GPS | Artimon Bike", description: "Découvrez les meilleurs parcours vélo autour de Marseillan et l'Étang de Thau. Cartes GPS, conseils, difficultés. Tour de l'étang 60km !" },
    en: { title: "Bike Routes around Étang de Thau | GPS Tracks | Artimon Bike", description: "Discover the best bike routes around Marseillan and Étang de Thau. GPS maps, tips, difficulty levels. 60km lagoon tour!" }
  },
  tarifs: {
    fr: { title: "Tarifs Location Vélo Marseillan | Prix 2024 | Artimon Bike", description: "Consultez nos tarifs de location vélo à Marseillan. Tarifs dégressifs, -25% sur la semaine. Vélos enfants dès 10€/jour." },
    en: { title: "Bike Rental Prices Marseillan | 2024 Rates | Artimon Bike", description: "Check our bike rental prices in Marseillan. Discounted rates, 25% off weekly. Children's bikes from €10/day." }
  },
  contact: {
    fr: { title: "Contact Artimon Bike Marseillan | Téléphone, Adresse, Horaires", description: "Contactez Artimon Bike à Marseillan : 06 71 32 65 47. Quai de Toulon, Zone Technique du Port. Ouvert tous les jours de 9h30 à 12h / 14h30 à 18h30." },
    en: { title: "Contact Artimon Bike Marseillan | Phone, Address, Hours", description: "Contact Artimon Bike in Marseillan: +33 6 71 32 65 47. Quai de Toulon, Port Technical Zone. Open every day 9:30am-12pm / 2:30pm-6:30pm." }
  },
  faq: {
    fr: { title: "FAQ Location Vélo Marseillan | Questions Fréquentes | Artimon Bike", description: "Réponses à vos questions sur la location de vélo à Marseillan : documents, livraison, crevaison, réservation, garanties." },
    en: { title: "FAQ Bike Rental Marseillan | Frequently Asked Questions | Artimon Bike", description: "Answers to your questions about bike rental in Marseillan: documents, delivery, punctures, booking, warranties." }
  }
};

// ==================== TRANSLATIONS ====================
const translations = {
  fr: {
    nav: { home: "Accueil", rental: "Location", repair: "Réparation", sale: "Vente", prices: "Tarifs", routes: "Parcours", blog: "Blog", contact: "Contact", faq: "FAQ", book: "Réserver", espacePro: "Espace Pro" },
    hero: {
      badge: "Ouvert tous les jours de 9h30 à 12h / 14h30 à 18h30",
      title: "Votre partenaire",
      titleHighlight: "vélo",
      titleEnd: "à Marseillan",
      description: "Location, vente et réparation de vélos. Explorez l'Étang de Thau et ses environs avec nos vélos de qualité : VTC, VTT, vélos électriques et plus encore !",
      bookBtn: "Réserver un vélo",
      pricesBtn: "Voir les tarifs",
      reviews: "avis Google",
      electricBikes: "Vélos électriques",
      fromPrice: "À partir de 35€/jour",
    },
    services: {
      title: "Nos", titleHighlight: "Services",
      description: "Découvrez tous nos services pour profiter pleinement de vos balades à vélo autour de l'Étang de Thau.",
      learnMore: "En savoir plus",
      rental: { title: "Location", description: "Large choix de vélos pour petits et grands : VTC, VTT, vélos électriques, vélos enfants et remorques.", features: ["Vélos pour tous âges", "Équipements inclus", "Tarifs dégressifs", "Réservation en ligne"] },
      repair: { title: "Réparation", description: "Service de réparation professionnel : révisions complètes, crevaisons à la minute, réglages et plus.", features: ["Crevaison minute", "Révision complète", "Pièces détachées", "Devis gratuit"] },
      sale: { title: "Vente", description: "Découvrez notre sélection de vélos neufs et d'occasion : VTT, VTC, vélos électriques et accessoires.", features: ["Vélos neufs & occasion", "Accessoires", "Conseils experts", "SAV inclus"] },
    },
    pricing: {
      title: "Nos", titleHighlight: "Tarifs", titleEnd: "de Location",
      description: "Des tarifs dégressifs pour des locations plus longues. Profitez de réductions jusqu'à -25% pour une semaine !",
      bikeType: "Type de vélo", halfDay: "1/2 Journée", day: "1 Jour", threeDays: "3 Jours", fiveDays: "5 Jours", week: "Semaine",
      types: ["Vélo Enfant", "Vélo Classique", "VTT", "Vélo Électrique", "VTT/VTC Électrique"],
      equipmentIncluded: "Équipements inclus : casque, antivol, kit de réparation",
      bookNow: "Réserver maintenant",
    },
    faq: {
      title: "Questions", titleHighlight: "Fréquentes",
      description: "Trouvez rapidement les réponses à vos questions",
      seeAll: "Voir toutes les questions",
      questions: [
        { q: "Quels documents sont nécessaires pour louer un vélo ?", a: "Pour louer un vélo chez Artimon Bike, vous aurez besoin d'une pièce d'identité valide et d'un moyen de paiement. Une caution peut être demandée selon le type de vélo loué." },
        { q: "Proposez-vous la livraison des vélos ?", a: "Oui, nous proposons la livraison de vélos dans les environs de Marseillan, Agde et Mèze. Contactez-nous pour connaître les conditions et tarifs de livraison." },
        { q: "Que faire en cas de crevaison pendant ma location ?", a: "Pas de panique ! Appelez-nous immédiatement au 06 71 32 65 47. Nous proposons un service de réparation rapide, y compris les crevaisons à la minute." },
        { q: "Puis-je réserver un vélo à l'avance ?", a: "Absolument ! Nous vous conseillons de réserver à l'avance, surtout en haute saison. Vous pouvez réserver en ligne via notre partenaire Lokki ou nous contacter directement." },
        { q: "Quelles sont vos garanties sur les réparations ?", a: "Toutes nos réparations sont garanties. Nous utilisons des pièces de qualité et notre équipe de professionnels assure un travail soigné." },
      ],
    },
    tourismOffices: {
      title: "Offices de Tourisme",
      description: "Découvrez les richesses de notre région",
      offices: [
        { city: "Marseillan", url: "https://www.marseillan-tourisme.com/", icon: "🏖️" },
        { city: "Agde", url: "https://www.capdagde.com/", icon: "⚓" },
        { city: "Mèze", url: "https://www.tourisme-meze.com/", icon: "🦪" },
      ]
    },
    reviews: {
      title: "Ce que nos", titleHighlight: "clients", titleEnd: "disent",
      description: "Découvrez les avis récents de nos clients satisfaits",
      rating: "Note Google",
      basedOn: "avis",
      leaveReview: "Laisser un avis",
      verifiedReview: "Avis vérifié",
      yearsAgo: "ans",
      strongPoints: "Nos points forts",
      reviewsList: [
        {
          name: "Bernard T.",
          initials: "BT",
          rating: 5,
          date: "Décembre 2024",
          text: "Très bon accueil, équipe sympathique et prévenante. Les vélos sont en excellent état et bien entretenus. Sébastien nous a donné de super conseils pour notre balade autour de l'étang de Thau. Je recommande vivement !",
          highlight: "Accueil chaleureux et conseils personnalisés",
          type: "positive"
        },
        {
          name: "Patrice H.",
          initials: "PH",
          rating: 5,
          date: "Novembre 2024",
          text: "Accueil au top ! Tout le matériel est fourni avec des conseils judicieux pour les balades. Les VTT sont en très bon état. Nous avons fait Marseillan-Plage jusqu'à Bouzigues, magnifique parcours. Merci pour cette belle expérience !",
          highlight: "Matériel de qualité et parcours conseillés",
          type: "positive"
        },
        {
          name: "Marie-Claire D.",
          initials: "MD",
          rating: 5,
          date: "Octobre 2024",
          text: "Service impeccable ! Sébastien est un vrai professionnel, il a réparé ma crevaison en quelques minutes. Les tarifs sont raisonnables et le rapport qualité-prix est excellent. Une adresse incontournable à Marseillan !",
          highlight: "Réparation rapide et prix justes",
          type: "positive"
        }
      ],
      analysis: {
        positive: ["Accueil chaleureux et professionnel", "Vélos en excellent état", "Conseils personnalisés pour les balades", "Réparation minute", "Rapport qualité-prix", "Équipements complets fournis"]
      }
    },
    contact: {
      title: "Contactez", titleHighlight: "-nous",
      description: "Une question ? Besoin d'un renseignement ? N'hésitez pas à nous contacter !",
      form: { name: "Nom", namePlaceholder: "Votre nom", email: "Email", emailPlaceholder: "votre@email.com", phone: "Téléphone", phonePlaceholder: "06 12 34 56 78", subject: "Sujet", subjectPlaceholder: "Sélectionnez un sujet", subjectOptions: ["Location de vélo", "Réparation", "Achat de vélo", "Autre"], message: "Message", messagePlaceholder: "Votre message...", send: "Envoyer le message", sending: "Envoi en cours...", success: "Message envoyé !", successDesc: "Nous vous répondrons dans les plus brefs délais.", sendAnother: "Envoyer un autre message" },
      info: { address: "Adresse", viewOnMaps: "Voir sur Google Maps", hours: "Horaires", hoursValue: "9h30 - 12h / 14h30 - 18h30", hoursNote: "Tous les jours", phone: "Téléphone", whatsapp: "WhatsApp" },
      whatsappCta: "Ou contactez-nous sur WhatsApp",
    },
    cta: { title: "Prêt à explorer l'Étang de Thau ?", description: "Réservez votre vélo dès maintenant et profitez des plus beaux paysages du sud de la France.", bookOnline: "Réserver en ligne" },
    footer: { description: "Votre partenaire vélo toute l'année à Marseillan. Location, vente et réparation de vélos depuis plus de 10 ans.", services: "Nos Services", bikeRental: "Location de vélos", repair: "Réparation", sale: "Vente", ourPrices: "Nos tarifs", onlineBooking: "Réservation en ligne", contact: "Contact", info: "Informations", legalNotice: "Mentions légales", privacyPolicy: "Politique de confidentialité", allRights: "Tous droits réservés." },
    cookies: { title: "Nous respectons votre vie privée", description: "Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.", acceptAll: "Tout accepter", rejectAll: "Tout refuser", customize: "Personnaliser", hide: "Masquer", essential: "Cookies essentiels", essentialDesc: "Nécessaires au fonctionnement du site", analytics: "Cookies analytiques", analyticsDesc: "Google Analytics pour comprendre l'utilisation du site", marketing: "Cookies marketing", marketingDesc: "Pour des publicités personnalisées", continueText: "En continuant, vous acceptez notre", and: "et nos" },
    rentalPage: { title: "Location de", titleHighlight: "Vélos", description: "Découvrez notre flotte de vélos pour tous les goûts et tous les âges. Explorez Marseillan, Agde et l'Étang de Thau en toute liberté !", book: "Réserver", perDay: "/jour", bikes: { child: { name: "Vélo Enfant", price: "10€", features: ["Tailles adaptées", "Casque inclus", "Panier disponible"] }, vtc: { name: "VTC", price: "20€", features: ["Confortable", "Polyvalent", "Porte-bagages"] }, mtb: { name: "VTT", price: "25€", features: ["Tout terrain", "Suspension", "Freins à disque"] }, electric: { name: "Vélo Électrique", price: "35€", features: ["Assistance électrique", "Batterie longue durée", "Idéal balades"] }, electricMtb: { name: "VTT Électrique", price: "45€", features: ["Puissant", "Tout terrain", "Grande autonomie"] }, tandem: { name: "Tandem", price: "30€", features: ["2 places", "Expérience unique", "Idéal couples"] } } },
    repairPage: { title: "Réparation", titleHighlight: "de Vélos", description: "Service de réparation professionnel et rapide. Crevaison à la minute, révision complète et toutes réparations.", services: { puncture: { name: "Crevaison minute", desc: "Réparation rapide de vos crevaisons en quelques minutes", price: "À partir de 10€" }, revision: { name: "Révision complète", desc: "Vérification et réglage de tous les composants", price: "À partir de 35€" }, brakes: { name: "Réglage freins", desc: "Ajustement et optimisation du système de freinage", price: "À partir de 15€" }, derailleur: { name: "Réglage dérailleur", desc: "Réglage précis pour des changements de vitesse fluides", price: "À partir de 20€" }, chain: { name: "Changement de chaîne", desc: "Remplacement de la chaîne usée", price: "À partir de 25€" }, tire: { name: "Remplacement pneu", desc: "Installation de nouveaux pneus", price: "À partir de 15€" } } },
    salePage: { title: "Vente", titleHighlight: "de Vélos", description: "Découvrez notre sélection de vélos neufs et d'occasion. Conseils personnalisés et SAV inclus.", findPerfect: "Trouvez le vélo", findPerfectHighlight: "parfait", intro: "Chez Artimon Bike, nous proposons une large gamme de vélos adaptés à tous les besoins :", items: ["VTT et VTC", "Vélos électriques", "Vélos enfants", "Vélos de ville", "Accessoires et équipements", "Pièces détachées"], contactUs: "Nous contacter" },
    bikePaths: {
      title: "Parcours", titleHighlight: "Cyclables", 
      description: "Découvrez les plus beaux itinéraires vélo autour de l'Étang de Thau. Tous les parcours partent de notre boutique Artimon Bike !",
      mapTitle: "Carte des parcours",
      allRoutes: "Tous les parcours",
      launchItinerary: "🚴🚴 Lancer l'itinéraire",
      viewOnMap: "📍📍 Voir sur la carte",
      difficulty: "Difficulté",
      distance: "Distance",
      duration: "Durée",
      elevation: "Dénivelé",
      veryEasy: "Très facile",
      easy: "Facile",
      moderate: "Modéré",
      pointsOfInterest: "Points d'intérêt",
      toDiscover: "À découvrir sur le parcours",
      startPoint: "Point de départ",
      recommendedBike: "Vélo recommandé",
      tips: "💡 Conseils pratiques",
      tipsContent: ["Partez tôt le matin en été pour éviter la chaleur", "Emportez suffisamment d'eau (2L minimum)", "Prévoyez des arrêts aux restaurants d'huîtres", "Protégez-vous du soleil (crème, casquette)", "Vérifiez la météo avant de partir"],
      ctaTitle: "Prêt à explorer l'Étang de Thau ?",
      ctaDescription: "Réservez votre vélo dès maintenant et profitez des plus beaux paysages du sud de la France.",
      routes: [
        {
          id: 1,
          name: "Tour Complet de l'Étang de Thau",
          description: "La grande boucle complète de 60 km autour de l'Étang de Thau. Départ et retour à la boutique Artimon Bike. Pistes cyclables sécurisées avec des vues spectaculaires.",
          distance: "60 km",
          duration: "4-5h",
          elevation: "116 m",
          difficulty: "veryEasy",
          color: "#3B82F6",
          highlights: ["Belle-vue", "Port de Mèze", "Bouzigues", "Sète", "Voie verte du Lido", "Marseillan-Plage", "Phare des Onglous"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Point de départ et d'arrivée" },
            { icon: "🌅", name: "Belle-vue", description: "Point de vue panoramique sur l'étang" },
            { icon: "⚓", name: "Port de Mèze", description: "Village de pêcheurs authentique" },
            { icon: "🦪", name: "Bouzigues", description: "Capitale de l'huître de Thau" },
            { icon: "⛰️", name: "Sète", description: "Théâtre de la Mer" },
            { icon: "🌿", name: "Voie verte du Lido", description: "Piste cyclable entre mer et étang" },
            { icon: "🏖️", name: "Marseillan-Plage", description: "Plages et baignade" },
            { icon: "🗼", name: "Phare des Onglous", description: "Embouchure du Canal du Midi" }
          ],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "VTC ou Vélo électrique",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=9G2M%2BPG+Marseillan&waypoints=9HX9%2B62+M%C3%A8ze%7CCJC4%2BXC+M%C3%A8ze%7CCMW5%2BRQ+Bouzigues%7C9MVR%2BCX+S%C3%A8te%7C9MV5%2B3H+S%C3%A8te%7C8H84%2BM4+Marseillan%7C8GQQ%2BR7+Marseillan&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/9HX9%2B62+M%C3%A8ze/CJC4%2BXC+M%C3%A8ze/CMW5%2BRQ+Bouzigues/9MVR%2BCX+S%C3%A8te/9MV5%2B3H+S%C3%A8te/8H84%2BM4+Marseillan/8GQQ%2BR7+Marseillan/9G2M%2BPG+Marseillan/@43.38,3.58,12z/data=!4m2!4m1!3e1"
        },
        {
          id: 2,
          name: "Artimon → Sète (Voie Verte du Lido)",
          description: "Magnifique piste cyclable au départ de la boutique. Traversez les dunes entre Méditerranée et Étang de Thau jusqu'à Sète.",
          distance: "22 km",
          duration: "1h15",
          elevation: "15 m",
          difficulty: "veryEasy",
          color: "#10B981",
          highlights: ["Phare des Onglous", "Plage des 3 Digues", "Théâtre de la Mer", "Phare de Sète"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Point de départ" },
            { icon: "🗼", name: "Phare des Onglous", description: "Photo incontournable" },
            { icon: "🏖️", name: "Plage des 3 Digues", description: "Plage sauvage" },
            { icon: "🎭", name: "Théâtre de la Mer", description: "Lieu emblématique de Sète" },
            { icon: "🔦", name: "Phare de Sète", description: "Vue panoramique" }
          ],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "Tout type de vélo",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=9PW2%2BMM+S%C3%A8te&waypoints=8GQQ%2BR7+Marseillan%7C9J88%2BHC+S%C3%A8te%7C9MVR%2BCX+S%C3%A8te&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/8GQQ%2BR7+Marseillan/9J88%2BHC+S%C3%A8te/9MVR%2BCX+S%C3%A8te/9PW2%2BMM+S%C3%A8te/@43.37,3.62,13z/data=!4m2!4m1!3e1"
        },
        {
          id: 3,
          name: "Artimon → Agde (Canal du Midi)",
          description: "Suivez le célèbre Canal du Midi classé UNESCO au départ de la boutique. Parcours ombragé sous les platanes centenaires.",
          distance: "13 km",
          duration: "45min",
          elevation: "10 m",
          difficulty: "veryEasy",
          color: "#F59E0B",
          highlights: ["Phare des Onglous", "Canal du Midi (UNESCO)", "Écluse ronde d'Agde", "Cathédrale Saint-Étienne"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Point de départ" },
            { icon: "🗼", name: "Phare des Onglous", description: "Embouchure du Canal du Midi" },
            { icon: "🌳", name: "Canal du Midi", description: "Patrimoine UNESCO" },
            { icon: "🔒", name: "Écluse ronde d'Agde", description: "Unique au monde !" },
            { icon: "⛪", name: "Cathédrale Saint-Étienne", description: "Cité grecque historique" }
          ],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "Tout type de vélo",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=8F79%2BHJ+Agde&waypoints=8GQQ%2BR7+Marseillan%7C8F7X%2BMG+Agde%7C8FC9%2B45+Agde&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/8GQQ%2BR7+Marseillan/8F7X%2BMG+Agde/8FC9%2B45+Agde/8F79%2BHJ+Agde/@43.33,3.5,14z/data=!4m2!4m1!3e1"
        },
        {
          id: 4,
          name: "Artimon → Mèze → Bouzigues",
          description: "La route des huîtres au départ de la boutique ! Longez l'étang et découvrez les villages ostréicoles avec dégustation chez les producteurs.",
          distance: "22 km",
          duration: "1h30",
          elevation: "45 m",
          difficulty: "easy",
          color: "#8B5CF6",
          highlights: ["Belle-vue", "Port de Mèze", "Bouzigues", "Musée de l'Étang de Thau"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Point de départ" },
            { icon: "🌅", name: "Belle-vue", description: "Point de vue panoramique sur l'étang" },
            { icon: "⚓", name: "Port de Mèze", description: "Restaurants et ambiance" },
            { icon: "🦪", name: "Bouzigues", description: "Dégustation huîtres" },
            { icon: "🏛️", name: "Musée de l'Étang de Thau", description: "Histoire de la conchyliculture" }
          ],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "VTC ou Vélo électrique",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=CMW6%2BPP+Bouzigues&waypoints=9HX9%2B62+M%C3%A8ze%7CCJC4%2BXC+M%C3%A8ze%7CCMW5%2BRQ+Bouzigues&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/9HX9%2B62+M%C3%A8ze/CJC4%2BXC+M%C3%A8ze/CMW5%2BRQ+Bouzigues/CMW6%2BPP+Bouzigues/@43.4,3.6,13z/data=!4m2!4m1!3e1"
        },
        {
          id: 5,
          name: "Artimon → Phare des Onglous",
          description: "Balade familiale facile au départ de la boutique jusqu'au point de rencontre du Canal du Midi et de l'Étang de Thau. Idéal pour les familles.",
          distance: "3 km",
          duration: "20min",
          elevation: "5 m",
          difficulty: "veryEasy",
          color: "#EC4899",
          highlights: ["Canal du Midi", "Phare des Onglous", "Vue sur le Mont Saint-Clair"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Point de départ" },
            { icon: "🌳", name: "Canal du Midi", description: "Embouchure historique" },
            { icon: "🗼", name: "Phare des Onglous", description: "Vue panoramique" }
          ],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "Tout type de vélo (idéal familles)",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=8GQQ%2BR7+Marseillan&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/8GQQ%2BR7+Marseillan/@43.36,3.55,15z/data=!4m2!4m1!3e1"
        }
      ]
    },
  },
  en: {
    nav: { home: "Home", rental: "Rental", repair: "Repair", sale: "Shop", prices: "Prices", routes: "Routes", blog: "Blog", contact: "Contact", faq: "FAQ", book: "Book Now", espacePro: "Pro Area" },
    hero: {
      badge: "Open every day 9:30am - 12pm / 2:30pm - 6:30pm",
      title: "Your",
      titleHighlight: "bike",
      titleEnd: "partner in Marseillan",
      description: "Bike rental, sales and repair. Explore the Étang de Thau and its surroundings with our quality bikes: hybrid, mountain, electric bikes and more!",
      bookBtn: "Book a bike",
      pricesBtn: "View prices",
      reviews: "Google reviews",
      electricBikes: "Electric bikes",
      fromPrice: "From €35/day",
    },
    services: {
      title: "Our", titleHighlight: "Services",
      description: "Discover all our services to fully enjoy your bike rides around the Étang de Thau.",
      learnMore: "Learn more",
      rental: { title: "Rental", description: "Wide selection of bikes for all ages: hybrid, mountain, electric bikes, children's bikes and trailers.", features: ["Bikes for all ages", "Equipment included", "Discounted rates", "Online booking"] },
      repair: { title: "Repair", description: "Professional repair service: complete overhauls, quick puncture repairs, adjustments and more.", features: ["Quick puncture repair", "Full service", "Spare parts", "Free quote"] },
      sale: { title: "Shop", description: "Discover our selection of new and used bikes: MTB, hybrid, electric bikes and accessories.", features: ["New & used bikes", "Accessories", "Expert advice", "After-sales service"] },
    },
    pricing: {
      title: "Our", titleHighlight: "Rental", titleEnd: "Prices",
      description: "Decreasing rates for longer rentals. Enjoy up to 25% off for a week!",
      bikeType: "Bike Type", halfDay: "Half Day", day: "1 Day", threeDays: "3 Days", fiveDays: "5 Days", week: "Week",
      types: ["Child Bike", "Classic Bike", "Mountain Bike", "Electric Bike", "Electric MTB/Hybrid"],
      equipmentIncluded: "Equipment included: helmet, lock, repair kit",
      bookNow: "Book now",
    },
    faq: {
      title: "Frequently Asked", titleHighlight: "Questions",
      description: "Quickly find answers to your questions",
      seeAll: "See all questions",
      questions: [
        { q: "What documents are required to rent a bike?", a: "To rent a bike from Artimon Bike, you will need a valid ID and a payment method. A deposit may be required depending on the type of bike rented." },
        { q: "Do you offer bike delivery?", a: "Yes, we offer bike delivery in the Marseillan, Agde and Mèze areas. Contact us for delivery terms and rates." },
        { q: "What to do if I get a flat tire during my rental?", a: "Don't panic! Call us immediately at 06 71 32 65 47. We offer quick repair service, including instant puncture repairs." },
        { q: "Can I book a bike in advance?", a: "Absolutely! We recommend booking in advance, especially during peak season. You can book online through our partner Lokki or contact us directly." },
        { q: "What are your repair warranties?", a: "All our repairs are guaranteed. We use quality parts and our team of professionals ensures careful work." },
      ],
    },
    tourismOffices: {
      title: "Tourism Offices",
      description: "Discover the treasures of our region",
      offices: [
        { city: "Marseillan", url: "https://www.marseillan-tourisme.com/", icon: "🏖️" },
        { city: "Agde", url: "https://www.capdagde.com/", icon: "⚓" },
        { city: "Mèze", url: "https://www.tourisme-meze.com/", icon: "🦪" },
      ]
    },
    reviews: {
      title: "What our", titleHighlight: "customers", titleEnd: "say",
      description: "Discover recent reviews from our satisfied customers",
      rating: "Google Rating",
      basedOn: "reviews",
      leaveReview: "Leave a review",
      verifiedReview: "Verified review",
      yearsAgo: "years ago",
      strongPoints: "Our strengths",
      reviewsList: [
        {
          name: "Bernard T.",
          initials: "BT",
          rating: 5,
          date: "December 2024",
          text: "Excellent welcome, friendly and attentive team. The bikes are in excellent condition and well maintained. Sébastien gave us great tips for our ride around the Étang de Thau. Highly recommend!",
          highlight: "Warm welcome and personalized advice",
          type: "positive"
        },
        {
          name: "Patrice H.",
          initials: "PH",
          rating: 5,
          date: "November 2024",
          text: "Top-notch welcome! All equipment provided with wise advice for rides. The mountain bikes are in great condition. We did Marseillan-Plage to Bouzigues, magnificent route. Thank you for this great experience!",
          highlight: "Quality equipment and recommended routes",
          type: "positive"
        },
        {
          name: "Marie-Claire D.",
          initials: "MD",
          rating: 5,
          date: "October 2024",
          text: "Impeccable service! Sébastien is a true professional, he fixed my puncture in minutes. Prices are reasonable and the value for money is excellent. A must-visit address in Marseillan!",
          highlight: "Quick repairs and fair prices",
          type: "positive"
        }
      ],
      analysis: {
        positive: ["Warm and professional welcome", "Bikes in excellent condition", "Personalized ride advice", "Quick repairs", "Value for money", "Complete equipment provided"]
      }
    },
    contact: {
      title: "Contact", titleHighlight: "Us",
      description: "Have a question? Need information? Don't hesitate to contact us!",
      form: { name: "Name", namePlaceholder: "Your name", email: "Email", emailPlaceholder: "your@email.com", phone: "Phone", phonePlaceholder: "+33 6 12 34 56 78", subject: "Subject", subjectPlaceholder: "Select a subject", subjectOptions: ["Bike rental", "Repair", "Bike purchase", "Other"], message: "Message", messagePlaceholder: "Your message...", send: "Send message", sending: "Sending...", success: "Message sent!", successDesc: "We will respond as soon as possible.", sendAnother: "Send another message" },
      info: { address: "Address", viewOnMaps: "View on Google Maps", hours: "Hours", hoursValue: "9:30am - 12pm / 2:30pm - 6:30pm", hoursNote: "Every day", phone: "Phone", whatsapp: "WhatsApp" },
      whatsappCta: "Or contact us on WhatsApp",
    },
    cta: { title: "Ready to explore the Étang de Thau?", description: "Book your bike now and enjoy the most beautiful landscapes of southern France.", bookOnline: "Book online" },
    footer: { description: "Your year-round bike partner in Marseillan. Bike rental, sales and repair for over 10 years.", services: "Our Services", bikeRental: "Bike rental", repair: "Repair", sale: "Shop", ourPrices: "Our prices", onlineBooking: "Online booking", contact: "Contact", info: "Information", legalNotice: "Legal Notice", privacyPolicy: "Privacy Policy", allRights: "All rights reserved." },
    cookies: { title: "We respect your privacy", description: "We use cookies to improve your experience, analyze traffic and personalize content.", acceptAll: "Accept all", rejectAll: "Reject all", customize: "Customize", hide: "Hide", essential: "Essential cookies", essentialDesc: "Required for the website to function", analytics: "Analytics cookies", analyticsDesc: "Google Analytics to understand site usage", marketing: "Marketing cookies", marketingDesc: "For personalized advertising", continueText: "By continuing, you accept our", and: "and our" },
    rentalPage: { title: "Bike", titleHighlight: "Rental", description: "Discover our fleet of bikes for all tastes and ages. Explore Marseillan, Agde and the Étang de Thau in complete freedom!", book: "Book", perDay: "/day", bikes: { child: { name: "Child Bike", price: "€10", features: ["Adapted sizes", "Helmet included", "Basket available"] }, vtc: { name: "Hybrid Bike", price: "€20", features: ["Comfortable", "Versatile", "Luggage rack"] }, mtb: { name: "Mountain Bike", price: "€25", features: ["All terrain", "Suspension", "Disc brakes"] }, electric: { name: "Electric Bike", price: "€35", features: ["Electric assist", "Long battery life", "Ideal for rides"] }, electricMtb: { name: "Electric MTB", price: "€45", features: ["Powerful", "All terrain", "Great range"] }, tandem: { name: "Tandem", price: "€30", features: ["2 seats", "Unique experience", "Ideal for couples"] } } },
    repairPage: { title: "Bike", titleHighlight: "Repair", description: "Professional and fast repair service. Quick puncture repair, complete overhaul and all repairs.", services: { puncture: { name: "Quick puncture repair", desc: "Quick repair of your punctures in minutes", price: "From €10" }, revision: { name: "Complete overhaul", desc: "Check and adjustment of all components", price: "From €35" }, brakes: { name: "Brake adjustment", desc: "Adjustment and optimization of the braking system", price: "From €15" }, derailleur: { name: "Derailleur adjustment", desc: "Precise adjustment for smooth gear changes", price: "From €20" }, chain: { name: "Chain replacement", desc: "Replacement of worn chain", price: "From €25" }, tire: { name: "Tire replacement", desc: "Installation of new tires", price: "From €15" } } },
    salePage: { title: "Bike", titleHighlight: "Shop", description: "Discover our selection of new and used bikes. Personalized advice and after-sales service included.", findPerfect: "Find the", findPerfectHighlight: "perfect bike", intro: "At Artimon Bike, we offer a wide range of bikes for all needs:", items: ["Mountain & Hybrid bikes", "Electric bikes", "Children's bikes", "City bikes", "Accessories & equipment", "Spare parts"], contactUs: "Contact us" },
    bikePaths: {
      title: "Bike", titleHighlight: "Routes",
      description: "Discover the most beautiful cycling routes around the Étang de Thau. All routes start from our Artimon Bike shop!",
      mapTitle: "Route map",
      allRoutes: "All routes",
      launchItinerary: "🚴🚴 Launch itinerary",
      viewOnMap: "📍📍 View on map",
      difficulty: "Difficulty",
      distance: "Distance",
      duration: "Duration",
      elevation: "Elevation",
      veryEasy: "Very easy",
      easy: "Easy",
      moderate: "Moderate",
      pointsOfInterest: "Points of interest",
      toDiscover: "Discover along the route",
      startPoint: "Starting point",
      recommendedBike: "Recommended bike",
      tips: "💡 Practical tips",
      tipsContent: ["Start early in summer to avoid the heat", "Bring enough water (2L minimum)", "Plan stops at oyster restaurants", "Protect yourself from the sun", "Check the weather before leaving"],
      ctaTitle: "Ready to explore the Étang de Thau?",
      ctaDescription: "Book your bike now and enjoy the most beautiful landscapes of southern France.",
      routes: [
        {
          id: 1,
          name: "Complete Tour of Étang de Thau",
          description: "The full 60 km loop around the Étang de Thau. Departure and return to Artimon Bike shop. Secure cycle paths with spectacular views.",
          distance: "60 km",
          duration: "4-5h",
          elevation: "116 m",
          difficulty: "veryEasy",
          color: "#3B82F6",
          highlights: ["Belle-vue", "Mèze Harbor", "Bouzigues", "Sète", "Lido Greenway", "Marseillan-Plage", "Onglous Lighthouse"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Start and finish point" },
            { icon: "🌅", name: "Belle-vue", description: "Panoramic view of the lagoon" },
            { icon: "⚓", name: "Mèze Harbor", description: "Authentic fishing village" },
            { icon: "🦪", name: "Bouzigues", description: "Oyster capital of Thau" },
            { icon: "⛰️", name: "Sète", description: "Sea Theater" },
            { icon: "🌿", name: "Lido Greenway", description: "Cycle path between sea and lagoon" },
            { icon: "🏖️", name: "Marseillan-Plage", description: "Beaches and swimming" },
            { icon: "🗼", name: "Onglous Lighthouse", description: "Canal du Midi outlet" }
          ],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Hybrid or Electric bike",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=9G2M%2BPG+Marseillan&waypoints=9HX9%2B62+M%C3%A8ze%7CCJC4%2BXC+M%C3%A8ze%7CCMW5%2BRQ+Bouzigues%7C9MVR%2BCX+S%C3%A8te%7C9MV5%2B3H+S%C3%A8te%7C8H84%2BM4+Marseillan%7C8GQQ%2BR7+Marseillan&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/9HX9%2B62+M%C3%A8ze/CJC4%2BXC+M%C3%A8ze/CMW5%2BRQ+Bouzigues/9MVR%2BCX+S%C3%A8te/9MV5%2B3H+S%C3%A8te/8H84%2BM4+Marseillan/8GQQ%2BR7+Marseillan/9G2M%2BPG+Marseillan/@43.38,3.58,12z/data=!4m2!4m1!3e1"
        },
        {
          id: 2,
          name: "Artimon → Sète (Lido Greenway)",
          description: "Magnificent cycle path starting from the shop. Cross the dunes between Mediterranean and Étang de Thau to Sète.",
          distance: "22 km",
          duration: "1h15",
          elevation: "15 m",
          difficulty: "veryEasy",
          color: "#10B981",
          highlights: ["Onglous Lighthouse", "3 Digues Beach", "Sea Theater", "Sète Lighthouse"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Starting point" },
            { icon: "🗼", name: "Onglous Lighthouse", description: "Must-have photo" },
            { icon: "🏖️", name: "3 Digues Beach", description: "Wild beach" },
            { icon: "🎭", name: "Sea Theater", description: "Iconic Sète landmark" },
            { icon: "🔦", name: "Sète Lighthouse", description: "Panoramic view" }
          ],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Any bike type",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=9PW2%2BMM+S%C3%A8te&waypoints=8GQQ%2BR7+Marseillan%7C9J88%2BHC+S%C3%A8te%7C9MVR%2BCX+S%C3%A8te&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/8GQQ%2BR7+Marseillan/9J88%2BHC+S%C3%A8te/9MVR%2BCX+S%C3%A8te/9PW2%2BMM+S%C3%A8te/@43.37,3.62,13z/data=!4m2!4m1!3e1"
        },
        {
          id: 3,
          name: "Artimon → Agde (Canal du Midi)",
          description: "Follow the famous UNESCO-listed Canal du Midi from the shop. Shaded route under century-old plane trees.",
          distance: "13 km",
          duration: "45min",
          elevation: "10 m",
          difficulty: "veryEasy",
          color: "#F59E0B",
          highlights: ["Onglous Lighthouse", "Canal du Midi (UNESCO)", "Round Lock of Agde", "Saint-Étienne Cathedral"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Starting point" },
            { icon: "🗼", name: "Onglous Lighthouse", description: "Canal du Midi outlet" },
            { icon: "🌳", name: "Canal du Midi", description: "UNESCO Heritage" },
            { icon: "🔒", name: "Round Lock of Agde", description: "Unique in the world!" },
            { icon: "⛪", name: "Saint-Étienne Cathedral", description: "Historic Greek city" }
          ],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Any bike type",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=8F79%2BHJ+Agde&waypoints=8GQQ%2BR7+Marseillan%7C8F7X%2BMG+Agde%7C8FC9%2B45+Agde&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/8GQQ%2BR7+Marseillan/8F7X%2BMG+Agde/8FC9%2B45+Agde/8F79%2BHJ+Agde/@43.33,3.5,14z/data=!4m2!4m1!3e1"
        },
        {
          id: 4,
          name: "Artimon → Mèze → Bouzigues",
          description: "The oyster route from the shop! Ride along the lagoon and discover shellfish villages with tastings at producers.",
          distance: "22 km",
          duration: "1h30",
          elevation: "45 m",
          difficulty: "easy",
          color: "#8B5CF6",
          highlights: ["Belle-vue", "Mèze Harbor", "Bouzigues", "Thau Lagoon Museum"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Starting point" },
            { icon: "🌅", name: "Belle-vue", description: "Panoramic lagoon view" },
            { icon: "⚓", name: "Mèze Harbor", description: "Restaurants and atmosphere" },
            { icon: "🦪", name: "Bouzigues", description: "Oyster tasting" },
            { icon: "🏛️", name: "Thau Lagoon Museum", description: "Shellfish farming history" }
          ],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Hybrid or Electric bike",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=CMW6%2BPP+Bouzigues&waypoints=9HX9%2B62+M%C3%A8ze%7CCJC4%2BXC+M%C3%A8ze%7CCMW5%2BRQ+Bouzigues&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/9HX9%2B62+M%C3%A8ze/CJC4%2BXC+M%C3%A8ze/CMW5%2BRQ+Bouzigues/CMW6%2BPP+Bouzigues/@43.4,3.6,13z/data=!4m2!4m1!3e1"
        },
        {
          id: 5,
          name: "Artimon → Onglous Lighthouse",
          description: "Easy family ride from the shop to where Canal du Midi meets Étang de Thau. Perfect for families.",
          distance: "3 km",
          duration: "20min",
          elevation: "5 m",
          difficulty: "veryEasy",
          color: "#EC4899",
          highlights: ["Canal du Midi", "Onglous Lighthouse", "Mont Saint-Clair view"],
          pointsOfInterest: [
            { icon: "🚴", name: "Artimon Bike", description: "Starting point" },
            { icon: "🌳", name: "Canal du Midi", description: "Historic outlet" },
            { icon: "🗼", name: "Onglous Lighthouse", description: "Panoramic view" }
          ],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Any bike (ideal for families)",
          launchUrl: "https://www.google.com/maps/dir/?api=1&destination=8GQQ%2BR7+Marseillan&travelmode=bicycling&dir_action=navigate",
          viewUrl: "https://www.google.com/maps/dir/9G2M%2BPG+Marseillan/8GQQ%2BR7+Marseillan/@43.36,3.55,15z/data=!4m2!4m1!3e1"
        }
      ]
    },
  },
};

// ==================== LANGUAGE CONTEXT ====================
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('artimon-language');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('artimon-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];
  const toggleLanguage = () => setLanguage(prev => prev === 'fr' ? 'en' : 'fr');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => useContext(LanguageContext);

// ==================== CONSTANTS ====================
const BUSINESS_INFO = {
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

const PRICING_DATA = [
  { icon: "👶", halfDay: "6€", day: "10€", threeDays: "27€", fiveDays: "40€", week: "55€" },
  { icon: "🚲", halfDay: "12€", day: "20€", threeDays: "46€", fiveDays: "85€", week: "112€" },
  { icon: "🏔️", halfDay: "15€", day: "25€", threeDays: "60€", fiveDays: "90€", week: "140€" },
  { icon: "⚡", halfDay: "22€", day: "35€", threeDays: "90€", fiveDays: "140€", week: "196€" },
  { icon: "🔋", halfDay: "28€", day: "45€", threeDays: "120€", fiveDays: "190€", week: "252€" },
];

// ==================== ICONS ====================
const BikeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 7a1 1 0 0 1-.707-.293l-2-2a1 1 0 0 1 1.414-1.414L12 4.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-2 2A1 1 0 0 1 12 7zm4 8h-1.5l-2.5-5-2 4H8a1 1 0 0 1 0-2h1l2-4 3 6h2a1 1 0 0 1 0 2z"/>
  </svg>
);

const PhoneIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = ({ className = "w-5 h-5", filled = true }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

// Social Icons
const FacebookIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ==================== LANGUAGE SWITCHER ====================
const LanguageSwitcher = ({ isScrolled = false }) => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
        isScrolled 
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
          : "bg-white/10 hover:bg-white/20 text-white"
      }`}
      data-testid="language-switcher"
      title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <GlobeIcon className="w-4 h-4" />
      <span className="text-sm font-medium uppercase">{language === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  );
};

// ==================== COOKIE CONSENT ====================
const CookieConsent = ({ onAccept, onReject }) => {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({ essential: true, analytics: true, marketing: false });

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
                <button onClick={() => onAccept(preferences)} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all" data-testid="cookie-accept-btn">{t.cookies.acceptAll}</button>
                <button onClick={onReject} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all" data-testid="cookie-reject-btn">{t.cookies.rejectAll}</button>
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

// ==================== NAVIGATION ====================
const Navigation = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Détecte si on est sur la page d'accueil (seule page avec hero sombre)
  const isHomePage = location.pathname === "/";
  
  // Le menu doit être en mode "sombre sur clair" si :
  // - On n'est PAS sur la page d'accueil, OU
  // - On a scrollé
  const shouldShowDarkNav = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.rental, path: "/location" },
    { name: t.nav.repair, path: "/reparation" },
    { name: t.nav.sale, path: "/vente" },
    { name: t.nav.routes, path: "/parcours" },
    { name: t.nav.prices, path: "/tarifs" },
    { name: t.nav.blog, path: "/blog" },
    { name: t.nav.contact, path: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${shouldShowDarkNav ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`} data-testid="main-navigation">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
              <img 
                src="/logo.svg" 
                alt="Artimon Bike Logo" 
                className="w-12 h-12 object-contain"
                style={{ filter: shouldShowDarkNav ? 'none' : 'brightness(0) invert(1)' }}
              />
              <div>
                <span className={`text-xl font-bold ${shouldShowDarkNav ? "text-gray-900" : "text-white"}`}>Artimon Bike</span>
                <p className={`text-xs ${shouldShowDarkNav ? "text-gray-500" : "text-white/70"}`}>Marseillan</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`nav-link font-medium transition-colors ${shouldShowDarkNav ? "text-gray-700 hover:text-orange-500" : "text-white hover:text-orange-300"} ${location.pathname === link.path ? "text-orange-500" : ""}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <LanguageSwitcher isScrolled={shouldShowDarkNav} />
              <a href={BUSINESS_INFO.phoneLink} className={`flex items-center gap-2 font-medium ${shouldShowDarkNav ? "text-gray-700" : "text-white"}`}>
                <PhoneIcon className="w-5 h-5" />
                {BUSINESS_INFO.phone}
              </a>
              <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-2.5 rounded-xl text-white font-semibold" data-testid="reservation-cta">
                {t.nav.book}
              </a>
            </div>

            <div className="flex lg:hidden items-center gap-3">
              <LanguageSwitcher isScrolled={shouldShowDarkNav} />
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 rounded-lg ${shouldShowDarkNav ? "text-gray-900" : "text-white"}`} data-testid="mobile-menu-btn" aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[999] lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl">
              <div className="p-6 pt-24">
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link key={link.path} to={link.path} className={`block py-3 px-4 rounded-lg font-medium transition-colors ${location.pathname === link.path ? "bg-orange-50 text-orange-500" : "text-gray-700 hover:bg-gray-50"}`}>
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 space-y-4">
                  <a href={BUSINESS_INFO.phoneLink} className="flex items-center gap-3 py-3 px-4 text-gray-700">
                    <PhoneIcon className="w-5 h-5 text-orange-500" />
                    {BUSINESS_INFO.phone}
                  </a>
                  <a href={BUSINESS_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3 px-4 text-gray-700">
                    <WhatsAppIcon className="w-5 h-5 text-green-500" />
                    WhatsApp
                  </a>
                  <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="block w-full btn-primary py-3 px-4 rounded-xl text-white font-semibold text-center">
                    {t.nav.book}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      
    </>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
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

// ==================== HERO SECTION ====================
const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center" data-testid="hero-section">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=60&auto=format')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge with animation */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-300 text-sm font-medium">{t.hero.badge}</span>
            </div>
            
            {/* Title with animation */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              {t.hero.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{t.hero.titleHighlight}</span>{" "}
              {t.hero.titleEnd}
            </h1>
            
            {/* Description with animation */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>{t.hero.description}</p>

            {/* Buttons with animation */}
            <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-shine px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2 hover-glow" data-testid="hero-reservation-btn">
                <img src="/logo.svg" alt="" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} width="300" height="150" />
                Réserver sur la plateforme
              </a>
              <Link to="/tarifs" className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2 hover:scale-105" data-testid="hero-tarifs-btn">
                {t.hero.pricesBtn}
              </Link>
            </div>

            {/* Reviews with animation */}
            <div className="flex items-center gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className={`w-5 h-5 ${star <= Math.floor(BUSINESS_INFO.rating) ? "text-yellow-400" : "text-gray-500"}`} filled={star <= Math.floor(BUSINESS_INFO.rating)} />
                ))}
              </div>
              <span className="text-white font-semibold">{BUSINESS_INFO.rating}/5</span>
              <a href={BUSINESS_INFO.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors link-underline">
                ({BUSINESS_INFO.reviewCount} {t.hero.reviews})
              </a>
            </div>
          </div>

          {/* Image section with animation */}
          <div className="hidden lg:block animate-fade-in-right opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-2xl opacity-30 transform rotate-3" />
              <div className="img-zoom rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=400&fit=crop&q=60&auto=format" alt="Vélo électrique Artimon Bike" className="relative rounded-3xl shadow-2xl w-full object-cover" loading="lazy" />
              </div>
              
              {/* Floating card with animation */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold">{t.hero.electricBikes}</p>
                    <p className="text-gray-500 text-sm">{t.hero.fromPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with bounce animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDownIcon className="w-8 h-8 text-white/50" />
      </div>
    </section>
  );
};

// ==================== CITIES SECTION ====================
const CitiesSection = () => {
  const { language } = useLanguage();
  
  const cities = [
    {
      name: "Marseillan",
      description: language === 'fr' 
        ? "Notre base principale, au cœur du port" 
        : "Our main base, in the heart of the port",
      color: "from-blue-500 to-blue-600",
      url: "https://www.marseillan-tourisme.com/",
      // Blason de Marseillan - couleurs bleu et or
      emblem: (
        <svg viewBox="0 0 100 120" className="w-20 h-24">
          <defs>
            <linearGradient id="marseillan-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d="M50 5 L95 25 L95 75 Q95 110 50 115 Q5 110 5 75 L5 25 Z" fill="url(#marseillan-bg)" stroke="#fbbf24" strokeWidth="3"/>
          <circle cx="50" cy="50" r="20" fill="#fbbf24"/>
          <path d="M50 35 L55 45 L65 47 L58 55 L60 65 L50 60 L40 65 L42 55 L35 47 L45 45 Z" fill="#1e40af"/>
          <rect x="35" y="75" width="30" height="8" fill="#fbbf24" rx="2"/>
          <text x="50" y="95" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">⚓</text>
        </svg>
      ),
    },
    {
      name: "Agde",
      description: language === 'fr' 
        ? "La perle noire de la Méditerranée" 
        : "The black pearl of the Mediterranean",
      color: "from-gray-700 to-gray-900",
      url: "https://www.capdagde.com/",
      // Blason d'Agde - couleurs noir et rouge
      emblem: (
        <svg viewBox="0 0 100 120" className="w-20 h-24">
          <defs>
            <linearGradient id="agde-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
          </defs>
          <path d="M50 5 L95 25 L95 75 Q95 110 50 115 Q5 110 5 75 L5 25 Z" fill="url(#agde-bg)" stroke="#dc2626" strokeWidth="3"/>
          <path d="M30 40 L50 25 L70 40 L70 80 L30 80 Z" fill="#dc2626"/>
          <rect x="42" y="55" width="16" height="25" fill="#1f2937"/>
          <circle cx="50" cy="45" r="8" fill="#fbbf24"/>
          <path d="M25 85 L75 85" stroke="#dc2626" strokeWidth="4"/>
          <text x="50" y="100" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">AGDE</text>
        </svg>
      ),
    },
    {
      name: "Mèze",
      description: language === 'fr' 
        ? "Village typique au bord de l'étang de Thau" 
        : "Typical village on the Thau lagoon",
      color: "from-emerald-500 to-emerald-600",
      url: "https://www.thau-mediterranee.com/",
      // Blason de Mèze - couleurs vert et or
      emblem: (
        <svg viewBox="0 0 100 120" className="w-20 h-24">
          <defs>
            <linearGradient id="meze-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path d="M50 5 L95 25 L95 75 Q95 110 50 115 Q5 110 5 75 L5 25 Z" fill="url(#meze-bg)" stroke="#fbbf24" strokeWidth="3"/>
          <ellipse cx="50" cy="55" rx="30" ry="15" fill="#0ea5e9" opacity="0.7"/>
          <path d="M30 50 Q40 40 50 50 Q60 40 70 50" stroke="#fbbf24" strokeWidth="2" fill="none"/>
          <circle cx="35" cy="65" r="5" fill="#fbbf24"/>
          <circle cx="50" cy="70" r="5" fill="#fbbf24"/>
          <circle cx="65" cy="65" r="5" fill="#fbbf24"/>
          <text x="50" y="95" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">🦪</text>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden" data-testid="cities-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
         
         
         
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {language === 'fr' ? 'Nous desservons' : 'We serve'}
            <span className="text-orange-500"> 3 {language === 'fr' ? 'communes' : 'towns'}</span>
          </h2>
          <p className="text-gray-600">
            {language === 'fr' 
              ? "Découvrez l'Étang de Thau et ses trésors à vélo" 
              : "Discover the Thau Lagoon and its treasures by bike"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <a
              key={city.name}
              href={city.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group cursor-pointer block"
              data-testid={`city-card-${city.name.toLowerCase()}`}
            >
              <div className={`bg-gradient-to-br ${city.color} rounded-2xl p-6 text-white text-center shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-300`}>
                {/* Emblème */}
                <div className="flex justify-center mb-4">
                  {city.emblem}
                </div>
                
                {/* Nom de la ville */}
                <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                
                {/* Description */}
                <p className="text-white/80 text-sm">{city.description}</p>
                
                {/* Lien office de tourisme */}
                <p className="mt-3 text-xs text-white/60 flex items-center justify-center gap-1">
                  <span>🏛️</span>
                  <span>Office de tourisme</span>
                  <svg className="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </p>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700" />
              </div>
            </a>
          ))}
        </div>

        {/* Animation de connexion entre les villes avec vélos animés */}
        <div 
          className="flex justify-center items-center mt-8 gap-4"
        >
          <div className="text-3xl animate-bike-left">🚴</div>
          <div className="flex-1 max-w-xs h-1 bg-gradient-to-r from-blue-500 via-gray-700 to-emerald-500 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          </div>
          <div className="text-3xl transform scale-x-[-1] animate-bike-right">🚴</div>
        </div>
      </div>
    </section>
  );
};

// ==================== SERVICES SECTION ====================
const ServicesSection = () => {
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

// ==================== PRICING SECTION ====================
const PricingSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.pricing.title} <span className="text-orange-500">{t.pricing.titleHighlight}</span> {t.pricing.titleEnd}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.pricing.description}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <th className="px-6 py-4 text-left font-semibold">{t.pricing.bikeType}</th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.halfDay}</th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.day}</th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.threeDays}<br/><span className="text-xs font-normal">-10%</span></th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.fiveDays}<br/><span className="text-xs font-normal">-20%</span></th>
                <th className="px-6 py-4 text-center font-semibold">{t.pricing.week}<br/><span className="text-xs font-normal">-25%</span></th>
              </tr>
            </thead>
            <tbody>
              {PRICING_DATA.map((item, index) => (
                <tr key={index} className="pricing-row border-b border-gray-100 last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold text-gray-900">{t.pricing.types[index]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.halfDay}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900">{item.day}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.threeDays}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.fiveDays}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{item.week}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-6">{t.pricing.equipmentIncluded}</p>
          <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2" data-testid="pricing-reservation-btn">
            <img src="/logo.svg" alt="" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} width="300" height="150" />
            Réserver sur la plateforme
          </a>
        </div>
      </div>
    </section>
  );
};

// ==================== FAQ SECTION ====================
const FAQSection = ({ showFull = false }) => {
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

// ==================== REVIEWS SECTION ====================
const ReviewsSection = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(BUSINESS_INFO.rating);
  const [totalReviews, setTotalReviews] = useState(BUSINESS_INFO.reviewCount);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
          setRating(data.rating || BUSINESS_INFO.rating);
          setTotalReviews(data.total_reviews || BUSINESS_INFO.reviewCount);
        }
      } catch (error) {
        console.log("Using fallback reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  // Use API reviews if available, otherwise use translated static reviews
  const displayReviews = reviews.length > 0 ? reviews.map((r, i) => ({
    name: r.author_name,
    initials: r.author_name.split(' ').map(n => n[0]).join(''),
    date: r.time,
    rating: r.rating,
    text: r.text,
    type: r.rating >= 4 ? 'positive' : 'neutral',
    highlight: r.rating === 5 ? "Excellent !" : "Bon avis"
  })) : t.reviews.reviewsList;

  return (
    <section className="py-24 bg-white" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.reviews.title} <span className="text-orange-500">{t.reviews.titleHighlight}</span> {t.reviews.titleEnd}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.reviews.description}</p>
          {loading && <div className="mt-4 text-orange-500">Chargement des avis...</div>}
        </div>

        {/* Rating Summary */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 p-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900">{rating}</div>
            <div className="flex justify-center mt-2">{renderStars(Math.round(rating))}</div>
            <div className="text-sm text-gray-500 mt-2">{t.reviews.rating}</div>
          </div>
          <div className="h-20 w-px bg-orange-200 hidden md:block"></div>
          <div className="text-center md:text-left">
            <div className="text-2xl font-semibold text-gray-900">{totalReviews}</div>
            <div className="text-gray-500">{t.reviews.basedOn}</div>
            <a 
              href={BUSINESS_INFO.googleReviewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white border border-orange-200 rounded-full text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium"
              data-testid="leave-review-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              {t.reviews.leaveReview}
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {displayReviews.slice(0, 6).map((review, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${
                review.type === 'positive' ? 'border-green-500' : 'border-yellow-500'
              }`}
              data-testid={`review-card-${index}`}
            >
              {/* Review Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  review.type === 'positive' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                }`}>
                  {review.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                "{review.text}"
              </p>

              {/* Highlight Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                review.type === 'positive' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {review.type === 'positive' ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                )}
                {review.highlight}
              </div>

              {/* Verified Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {t.reviews.verifiedReview}
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Box - Only Strong Points */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </span>
            <h3 className="text-2xl font-bold">{t.reviews.strongPoints}</h3>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {t.reviews.analysis.positive.map((point, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                <span className="text-white/95 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== CONTACT SECTION ====================
const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
                
                {/* WhatsApp CTA - Green Button */}
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
            {/* Google Maps Embed */}
            <div className="h-80 rounded-2xl overflow-hidden shadow-lg" data-testid="contact-map">
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

// ==================== CTA SECTION ====================
const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden" data-testid="cta-section">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.cta.title}</h2>
          <p className="text-white/90 text-lg mb-8">{t.cta.description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl" data-testid="cta-reservation-btn">
              <img src="/logo.svg" alt="" className="w-6 h-6" width="300" height="150" />
              Réserver sur la plateforme
            </a>
            <a href={BUSINESS_INFO.phoneLink} className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 hover:scale-105 transition-all inline-flex items-center gap-2 backdrop-blur-sm">
              <PhoneIcon className="w-5 h-5" />
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== PAGES ====================
const HomePage = () => {
  const { language } = useLanguage();
  useSEO({
    title: SEO_DATA.home[language].title,
    description: SEO_DATA.home[language].description,
    canonical: "https://www.artimonbike.com/"
  });
  return (
    <>
      <HeroSection />
      <CitiesSection />
      <ServicesSection />
      <PricingSection />
      <ReviewsSection />
      <BlogSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </>
  );
};

const LocationPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.location[language].title,
    description: SEO_DATA.location[language].description,
    canonical: "https://www.artimonbike.com/location"
  });
  const bikes = Object.entries(t.rentalPage.bikes).map(([key, value]) => ({
    ...value,
    image: {
      // Images correspondant réellement aux types de vélos (Pexels - optimized)
      child: "https://images.pexels.com/photos/14576823/pexels-photo-14576823.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", // Vélo enfant coloré
      vtc: "https://images.pexels.com/photos/2224696/pexels-photo-2224696.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", // VTC ville
      mtb: "https://images.pexels.com/photos/16066068/pexels-photo-16066068.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", // VTT trail
      electric: "https://images.pexels.com/photos/13633045/pexels-photo-13633045.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", // Vélo électrique
      electricMtb: "https://images.pexels.com/photos/27368838/pexels-photo-27368838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", // VTT électrique
      tandem: "https://images.pexels.com/photos/17169173/pexels-photo-17169173.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", // Tandem couple
    }[key]
  }));

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.rentalPage.title} <span className="text-orange-500">{t.rentalPage.titleHighlight}</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.rentalPage.description}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bikes.map((bike, index) => (
              <div key={bike.name} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden"><img src={bike.image} alt={bike.name} className="w-full h-full object-cover" loading="lazy" /></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{bike.name}</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 font-semibold rounded-full text-sm">{bike.price}{t.rentalPage.perDay}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {bike.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><CheckIcon className="w-4 h-4 text-orange-500" />{feature}</li>
                    ))}
                  </ul>
                  <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="block w-full btn-primary py-3 rounded-xl text-white font-semibold text-center">{t.rentalPage.book}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PricingSection />
      <CTASection />
    </div>
  );
};

const ReparationPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.reparation[language].title,
    description: SEO_DATA.reparation[language].description,
    canonical: "https://www.artimonbike.com/reparation"
  });
  const services = Object.entries(t.repairPage.services).map(([key, value]) => ({
    ...value,
    icon: { puncture: "⏱️", revision: "🔧", brakes: "🛑", derailleur: "⚙️", chain: "🔗", tire: "🛞" }[key]
  }));

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-orange-500">{t.repairPage.title}</span> {t.repairPage.titleHighlight}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.repairPage.description}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.name} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.desc}</p>
                <p className="text-orange-500 font-semibold">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
      <ContactSection />
    </div>
  );
};

const VentePage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.vente[language].title,
    description: SEO_DATA.vente[language].description,
    canonical: "https://www.artimonbike.com/vente"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-orange-500">{t.salePage.title}</span> {t.salePage.titleHighlight}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.salePage.description}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.salePage.findPerfect} <span className="text-orange-500">{t.salePage.findPerfectHighlight}</span></h2>
              <p className="text-gray-600 mb-6">{t.salePage.intro}</p>
              <ul className="space-y-4 mb-8">
                {t.salePage.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3"><CheckIcon className="w-5 h-5 text-orange-500" /><span className="text-gray-700">{item}</span></li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary px-8 py-4 rounded-xl text-white font-semibold inline-flex items-center gap-2">{t.salePage.contactUs}</Link>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500&h=400&fit=crop&q=60&auto=format" alt="Vélos en vente" className="rounded-2xl shadow-xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
      <CTASection />
      <ContactSection />
    </div>
  );
};

// ==================== BIKE PATHS PAGE ====================
const BikePathsPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.parcours[language].title,
    description: SEO_DATA.parcours[language].description,
    canonical: "https://www.artimonbike.com/parcours"
  });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filterRoute, setFilterRoute] = useState('all');

  const getDifficultyLabel = (difficulty) => {
    return t.bikePaths[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'veryEasy': return 'bg-green-100 text-green-700';
      case 'easy': return 'bg-blue-100 text-blue-700';
      case 'moderate': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRoutes = filterRoute === 'all' 
    ? t.bikePaths.routes 
    : t.bikePaths.routes.filter(r => r.id === parseInt(filterRoute));

  return (
    <div className="pt-20" data-testid="bike-paths-page">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t.bikePaths.title} <span className="text-orange-500">{t.bikePaths.titleHighlight}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.bikePaths.description}</p>
          </div>
        </div>
      </section>

      {/* Map Section with Google Maps */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.bikePaths.mapTitle}</h2>
          
          {/* Route Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilterRoute('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterRoute === 'all' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
              }`}
              data-testid="filter-all"
            >
              {t.bikePaths.allRoutes}
            </button>
            {t.bikePaths.routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setFilterRoute(route.id.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterRoute === route.id.toString() 
                    ? 'text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                }`}
                style={filterRoute === route.id.toString() ? { backgroundColor: route.color } : {}}
                data-testid={`filter-btn-${route.id}`}
              >
                {route.name}
              </button>
            ))}
          </div>

          {/* Google Maps Embed */}
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg" data-testid="bike-paths-map">
            <iframe
              src="https://maps.google.com/maps?q=Artimon+Bike+Nautique+Marseillan&t=&z=12&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte des parcours vélo"
            />
          </div>
        </div>
      </section>

      {/* Routes List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {filteredRoutes.map((route, index) => (
              <div 
                key={route.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4"
                style={{ borderLeftColor: route.color }}
                data-testid={`route-card-${route.id}`}
              >
                <div className="p-6 md:p-8">
                  {/* Header with number and title */}
                  <div className="flex items-center gap-4 mb-4">
                    <span 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.id}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{route.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-lg mb-6">{route.description}</p>
                  
                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📏</span>
                      <div>
                        <div className="text-sm text-gray-500">{t.bikePaths.distance}</div>
                        <div className="font-bold text-gray-900 text-lg">{route.distance}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⏱️</span>
                      <div>
                        <div className="text-sm text-gray-500">{t.bikePaths.duration}</div>
                        <div className="font-bold text-gray-900 text-lg">{route.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⛰️</span>
                      <div>
                        <div className="text-sm text-gray-500">{t.bikePaths.elevation}</div>
                        <div className="font-bold text-gray-900 text-lg">{route.elevation}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(route.difficulty)}`}>
                        {getDifficultyLabel(route.difficulty)}
                      </span>
                    </div>
                  </div>

                  {/* Points of Interest Tags */}
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-3">{t.bikePaths.pointsOfInterest}:</div>
                    <div className="flex flex-wrap gap-2">
                      {route.highlights.map((highlight, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Points of Interest Details */}
                  {route.pointsOfInterest && (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-700 mb-3">{t.bikePaths.toDiscover}:</div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {route.pointsOfInterest.map((poi, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl">{poi.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{poi.name}</div>
                              <div className="text-gray-500 text-xs">{poi.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start Point & Recommended Bike */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6 p-4 bg-orange-50 rounded-xl">
                    <div>
                      <span className="font-bold text-gray-900">{t.bikePaths.startPoint}:</span> {route.startPoint}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{t.bikePaths.recommendedBike}:</span> {route.recommendedBike}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={route.launchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 hover:scale-105"
                      style={{ backgroundColor: route.color }}
                      data-testid={`launch-btn-${route.id}`}
                    >
                      {t.bikePaths.launchItinerary}
                    </a>
                    <a
                      href={route.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2"
                      style={{ borderColor: route.color, color: route.color }}
                      data-testid={`view-btn-${route.id}`}
                    >
                      {t.bikePaths.viewOnMap}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t.bikePaths.tips}
            </h2>
            <ul className="space-y-4">
              {t.bikePaths.tipsContent.map((tip, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-lg">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.bikePaths.ctaTitle}</h2>
          <p className="text-white/90 text-lg mb-8">{t.bikePaths.ctaDescription}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={BUSINESS_INFO.lokkiUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all inline-flex items-center gap-2 shadow-lg"
              data-testid="parcours-cta-btn"
            >
              <img src="/logo.svg" alt="" className="w-6 h-6" />
              Réserver sur la plateforme
            </a>
            <a 
              href={BUSINESS_INFO.phoneLink} 
              className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 hover:scale-105 transition-all inline-flex items-center gap-2 backdrop-blur-sm"
            >
              <PhoneIcon className="w-5 h-5" />
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const TarifsPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.tarifs[language].title,
    description: SEO_DATA.tarifs[language].description,
    canonical: "https://www.artimonbike.com/tarifs"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.pricing.title} <span className="text-orange-500">{t.pricing.titleHighlight}</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.pricing.description}</p>
          </div>
        </div>
      </section>
      <PricingSection />
      <CTASection />
    </div>
  );
};

const ContactPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.contact[language].title,
    description: SEO_DATA.contact[language].description,
    canonical: "https://www.artimonbike.com/contact"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6"><span className="text-orange-500">{t.contact.title}</span>{t.contact.titleHighlight}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.contact.description}</p>
          </div>
        </div>
      </section>
      <ContactSection />
    </div>
  );
};

const FAQPage = () => {
  const { t, language } = useLanguage();
  useSEO({
    title: SEO_DATA.faq[language].title,
    description: SEO_DATA.faq[language].description,
    canonical: "https://www.artimonbike.com/faq"
  });

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.faq.title} <span className="text-orange-500">{t.faq.titleHighlight}</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{t.faq.description}</p>
          </div>
        </div>
      </section>
      <FAQSection showFull />
      <CTASection />
    </div>
  );
};

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

// ==================== SCROLL TO TOP ====================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ==================== BLOG SECTION (Homepage) ====================
const BlogSection = () => {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);
        if (response.ok) {
          const data = await response.json();
          // Filter articles based on current language
          // English articles have "english" tag, French articles don't have it
          const filteredArticles = data.filter(article => {
            const hasEnglishTag = article.tags && article.tags.includes('english');
            if (language === 'en') {
              return hasEnglishTag;
            } else {
              return !hasEnglishTag;
            }
          });
          setArticles(filteredArticles.slice(0, 3));
        }
      } catch (error) {
        console.log("Error fetching blog articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [language]);

  if (loading || articles.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50" data-testid="blog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Notre' : 'Our'} <span className="text-orange-500">Blog</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Actualités, conseils et découvertes autour du vélo et de notre belle région'
              : 'News, tips and discoveries about cycling and our beautiful region'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link 
              key={article.id}
              to={`/blog/${article.slug}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-orange-500 mb-3">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            {language === 'fr' ? 'Voir tous les articles' : 'View all articles'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ==================== BLOG PAGE ====================
const BlogPage = () => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: language === 'fr' ? "Blog | Artimon Bike - Actualités vélo" : "Blog | Artimon Bike - Cycling News",
    description: language === 'fr' 
      ? "Découvrez nos articles sur le vélo, les pistes cyclables et les actualités de la région de l'Étang de Thau"
      : "Discover our articles about cycling, bike paths and news from the Étang de Thau region",
    canonical: "https://www.artimonbike.com/blog"
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);
        if (response.ok) {
          const data = await response.json();
          // Filter articles based on current language
          // English articles have "english" tag, French articles don't have it
          const filteredArticles = data.filter(article => {
            const hasEnglishTag = article.tags && article.tags.includes('english');
            if (language === 'en') {
              return hasEnglishTag;
            } else {
              return !hasEnglishTag;
            }
          });
          setArticles(filteredArticles);
        }
      } catch (error) {
        console.log("Error fetching blog articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [language]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-orange-500">Blog</span> Artimon Bike
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {language === 'fr' 
                ? "Actualités, conseils et découvertes autour du vélo"
                : "News, tips and discoveries about cycling"}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun article pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link 
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-orange-500 mb-3">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {article.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <CTASection />
    </div>
  );
};

// ==================== ARTICLE PAGE ====================
const ArticlePage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          setError("Article non trouvé");
        }
      } catch (error) {
        setError("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  useSEO({
    title: article ? `${article.title} | Artimon Bike` : "Article | Artimon Bike",
    description: article?.excerpt || "",
    canonical: `https://www.artimonbike.com/blog/${slug}`
  });

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <Link to="/blog" className="text-orange-500 hover:underline">Retour au blog</Link>
        </div>
      </div>
    );
  }

  // Simple markdown to HTML converter
  const renderContent = (content) => {
    return content
      .split('\n\n')
      .map((paragraph, i) => {
        if (paragraph.startsWith('# ')) {
          return <h1 key={i} className="text-3xl font-bold text-gray-900 mb-6">{paragraph.slice(2)}</h1>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.slice(3)}</h2>;
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{paragraph.slice(4)}</h3>;
        }
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(l => l.startsWith('- '));
          return (
            <ul key={i} className="list-disc list-inside space-y-2 mb-4 text-gray-700">
              {items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}
            </ul>
          );
        }
        if (paragraph.match(/^\d+\./)) {
          const items = paragraph.split('\n').filter(l => l.match(/^\d+\./));
          return (
            <ol key={i} className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
              {items.map((item, j) => <li key={j}>{item.replace(/^\d+\.\s*/, '')}</li>)}
            </ol>
          );
        }
        // Handle bold text with **
        const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
      });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={article.image_url} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-white/80 mb-4">
              <span className="px-3 py-1 bg-orange-500 rounded-full text-sm font-medium text-white">{article.category}</span>
              <span>{new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>{article.author}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{article.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {renderContent(article.content)}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link 
                to="/blog"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                {language === 'fr' ? 'Retour au blog' : 'Back to blog'}
              </Link>
            </div>
          </div>
        </div>
      </article>
      <CTASection />
    </div>
  );
};

// ==================== ADMIN PAGE ====================
const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", content: "", image_url: "", category: "Actualités", tags: "", published: true
  });

  const authHeader = authToken ? `Bearer ${authToken}` : "";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        fetchDataWithToken(data.token);
      } else {
        setError(data.detail || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataWithToken = async (token) => {
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      const [articlesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/blog?published_only=false`, { headers }),
        fetch(`${API_URL}/api/admin/stats`, { headers })
      ]);
      if (articlesRes.ok) setArticles(await articlesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Error fetching data");
    }
  };

  const fetchData = async () => {
    if (authToken) {
      fetchDataWithToken(authToken);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const articleData = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(t => t)
    };

    try {
      const url = editingArticle 
        ? `${API_URL}/api/blog/${editingArticle.slug}`
        : `${API_URL}/api/blog`;
      const method = editingArticle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(articleData)
      });

      if (response.ok) {
        setEditingArticle(null);
        setFormData({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "Actualités", tags: "", published: true });
        fetchData();
      } else {
        const err = await response.json();
        setError(err.detail || "Erreur");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      const response = await fetch(`${API_URL}/api/blog/${slug}`, {
        method: "DELETE",
        headers: { "Authorization": authHeader }
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error("Error deleting article");
    }
  };

  const startEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image_url: article.image_url,
      category: article.category,
      tags: article.tags?.join(", ") || "",
      published: article.published
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Administration</h1>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@artimonbike.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panneau d'administration</h1>
          <button 
            onClick={() => { setIsAuthenticated(false); setEmail(""); setPassword(""); setAuthToken(""); }}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-orange-500">{stats.total_articles}</div>
              <div className="text-gray-600">Articles total</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-500">{stats.published_articles}</div>
              <div className="text-gray-600">Publiés</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-yellow-500">{stats.draft_articles}</div>
              <div className="text-gray-600">Brouillons</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Article Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingArticle ? "Modifier l'article" : "Nouvel article"}
            </h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (Markdown)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Actualités</option>
                    <option>Conseils</option>
                    <option>Itinéraires</option>
                    <option>Équipement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par ,)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="w-4 h-4 text-orange-500 rounded"
                />
                <label className="text-sm text-gray-700">Publier immédiatement</label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "..." : (editingArticle ? "Mettre à jour" : "Créer l'article")}
                </button>
                {editingArticle && (
                  <button
                    type="button"
                    onClick={() => { setEditingArticle(null); setFormData({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "Actualités", tags: "", published: true }); }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Articles List */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Articles ({articles.length})</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {articles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{article.excerpt.slice(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {article.published ? 'Publié' : 'Brouillon'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(article.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(article)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(article.slug)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PAGE 404 ====================
const NotFoundPage = () => {
  const { language } = useLanguage();
  
  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div
         
         
         
        >
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

// ==================== MAIN APP ====================
function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const cookieChoice = localStorage.getItem("cookieConsent");
    if (!cookieChoice) {
      setTimeout(() => setShowCookieConsent(true), 1500);
    }
  }, []);

  const handleCookieAccept = (preferences) => {
    localStorage.setItem("cookieConsent", JSON.stringify({ accepted: true, preferences }));
    setShowCookieConsent(false);
  };

  const handleCookieReject = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({ accepted: false }));
    setShowCookieConsent(false);
  };

  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <RedirectHandler />
          <Navigation />
          <main>
            <Routes>
              {/* Pages principales */}
              <Route path="/" element={<HomePage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/reparation" element={<ReparationPage />} />
              <Route path="/vente" element={<VentePage />} />
              <Route path="/parcours" element={<BikePathsPage />} />
              <Route path="/tarifs" element={<TarifsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
              
              {/* Redirections 301 explicites pour anciennes URLs */}
              <Route path="/bike-routes" element={<Navigate to="/parcours" replace />} />
              <Route path="/routes" element={<Navigate to="/parcours" replace />} />
              <Route path="/nos-tarifs" element={<Navigate to="/tarifs" replace />} />
              <Route path="/donnees-personnelles" element={<Navigate to="/politique-confidentialite" replace />} />
              <Route path="/balise-h1" element={<Navigate to="/" replace />} />
              <Route path="/h1" element={<Navigate to="/" replace />} />
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/accueil" element={<Navigate to="/" replace />} />
              <Route path="/rental" element={<Navigate to="/location" replace />} />
              <Route path="/repair" element={<Navigate to="/reparation" replace />} />
              <Route path="/sale" element={<Navigate to="/vente" replace />} />
              <Route path="/prices" element={<Navigate to="/tarifs" replace />} />
              <Route path="/vente-velos-trottinettes" element={<Navigate to="/vente" replace />} />
              <Route path="/louer-velo-marseillan" element={<Navigate to="/location" replace />} />
              <Route path="/reparateur-velo-marseillan" element={<Navigate to="/reparation" replace />} />
              
              {/* Page 404 pour toutes les autres URLs */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          
            {showCookieConsent && <CookieConsent onAccept={handleCookieAccept} onReject={handleCookieReject} />}
          
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
