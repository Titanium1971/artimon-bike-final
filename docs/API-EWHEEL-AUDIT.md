# Audit API eWheel — Artimon Bike

**Date :** 1er avril 2026  
**Base URL :** `https://api.ewheel.es`  
**Auth :** Header `X-API-KEY`  
**Documentation :** `https://api.ewheel.es/swagger/index.html`

---

## 1. Vue d'ensemble — 5 APIs disponibles

| API | Endpoints | Description |
|-----|-----------|-------------|
| **Authentication** | 11 | Gestion utilisateurs, clés API, login/register |
| **Catalog** | 6 | Produits, catégories, stock, pays |
| **Customers** | 1 | Clients B2B |
| **Sales** | 7 | Commandes B2B, B2C (dropshipping), suivi |
| **Bulk** | 0 | Import massif (pas encore d'endpoint) |

---

## 2. API Catalog — Ce qu'on utilise déjà

### Endpoints

| Endpoint | Méthode | Description | Status Artimon |
|----------|---------|-------------|----------------|
| `/api/v1/catalog/Products/filter` | POST | Liste des produits avec filtres (catégorie, ref, images) | **Utilisé** — vélos + accessoires |
| `/api/v1/catalog/stock/filter` | POST | Stock temps réel par variante | **Utilisé** — backend Render |
| `/api/v1/catalog/Categories` | GET | Liste des catégories avec pagination | **Non utilisé** — utile pour découvrir de nouvelles catégories |
| `/api/v1/catalog/Countries` | GET | Pays valides (pour adresses de livraison) | **Non utilisé** — nécessaire pour les commandes |
| `/api/v1/catalog/Agents/filter` | POST | Liste des agents/revendeurs | **Non utilisé** |
| `/api/v1/catalog/Products/Bulk` | POST | Import/édition de produits en masse | **Non utilisé** — pas pertinent pour Artimon |

### Avantages & Inconvénients — Catalog

| | Avantages | Inconvénients |
|---|-----------|---------------|
| **Produits** | Filtrage par catégorie, ref, images, actif | PageSize max 50 — nécessite pagination |
| | Multi-images par produit | Sans pagination → max 10 résultats (bug/limitation) |
| | Descriptions multilingues (FR, EN, ES, IT, PL) | Certains produits sans nom FR (retournent "?") |
| | Attributs techniques (gel, type, taille) | Structure attributs complexe et hétérogène |
| | Prix HT revendeur inclus | Pas de prix public recommandé fiable (RRP souvent à 0) |
| **Stock** | Temps réel, paginé | Les **vélos ne sont pas dans l'endpoint stock** |
| | Identifié par variantReference + productReference | PageSize max 50 |
| | 1450+ entrées (pièces détachées) | Pas de webhook pour les changements de stock |
| **Catégories** | 84 catégories identifiées (111-224) | Pas de nom de catégorie dans l'API (juste des IDs numériques) |

---

## 3. API Sales — Commandes & Dropshipping

### Endpoints

| Endpoint | Méthode | Description | Pertinence Artimon |
|----------|---------|-------------|-------------------|
| `POST /api/v1/sales/orders/b2c` | POST | **Créer une commande B2C (dropshipping)** | **ESSENTIEL** — commande envoyée directement au client final |
| `POST /api/v1/sales/orders/b2b` | POST | Créer une commande B2B (livraison à Artimon) | Utile pour réappro stock propre |
| `POST /api/v1/sales/orders` | POST | Lister les commandes (avec filtres) | Utile pour suivi et dashboard admin |
| `PUT .../status/cancel` | PUT | Annuler une commande | Nécessaire pour les annulations |
| `PUT .../status/integrate` | PUT | Marquer comme intégrée | Workflow interne |
| `PUT .../status/ship` | PUT | Marquer comme expédiée + tracking | Reçoit tracking number/link |
| `PUT .../status/return` | PUT | Marquer comme retournée + tracking | Pour les retours/SAV |

### Schéma commande B2C (dropshipping)

```json
{
  "isB2B": false,
  "reference": "ARTIMON-2026-0001",
  "customerReference": "artimon-bike",
  "shippingAddress": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "street": "12 rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "countryCode": "FR",
    "phone": "0612345678"
  },
  "billingAddress": { ... },
  "items": [
    { "reference": "EWF496", "quantity": 2, "price": 4.45 }
  ],
  "paymentMethod": "stripe",
  "currency": "EUR",
  "totalAmount": 8.90,
  "shippingAmount": 0,
  "isTest": true
}
```

### Avantages & Inconvénients — Sales

| | Avantages | Inconvénients |
|---|-----------|---------------|
| **Commandes B2C** | Endpoint dédié dropshipping | Adresses shipping + billing obligatoires (structure à confirmer) |
| | Envoi direct au client final | Pas de documentation sur les frais de port |
| | Référence commande personnalisable | Pas de callback/webhook quand le statut change |
| | Champ `isTest: true` pour tester sans risque | Pas testé en production — à valider avec Fanny |
| | Tracking info disponible (carrier, trackingNumber, trackingLink) | |
| **Suivi commandes** | Filtrage par statut, date, référence | Pas de webhook de notification — il faut poller |
| | Historique de statuts | |
| **Annulation** | Endpoint dédié | Conditions d'annulation inconnues (délai?) |
| **Retours** | Endpoint dédié avec tracking retour | Process retour non documenté côté eWheel |

---

## 4. API Customers — Gestion des clients B2B

| Endpoint | Description | Pertinence |
|----------|-------------|------------|
| `POST /api/v1/customers/B2B/filter` | Liste des clients B2B | Vérifier que le compte Artimon est bien configuré |

Peu utile au quotidien, surtout pour vérifier la config du compte revendeur.

---

## 5. API Authentication — Gestion des accès

| Endpoint | Description | Pertinence |
|----------|-------------|------------|
| `POST /api/v1/auth/login` | Login (retourne JWT) | Pas nécessaire avec API Key |
| `POST /api/v1/auth/register` | Créer un compte | Déjà fait |
| `GET /api/v1/auth/Users/permissions/{id}` | Voir les permissions | Utile pour debug |
| `POST /api/v1/auth/manage/APIKey` | Créer une nouvelle clé | Si besoin d'une clé dédiée prod |
| `PUT /api/v1/auth/manage/APIKey/{id}/revoke` | Révoquer une clé | Sécurité |

---

## 6. Ce qui est possible vs ce qui ne l'est pas

### POSSIBLE (via l'API)

| Fonctionnalité | Endpoint | Complexité | Notes |
|---------------|----------|------------|-------|
| Afficher le catalogue complet | Products/filter | **Fait** | 84 catégories, 1000+ produits |
| Stock temps réel (accessoires) | stock/filter | **Fait** | 1450+ pièces, cache 10 min |
| Commander en dropshipping (B2C) | orders/b2c | Moyenne | À tester avec `isTest: true` |
| Commander pour stock propre (B2B) | orders/b2b | Moyenne | Livraison à Artimon Marseillan |
| Lister/suivre les commandes | orders (filter) | Simple | Par statut, date, référence |
| Annuler une commande | status/cancel | Simple | |
| Obtenir le tracking | status/ship | Simple | carrier + trackingNumber + trackingLink |
| Gérer les retours | status/return | Simple | |
| Lister les catégories | Categories | Simple | Avec pagination |
| Lister les pays de livraison | Countries | Simple | Pour le formulaire checkout |

### PAS POSSIBLE (via l'API)

| Fonctionnalité | Raison | Solution alternative |
|---------------|--------|---------------------|
| Stock des **vélos** en temps réel | Les vélos ne sont pas dans l'endpoint stock | Demander à Fanny un accès spécifique |
| Frais de port automatiques | Pas d'endpoint calcul de frais de port | Demander la grille tarifaire à Fanny |
| Webhooks (stock, commandes) | Pas de système de callback | Polling régulier (cron toutes les X minutes) |
| Factures fournisseur (PDF) | Pas d'endpoint facturation | Factures envoyées par email par eWheel |
| Historique des prix | Pas d'historique | Stocker les prix en base côté Artimon |
| Avis clients / reviews | Pas de système avis | Gérer côté Artimon (Google Reviews) |
| Images haute résolution | Les images viennent du CDN CloudFront eWheel | OK pour l'usage web |
| Nom des catégories | L'API retourne juste des IDs numériques | Mapper manuellement (fait dans bikes.js) |
| Pagination au-delà de 50 | PageSize max 50 | Pagination multiple (on le fait déjà) |

---

## 7. Plan d'implémentation e-commerce

### Phase 1 — Validation (avant tout développement)

- [ ] Tester `POST /api/v1/sales/orders/b2c` avec `isTest: true`
- [ ] Demander à Fanny : frais de port France, délais livraison, branding colis
- [ ] Demander à Fanny : stock vélos, facturation (par commande ou mensuelle)
- [ ] Obtenir la liste des `countryCode` valides via `/api/v1/catalog/Countries`

### Phase 2 — Panier & Checkout

- [ ] Panier React (localStorage) + page panier
- [ ] Checkout Stripe (hosted page ou Elements)
- [ ] Formulaire adresse livraison/facturation
- [ ] Frais de port (à définir avec eWheel)

### Phase 3 — Automatisation commandes

- [ ] Webhook Stripe → backend → `POST orders/b2c`
- [ ] Email confirmation client (Brevo)
- [ ] Dashboard admin suivi commandes (polling `POST orders`)
- [ ] Notification WhatsApp quand commande reçue

### Phase 4 — Suivi & SAV

- [ ] Polling statut commandes (cron toutes les 30 min)
- [ ] Email client quand expédié (avec tracking link)
- [ ] Process retour via `PUT status/return`
- [ ] CGV e-commerce + mentions légales

---

## 8. Questions à poser à Fanny (eWheel)

1. **Frais de port** : quel est le tarif Espagne → France ? Forfait ou au poids ?
2. **Stock vélos** : pourquoi les vélos (cat 184-186) ne sont pas dans `/stock/filter` ?
3. **Branding** : le colis arrive avec le nom Artimon ou eWheel ?
4. **Facturation** : prélèvement par commande ou facture mensuelle ?
5. **Délai livraison** : combien de jours Espagne → France métropolitaine ?
6. **Minimum commande** : y a-t-il un montant minimum pour les commandes B2C ?
7. **Retours** : qui gère les retours ? Le client renvoie en Espagne ?
8. **Test** : peut-on passer une vraie commande test (`isTest: true`) pour valider le flux ?

---

*Document généré le 1er avril 2026 — Artimon Bike / CC Développement*
