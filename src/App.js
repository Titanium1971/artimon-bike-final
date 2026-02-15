import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Context & Layout
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { CookieConsent } from "./components/ui/CookieConsent";
import GoogleAnalytics from "./components/GoogleAnalytics";

// Pages
import {
  HomePage,
  LocationPage,
  ReparationPage,
  VentePage,
  BikePathsPage,
  TarifsPage,
  ContactPage,
  FAQPage,
  BlogPage,
  ArticlePage,
  AdminPage,
  MentionsLegalesPage,
  PolitiqueConfidentialitePage,
  NotFoundPage
} from "./pages";

// Redirects configuration
import { REDIRECTS } from "./constants";

// SEO-friendly redirect handler
const RedirectHandler = () => {
  const location = useLocation();
  const redirectTo = REDIRECTS[location.pathname.toLowerCase()];
  
  if (redirectTo) {
    console.log(`[SEO Redirect 301] ${location.pathname} → ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }
  
  return null;
};

// Scroll to top on route change
// Fix Leaflet marker icons
// ==================== TRANSLATIONS ====================
const translations = {
  fr: {
    nav: { home: "Accueil", rental: "Location", repair: "Réparation", sale: "Vente", prices: "Tarifs", routes: "Parcours", contact: "Contact", faq: "FAQ", book: "Réserver" },
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
        { q: "Proposez-vous la livraison des vélos ?", a: "Oui ! Pour vous faciliter la vie, nous livrons vos vélos directement à votre hébergement. Service disponible à partir de 4 vélos et 3 jours de location minimum, au tarif avantageux de 30€ par vélo. Idéal pour les familles et les groupes qui souhaitent profiter de leurs vacances sans contrainte !" },
        { q: "Que faire en cas de crevaison pendant ma location ?", a: "Pas de panique ! Appelez-nous immédiatement au 04 82 29 87 70. Nous proposons un service de réparation rapide, y compris les crevaisons à la minute." },
        { q: "Puis-je réserver un vélo à l'avance ?", a: "Absolument ! Nous vous conseillons de réserver à l'avance, surtout en haute saison. Vous pouvez réserver en ligne via notre partenaire <a href='https://www.lokki.rent/loueur/artimon' target='_blank' rel='noopener noreferrer' class='text-orange-600 hover:text-orange-700 underline font-medium'>Lokki</a> ou <a href='/contact' class='text-orange-600 hover:text-orange-700 underline font-medium'>nous contacter</a> directement." },
        { q: "Quelles sont vos garanties sur les réparations ?", a: "Toutes nos réparations sont garanties. Nous utilisons des pièces de qualité et notre équipe de professionnels assure un travail soigné." },
      ],
    },
    tourismOffices: {
      title: "Offices de Tourisme",
      description: "Découvrez les richesses de notre région",
      offices: [
        { city: "Marseillan", url: "https://www.marseillan-tourisme.com/", icon: "🏖️" },
        { city: "Agde", url: "https://www.capdagde.com/", icon: "⚓" },
        { city: "Mèze", url: "https://www.thau-mediterranee.com/", icon: "🦪" },
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
      info: { address: "Adresse", viewOnMaps: "Voir sur Google Maps", hours: "Horaires", hoursValue: "9h30 - 12h / 14h30 - 18h30", hoursNote: "Tous les jours", phone: "Téléphone" },
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
      openInGoogleMaps: "Ouvrir dans Google Maps",
      downloadGPX: "Télécharger GPX",
      difficulty: "Difficulté",
      distance: "Distance",
      duration: "Durée",
      elevation: "Dénivelé",
      veryEasy: "Très facile",
      easy: "Facile",
      moderate: "Modéré",
      highlights: "Points d'intérêt",
      pointsOfInterest: "À découvrir sur le parcours",
      startPoint: "Point de départ",
      recommendedBike: "Vélo recommandé",
      tips: "Conseils pratiques",
      tipsContent: ["Partez tôt le matin en été pour éviter la chaleur", "Emportez suffisamment d'eau (2L minimum)", "Prévoyez des arrêts aux restaurants d'huîtres", "Protégez-vous du soleil (crème, casquette)", "Vérifiez la météo avant de partir"],
      routes: [
        {
          id: "tour-etang-thau",
          name: "Tour Complet de l'Étang de Thau",
          description: "La grande boucle complète de 60 km autour de l'Étang de Thau. Départ et retour à la boutique Artimon Bike. Pistes cyclables sécurisées avec des vues spectaculaires.",
          distance: "60 km",
          duration: "4-5h",
          elevation: "116 m",
          difficulty: "veryEasy",
          color: "#3B82F6",
          highlights: ["Belle-vue", "Port de Mèze", "Bouzigues et ses parcs à huîtres", "Sète et le Mont Saint-Clair", "Voie verte du Lido", "Marseillan-Plage", "Phare des Onglous"],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "VTC ou Vélo électrique",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/9HX9%2B62+M%C3%A8ze/M%C3%A8ze/Bouzigues/S%C3%A8te/Voie+Verte+du+Lido/Marseillan-Plage/8GQQ%2BR7+Marseillan/Artimon+Bike+Marseillan/@43.4,3.58,12z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3643, 3.5567],
            [43.4317, 3.6050],
            [43.4279, 3.5996],
            [43.4591, 3.6612],
            [43.4376, 3.6753],
            [43.4002, 3.6969],
            [43.3878, 3.6234],
            [43.3144, 3.5489],
            [43.3548, 3.5377]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Point de départ et d'arrivée" },
            { name: "Belle-vue", coords: [43.4317, 3.6050], icon: "🌅", description: "Point de vue panoramique sur l'étang" },
            { name: "Port de Mèze", coords: [43.4279, 3.5996], icon: "⚓", description: "Village de pêcheurs authentique" },
            { name: "Bouzigues", coords: [43.4591, 3.6612], icon: "🦪", description: "Capitale de l'huître de Thau" },
            { name: "Mont Saint-Clair", coords: [43.3878, 3.6234], icon: "⛰️", description: "Panorama à 360° sur la région" },
            { name: "Voie verte du Lido", coords: [43.3511, 3.5862], icon: "🌿", description: "Piste cyclable entre mer et étang" },
            { name: "Marseillan-Plage", coords: [43.3144, 3.5489], icon: "🏖️", description: "Plages et baignade" },
            { name: "Phare des Onglous", coords: [43.3643, 3.5567], icon: "🗼", description: "Embouchure du Canal du Midi" }
          ]
        },
        {
          id: "marseillan-sete",
          name: "Artimon → Sète (Voie Verte du Lido)",
          description: "Magnifique piste cyclable au départ de la boutique. Traversez les dunes entre Méditerranée et Étang de Thau jusqu'à Sète.",
          distance: "14 km",
          duration: "1h15",
          elevation: "15 m",
          difficulty: "veryEasy",
          color: "#10B981",
          highlights: ["Phare des Onglous", "Plages sauvages du Lido", "Vue sur les deux mers", "Phare de Sète"],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "Tout type de vélo",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/S%C3%A8te/@43.37,3.58,13z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3643, 3.5567],
            [43.3144, 3.5489],
            [43.3511, 3.5862],
            [43.3878, 3.6234]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Point de départ" },
            { name: "Phare des Onglous", coords: [43.3643, 3.5567], icon: "🗼", description: "Photo incontournable" },
            { name: "Plage du Lido", coords: [43.3144, 3.5489], icon: "🏖️", description: "Plage sauvage préservée" },
            { name: "Sète", coords: [43.3878, 3.6234], icon: "🎣", description: "Ville portuaire pittoresque" }
          ]
        },
        {
          id: "marseillan-agde",
          name: "Artimon → Agde (Canal du Midi)",
          description: "Suivez le célèbre Canal du Midi classé UNESCO au départ de la boutique. Parcours ombragé sous les platanes centenaires.",
          distance: "8 km",
          duration: "45min",
          elevation: "10 m",
          difficulty: "veryEasy",
          color: "#F59E0B",
          highlights: ["Port de Marseillan", "Canal du Midi (UNESCO)", "Écluse ronde d'Agde", "Cathédrale Saint-Étienne"],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "Tout type de vélo",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/Agde/@43.33,3.5,14z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3448, 3.5277],
            [43.3328, 3.5071],
            [43.3107, 3.4765]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Point de départ" },
            { name: "Canal du Midi", coords: [43.3448, 3.5277], icon: "🌳", description: "Patrimoine UNESCO" },
            { name: "Écluse ronde", coords: [43.3200, 3.4900], icon: "🔒", description: "Unique au monde !" },
            { name: "Agde", coords: [43.3107, 3.4765], icon: "🏛️", description: "Cité grecque historique" }
          ]
        },
        {
          id: "marseillan-meze-bouzigues",
          name: "Artimon → Mèze → Bouzigues",
          description: "La route des huîtres au départ de la boutique ! Longez l'étang et découvrez les villages ostréicoles avec dégustation chez les producteurs.",
          distance: "18 km",
          duration: "1h30",
          elevation: "45 m",
          difficulty: "easy",
          color: "#8B5CF6",
          highlights: ["Étang de Thau", "Belle-vue", "Port de Mèze", "Mas conchylicoles", "Musée de l'Étang de Thau", "Dégustation d'huîtres"],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "VTC ou Vélo électrique",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/9HX9%2B62+M%C3%A8ze/M%C3%A8ze/Bouzigues/@43.4,3.6,13z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.4317, 3.6050],
            [43.4279, 3.5996],
            [43.4591, 3.6612]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Point de départ" },
            { name: "Belle-vue", coords: [43.4317, 3.6050], icon: "🌅", description: "Point de vue panoramique sur l'étang" },
            { name: "Port de Mèze", coords: [43.4279, 3.5996], icon: "⚓", description: "Restaurants et ambiance" },
            { name: "Bouzigues", coords: [43.4591, 3.6612], icon: "🦪", description: "Dégustation huîtres" }
          ]
        },
        {
          id: "pointe-onglous",
          name: "Artimon → Phare des Onglous",
          description: "Balade familiale facile au départ de la boutique jusqu'au point de rencontre du Canal du Midi et de l'Étang de Thau. Idéal pour les familles.",
          distance: "3 km",
          duration: "20min",
          elevation: "5 m",
          difficulty: "veryEasy",
          color: "#EC4899",
          highlights: ["Port de Marseillan", "Embouchure du Canal du Midi", "Phare des Onglous", "Vue sur le Mont Saint-Clair"],
          startPoint: "Artimon Bike - Port de Marseillan",
          recommendedBike: "Tout type de vélo (idéal familles)",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/8GQQ%2BR7+Marseillan/@43.36,3.55,15z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3595, 3.5472],
            [43.3643, 3.5567]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Point de départ" },
            { name: "Phare des Onglous", coords: [43.3643, 3.5567], icon: "🗼", description: "Vue panoramique" },
            { name: "Aire de pique-nique", coords: [43.3620, 3.5520], icon: "🧺", description: "Pause détente" }
          ]
        }
      ]
    },
  },
  en: {
    nav: { home: "Home", rental: "Rental", repair: "Repair", sale: "Shop", prices: "Prices", routes: "Routes", contact: "Contact", faq: "FAQ", book: "Book Now" },
    hero: {
      badge: "Open every day 9:30am-12pm / 2:30pm-6:30pm",
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
        { q: "Do you offer bike delivery?", a: "Yes! To make your life easier, we deliver bikes directly to your accommodation. Service available from 4 bikes and 3 days rental minimum, at the attractive rate of €30 per bike. Perfect for families and groups who want to enjoy their holidays hassle-free!" },
        { q: "What to do if I get a flat tire during my rental?", a: "Don't panic! Call us immediately at 04 82 29 87 70. We offer quick repair service, including instant puncture repairs." },
        { q: "Can I book a bike in advance?", a: "Absolutely! We recommend booking in advance, especially during peak season. You can book online through our partner <a href='https://www.lokki.rent/loueur/artimon' target='_blank' rel='noopener noreferrer' class='text-orange-600 hover:text-orange-700 underline font-medium'>Lokki</a> or <a href='/contact' class='text-orange-600 hover:text-orange-700 underline font-medium'>contact us</a> directly." },
        { q: "What are your repair warranties?", a: "All our repairs are guaranteed. We use quality parts and our team of professionals ensures careful work." },
      ],
    },
    tourismOffices: {
      title: "Tourism Offices",
      description: "Discover the treasures of our region",
      offices: [
        { city: "Marseillan", url: "https://www.marseillan-tourisme.com/", icon: "🏖️" },
        { city: "Agde", url: "https://www.capdagde.com/", icon: "⚓" },
        { city: "Mèze", url: "https://www.thau-mediterranee.com/", icon: "🦪" },
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
      info: { address: "Address", viewOnMaps: "View on Google Maps", hours: "Hours", hoursValue: "9:30am-12pm / 2:30pm-6:30pm", hoursNote: "Every day", phone: "Phone" },
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
      openInGoogleMaps: "Open in Google Maps",
      downloadGPX: "Download GPX",
      difficulty: "Difficulty",
      distance: "Distance",
      duration: "Duration",
      elevation: "Elevation",
      veryEasy: "Very easy",
      easy: "Easy",
      moderate: "Moderate",
      highlights: "Points of interest",
      pointsOfInterest: "Discover along the route",
      startPoint: "Starting point",
      recommendedBike: "Recommended bike",
      tips: "Practical tips",
      tipsContent: ["Start early in summer to avoid the heat", "Bring enough water (2L minimum)", "Plan stops at oyster restaurants", "Protect yourself from the sun", "Check the weather before leaving"],
      routes: [
        {
          id: "tour-etang-thau",
          name: "Complete Tour of Étang de Thau",
          description: "The full 60 km loop around the Étang de Thau. Start and return at Artimon Bike shop. Secure cycle paths with spectacular views.",
          distance: "60 km",
          duration: "4-5h",
          elevation: "116 m",
          difficulty: "veryEasy",
          color: "#3B82F6",
          highlights: ["Belle-vue", "Mèze Harbor", "Bouzigues oyster farms", "Sète & Mont Saint-Clair", "Lido Greenway", "Marseillan-Plage", "Onglous Lighthouse"],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Hybrid or Electric bike",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/9HX9%2B62+M%C3%A8ze/M%C3%A8ze/Bouzigues/S%C3%A8te/Voie+Verte+du+Lido/Marseillan-Plage/8GQQ%2BR7+Marseillan/Artimon+Bike+Marseillan/@43.4,3.58,12z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3643, 3.5567],
            [43.4317, 3.6050],
            [43.4279, 3.5996],
            [43.4591, 3.6612],
            [43.4376, 3.6753],
            [43.4002, 3.6969],
            [43.3878, 3.6234],
            [43.3144, 3.5489],
            [43.3548, 3.5377]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Start & finish point" },
            { name: "Belle-vue", coords: [43.4317, 3.6050], icon: "🌅", description: "Panoramic viewpoint over the lagoon" },
            { name: "Mèze Harbor", coords: [43.4279, 3.5996], icon: "⚓", description: "Authentic fishing village" },
            { name: "Bouzigues", coords: [43.4591, 3.6612], icon: "🦪", description: "Oyster capital of Thau" },
            { name: "Mont Saint-Clair", coords: [43.3878, 3.6234], icon: "⛰️", description: "360° panorama" },
            { name: "Lido Greenway", coords: [43.3511, 3.5862], icon: "🌿", description: "Cycle path between sea and lagoon" },
            { name: "Marseillan-Plage", coords: [43.3144, 3.5489], icon: "🏖️", description: "Beaches & swimming" },
            { name: "Onglous Lighthouse", coords: [43.3643, 3.5567], icon: "🗼", description: "Canal du Midi outlet" }
          ]
        },
        {
          id: "marseillan-sete",
          name: "Artimon → Sète (Lido Greenway)",
          description: "Beautiful cycle path from the shop. Cross the dunes between Mediterranean and Étang de Thau to reach Sète.",
          distance: "14 km",
          duration: "1h15",
          elevation: "15 m",
          difficulty: "veryEasy",
          color: "#10B981",
          highlights: ["Onglous Lighthouse", "Wild Lido beaches", "View of both seas", "Sète lighthouse"],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Any bike type",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/S%C3%A8te/@43.37,3.58,13z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3643, 3.5567],
            [43.3144, 3.5489],
            [43.3511, 3.5862],
            [43.3878, 3.6234]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Starting point" },
            { name: "Onglous Lighthouse", coords: [43.3643, 3.5567], icon: "🗼", description: "Must-take photo" },
            { name: "Lido Beach", coords: [43.3144, 3.5489], icon: "🏖️", description: "Preserved wild beach" },
            { name: "Sète", coords: [43.3878, 3.6234], icon: "🎣", description: "Picturesque port town" }
          ]
        },
        {
          id: "marseillan-agde",
          name: "Artimon → Agde (Canal du Midi)",
          description: "Follow the famous UNESCO-listed Canal du Midi from the shop. Shaded path under century-old plane trees.",
          distance: "8 km",
          duration: "45min",
          elevation: "10 m",
          difficulty: "veryEasy",
          color: "#F59E0B",
          highlights: ["Marseillan Harbor", "Canal du Midi (UNESCO)", "Round lock of Agde", "Saint-Étienne Cathedral"],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Any bike type",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/Agde/@43.33,3.5,14z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3448, 3.5277],
            [43.3328, 3.5071],
            [43.3107, 3.4765]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Starting point" },
            { name: "Canal du Midi", coords: [43.3448, 3.5277], icon: "🌳", description: "UNESCO Heritage" },
            { name: "Round Lock", coords: [43.3200, 3.4900], icon: "🔒", description: "Unique in the world!" },
            { name: "Agde", coords: [43.3107, 3.4765], icon: "🏛️", description: "Historic Greek city" }
          ]
        },
        {
          id: "marseillan-meze-bouzigues",
          name: "Artimon → Mèze → Bouzigues",
          description: "The oyster route from the shop! Ride along the lagoon and discover shellfish villages with tastings at producers.",
          distance: "18 km",
          duration: "1h30",
          elevation: "45 m",
          difficulty: "easy",
          color: "#8B5CF6",
          highlights: ["Étang de Thau", "Belle-vue", "Mèze Harbor", "Oyster farms", "Thau Lagoon Museum", "Oyster tasting"],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Hybrid or Electric bike",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/9HX9%2B62+M%C3%A8ze/M%C3%A8ze/Bouzigues/@43.4,3.6,13z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.4317, 3.6050],
            [43.4279, 3.5996],
            [43.4591, 3.6612]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Starting point" },
            { name: "Belle-vue", coords: [43.4317, 3.6050], icon: "🌅", description: "Panoramic viewpoint over the lagoon" },
            { name: "Mèze Harbor", coords: [43.4279, 3.5996], icon: "⚓", description: "Restaurants & atmosphere" },
            { name: "Bouzigues", coords: [43.4591, 3.6612], icon: "🦪", description: "Oyster tasting" }
          ]
        },
        {
          id: "pointe-onglous",
          name: "Artimon → Phare des Onglous",
          description: "Easy family ride from the shop to where Canal du Midi meets Étang de Thau. Perfect for families with children.",
          distance: "3 km",
          duration: "20min",
          elevation: "5 m",
          difficulty: "veryEasy",
          color: "#EC4899",
          highlights: ["Marseillan Harbor", "Canal du Midi outlet", "Onglous Lighthouse", "View of Mont Saint-Clair"],
          startPoint: "Artimon Bike - Marseillan Harbor",
          recommendedBike: "Any bike (ideal for families)",
          googleMapsUrl: "https://www.google.com/maps/dir/Artimon+Bike+Marseillan/8GQQ%2BR7+Marseillan/@43.36,3.55,15z/data=!4m2!4m1!3e1",
          coordinates: [
            [43.3548, 3.5377],
            [43.3595, 3.5472],
            [43.3643, 3.5567]
          ],
          pointsOfInterest: [
            { name: "Artimon Bike", coords: [43.3548, 3.5377], icon: "🚴", description: "Starting point" },
            { name: "Onglous Lighthouse", coords: [43.3643, 3.5567], icon: "🗼", description: "Panoramic view" },
            { name: "Picnic area", coords: [43.3620, 3.5520], icon: "🧺", description: "Rest stop" }
          ]
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
  phone: "04 82 29 87 70",
  phoneLink: "tel:+33482298770",
  email: "sebarilla@gmail.com",
  address: "Quai de Toulon, Zone Technique du Port",
  city: "34340 Marseillan",
  googleMapsUrl: "https://g.page/r/Cfk6UbA9DChAEAE",
  googleReviewUrl: "https://g.page/r/Cfk6UbA9DChAEAg/review",
  lokkiUrl: "https://www.lokki.rent/loueur/artimon",
  coordinates: [43.3548, 3.5377],
  rating: 4.6,
  reviewCount: 89,
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
                {t.cookies.continueText} <Link to="/politique-confidentialite" className="text-orange-600 underline hover:text-orange-700">{t.footer.privacyPolicy}</Link> {t.cookies.and} <Link to="/mentions-legales" className="text-orange-600 underline hover:text-orange-700">{t.footer.legalNotice}</Link>
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
    { name: t.nav.contact, path: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${shouldShowDarkNav ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`} data-testid="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <BikeIcon className="w-7 h-7 text-white" />
              </div>
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

            <div className="hidden lg:flex items-center gap-4">
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
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <BikeIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Artimon Bike</span>
                <p className="text-gray-400 text-xs">Marseillan</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">{t.footer.description}</p>
            <div className="flex gap-4">
              <a href="#" className="social-icon text-gray-400 hover:text-orange-500" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="social-icon text-gray-400 hover:text-orange-500" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" className="social-icon text-gray-400 hover:text-orange-500" aria-label="Twitter"><TwitterIcon /></a>
              <a href="#" className="social-icon text-gray-400 hover:text-orange-500" aria-label="YouTube"><YouTubeIcon /></a>
              <a href="#" className="social-icon text-gray-400 hover:text-orange-500" aria-label="TikTok"><TikTokIcon /></a>
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
              <li>
                <a href={BUSINESS_INFO.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  {BUSINESS_INFO.rating}/5 ({BUSINESS_INFO.reviewCount} {t.hero.reviews})
                </a>
              </li>
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
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Artimon Bike Marseillan. {t.footer.allRights}</p>
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

      {/* Simplified background elements - no continuous animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-orange-300 text-sm font-medium">{t.hero.badge}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t.hero.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{t.hero.titleHighlight}</span>{" "}
              {t.hero.titleEnd}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">{t.hero.description}</p>

            <div className="flex flex-wrap gap-4 mb-8">
              <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2" data-testid="hero-reservation-btn">
                <BikeIcon className="w-6 h-6" />
                {t.hero.bookBtn}
              </a>
              <Link to="/tarifs" className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2" data-testid="hero-tarifs-btn">
                {t.hero.pricesBtn}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className={`w-5 h-5 ${star <= Math.floor(BUSINESS_INFO.rating) ? "text-yellow-400" : "text-gray-500"}`} filled={star <= Math.floor(BUSINESS_INFO.rating)} />
                ))}
              </div>
              <span className="text-white font-semibold">{BUSINESS_INFO.rating}/5</span>
              <a href={BUSINESS_INFO.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors">
                ({BUSINESS_INFO.reviewCount} {t.hero.reviews})
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-2xl opacity-30 transform rotate-3" />
              <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=400&fit=crop&q=60&auto=format" alt="Vélo électrique Artimon Bike" className="relative rounded-3xl shadow-2xl w-full object-cover" loading="lazy" />
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
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

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
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
            {language === 'fr' ? 'Notre localisation vous permet d\'explorer' : 'Our location lets you explore'}
            <span className="text-orange-500"> {language === 'fr' ? 'nos 3 sites touristiques' : 'our 3 tourist sites'}</span>
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
                
                {/* Lien vers office de tourisme */}
                <p className="mt-3 text-xs text-white/60 flex items-center justify-center gap-1">
                  <span>🏛️</span>
                  <span>{language === 'fr' ? "Office de tourisme" : "Tourism office"}</span>
                  <svg className="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </p>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700" />
              </div>
            </a>
          ))}
        </div>

        {/* Animation de connexion entre les villes - simplified */}
        <div 
          className="flex justify-center items-center mt-8 gap-4"
         
         
         
        >
          <div className="text-3xl">🚴</div>
          <div className="flex-1 max-w-xs h-1 bg-gradient-to-r from-blue-500 via-gray-700 to-emerald-500 rounded-full" />
          <div className="text-3xl transform scale-x-[-1]">🚴</div>
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
            <div key={service.id} className="service-card bg-white rounded-2xl overflow-hidden shadow-lg" data-testid={`service-card-${service.id}`}>
              <div className="relative h-48 overflow-hidden">
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
                <Link to={`/${service.id}`} className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 underline transition-colors" aria-label={`${t.services.learnMore} ${service.title}`}>
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
            <BikeIcon className="w-6 h-6" />
            {t.pricing.bookNow}
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
                    <div className="px-6 pb-4 text-gray-600" dangerouslySetInnerHTML={{ __html: faq.a }}></div>
                  </div>
                )}
              
            </div>
          ))}
        </div>

        {!showFull && (
          <div className="mt-8 text-center">
            <Link to="/faq" className="text-orange-600 font-semibold hover:text-orange-700 underline inline-flex items-center gap-2">
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
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  return (
    <section className="py-24 bg-white" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          
          
          
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.reviews.title} <span className="text-orange-500">{t.reviews.titleHighlight}</span> {t.reviews.titleEnd}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.reviews.description}</p>
        </div>

        {/* Rating Summary */}
        <div 
          
          
         
          className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 p-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100"
        >
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900">{BUSINESS_INFO.rating}</div>
            <div className="flex justify-center mt-2">{renderStars(Math.round(BUSINESS_INFO.rating))}</div>
            <div className="text-sm text-gray-500 mt-2">{t.reviews.rating}</div>
          </div>
          <div className="h-20 w-px bg-orange-200 hidden md:block"></div>
          <div className="text-center md:text-left">
            <div className="text-2xl font-semibold text-gray-900">{BUSINESS_INFO.reviewCount}</div>
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
          {t.reviews.reviewsList.map((review, index) => (
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
        <div
         
         
         
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white"
        >
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

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
                <button onClick={() => setSubmitted(false)} className="text-orange-600 font-semibold underline">{t.contact.form.sendAnother}</button>
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
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="h-80 rounded-2xl overflow-hidden shadow-lg" data-testid="contact-map">
              <iframe
                title="Artimon Bike Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2893.5!2d3.5357!3d43.3548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b135a89c9edb3b%3A0x9f8c7b6a5d4e3f2a!2sArtimon%20Bike!5e0!3m2!1sfr!2sfr!4v1706200000000!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPinIcon className="w-6 h-6 text-orange-500" /></div>
                <div>
                  <p className="font-semibold text-gray-900">{t.contact.info.address}</p>
                  <p className="text-gray-600">{BUSINESS_INFO.address}</p>
                  <p className="text-gray-600">{BUSINESS_INFO.city}</p>
                  <a href={BUSINESS_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 text-sm font-medium underline hover:text-orange-700">{t.contact.info.viewOnMaps}</a>
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
                  <a href={BUSINESS_INFO.phoneLink} className="text-orange-600 font-semibold underline hover:text-orange-700">{BUSINESS_INFO.phone}</a>
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
    <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600" data-testid="cta-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.cta.title}</h2>
          <p className="text-white/90 text-lg mb-8">{t.cta.description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={BUSINESS_INFO.lokkiUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-orange-500 font-semibold rounded-xl hover:bg-gray-100 transition-all inline-flex items-center gap-2" data-testid="cta-reservation-btn">
              <BikeIcon className="w-6 h-6" />
              {t.cta.bookOnline}
            </a>
            <a href={BUSINESS_INFO.phoneLink} className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all inline-flex items-center gap-2">
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
const HomePage = () => (
  <>
    <HeroSection />
    <CitiesSection />
    <ServicesSection />
    <PricingSection />
    <ReviewsSection />
    <FAQSection />
    <CTASection />
    <ContactSection />
  </>
);

const LocationPage = () => {
  const { t } = useLanguage();
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
  const { t } = useLanguage();
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
  const { t } = useLanguage();

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
  const { t } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapCenter, setMapCenter] = useState([43.4002, 3.5900]);
  const [mapZoom, setMapZoom] = useState(12);

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

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    if (route.coordinates && route.coordinates.length > 0) {
      const midIndex = Math.floor(route.coordinates.length / 2);
      setMapCenter(route.coordinates[midIndex]);
      setMapZoom(13);
    }
  };

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

      {/* Map Section - Google Maps */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.bikePaths.mapTitle}</h2>
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg" data-testid="bike-paths-map">
            <iframe
              title="Artimon Bike - Point de départ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2893.5!2d3.5357!3d43.3548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b135a89c9edb3b%3A0x9f8c7b6a5d4e3f2a!2sArtimon%20Bike!5e0!3m2!1sfr!2sfr!4v1706200000000!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          {/* Route Quick Links */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <button
              onClick={() => setSelectedRoute(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedRoute 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
              }`}
            >
              {t.bikePaths.allRoutes || 'Tous les parcours'}
            </button>
            {t.bikePaths.routes.map((route) => (
              <button
                key={route.id}
                onClick={() => handleRouteClick(route)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedRoute?.id === route.id 
                    ? 'text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                }`}
                style={selectedRoute?.id === route.id ? { backgroundColor: route.color } : {}}
                data-testid={`route-btn-${route.id}`}
              >
                {route.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Routes List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {t.bikePaths.routes.map((route, index) => (
              <div 
                key={route.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 transition-all ${
                  selectedRoute?.id === route.id ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{ borderLeftColor: route.color, ringColor: selectedRoute?.id === route.id ? route.color : 'transparent' }}
                data-testid={`route-card-${route.id}`}
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: route.color }}
                        >
                          {index + 1}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{route.name}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{route.description}</p>
                      
                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📏</span>
                          <div>
                            <div className="text-sm text-gray-500">{t.bikePaths.distance}</div>
                            <div className="font-semibold text-gray-900">{route.distance}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⏱️</span>
                          <div>
                            <div className="text-sm text-gray-500">{t.bikePaths.duration}</div>
                            <div className="font-semibold text-gray-900">{route.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⛰️</span>
                          <div>
                            <div className="text-sm text-gray-500">{t.bikePaths.elevation}</div>
                            <div className="font-semibold text-gray-900">{route.elevation}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(route.difficulty)}`}>
                            {getDifficultyLabel(route.difficulty)}
                          </span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <div className="text-sm font-semibold text-gray-700 mb-2">{t.bikePaths.highlights}:</div>
                        <div className="flex flex-wrap gap-2">
                          {route.highlights.map((highlight, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Points d'intérêt détaillés */}
                      {route.pointsOfInterest && route.pointsOfInterest.length > 0 && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                          <div className="text-sm font-semibold text-gray-700 mb-3">{t.bikePaths.pointsOfInterest || 'À découvrir'}:</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {route.pointsOfInterest.map((poi, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <span className="text-lg">{poi.icon}</span>
                                <div>
                                  <div className="font-medium text-gray-900">{poi.name}</div>
                                  <div className="text-xs text-gray-500">{poi.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Start Point & Recommended Bike */}
                      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{t.bikePaths.startPoint}:</span> {route.startPoint}
                        </div>
                        <div>
                          <span className="font-medium">{t.bikePaths.recommendedBike}:</span> {route.recommendedBike}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 md:ml-6">
                      <a
                        href={route.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                        style={{ backgroundColor: route.color }}
                        data-testid={`gps-btn-${route.id}`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {t.bikePaths.openInGoogleMaps}
                      </a>
                    </div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              {t.bikePaths.tips}
            </h2>
            <ul className="space-y-3">
              {t.bikePaths.tipsContent.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

const TarifsPage = () => {
  const { t } = useLanguage();

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
  const { t } = useLanguage();

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
  const { t } = useLanguage();

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
          <p className="text-gray-600 mb-4">Pour exercer vos droits : <Link to="/contact" className="text-orange-600 underline hover:text-orange-700">Contactez-nous</Link></p>
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

// Main App
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
          <GoogleAnalytics />
          <Navigation />
          <main>
            <Routes>
              {/* Main Pages */}
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
              
              {/* Legacy URL Redirects (301) */}
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
              
              {/* 404 Page */}
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