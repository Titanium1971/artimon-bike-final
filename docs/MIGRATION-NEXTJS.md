# Migration CRA → Next.js — Plan d'attaque

> **Statut : NON DÉCLENCHÉE.** Document de préparation, à activer le jour où une grosse évolution justifie la refonte.
> **Snapshot pris le : 2026-05-03**
> **Branche source : `main`**

---

## 1. Quand déclencher cette migration

Migrer **uniquement** si l'un de ces déclencheurs survient :

- [ ] Le client demande une nouvelle section/feature majeure (le travail de migration s'amortit dans la feature)
- [ ] Refonte design complète demandée
- [ ] CRA casse à cause d'une dépendance React 20 / Node 24
- [ ] Faille de sécurité non patchable dans `react-scripts`
- [ ] Tu décides d'aligner la stack et tu acceptes 4-6 jours non facturés

**NE PAS migrer** parce que "c'est mieux". Le site fonctionne, est en prod, SEO patché.

---

## 2. État actuel (à conserver, à porter ou à jeter)

### Stack frontend
- **React 19** + `react-scripts 5.0.1` + `@craco/craco 7.1.0`
- **Tailwind 3** + `tailwindcss-animate` + `tailwind-merge`
- **shadcn/ui** complet via `@radix-ui/*` (~30 packages)
- **react-router-dom 7** (BrowserRouter, 22+ routes FR + variantes EN)
- **framer-motion 12**, **recharts 3**, **embla-carousel**, **sonner**, **vaul**, **cmdk**
- **react-hook-form** + `zod` + `@hookform/resolvers`
- **dompurify**, **axios**, **date-fns 4**, **lucide-react**
- `next-themes` (déjà compatible Next ✓)

### Structure
- `src/pages/` — 22 pages `.jsx` (4514 lignes)
- `src/components/` — bikes, layout, sections, ui (shadcn), GoogleAnalytics
- `src/contexts/` + `src/i18n/` — LanguageContext (FR/EN) + translations
- `src/services/googlePlacesService.js`
- `src/constants/index.js` — contient `SEO_DATA` (utilisé par prerender)
- `src/data/`, `src/hooks/`, `src/lib/`, `src/icons/`

### Routes (à porter dans `app/`)
**FR :**
`/`, `/location`, `/reparation`, `/vente`, `/vente/pneus`, `/vente/pneus/:slug`, `/vente/chambres-a-air`, `/vente/chambres-a-air/:slug`, `/vente/occasion/:id`, `/vente/:slug`, `/parcours`, `/tarifs`, `/contact`, `/faq`, `/blog`, `/blog/:slug`, `/location-velo-marseillan`, `/location-velo-agde`, `/location-velo-sete`, `/location-velo-meze`, `/mentions-legales`, `/politique-confidentialite`

**EN (mêmes routes préfixées `/en/`)** — équivalent en Next : segment dynamique `[lang]` ou route group `(en)`.

### Backend
- **Reste inchangé.** FastAPI + MongoDB déployé Render/Railway.
- URL : `REACT_APP_BACKEND_URL` → renommer en `NEXT_PUBLIC_BACKEND_URL` ou `BACKEND_URL` (server-side).

### Variables d'environnement à porter
| Actuelle (CRA) | Cible (Next.js) | Notes |
|---|---|---|
| `REACT_APP_BACKEND_URL` | `NEXT_PUBLIC_BACKEND_URL` | exposé client (axios) |
| `REACT_APP_GA_MEASUREMENT_ID` | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 |

### Config Vercel actuelle (`vercel.json`)
- `cleanUrls: true` + `trailingSlash: false` → équivalent par défaut Next.js ✓
- **Rewrite SPA** `/((?!api/.*).*) → /index.html` → **À SUPPRIMER** (Next gère le routing nativement)
- **Redirects 301** (14 entrées) → porter dans `next.config.ts` → `redirects()`
- **Headers sécurité** (X-Frame-Options DENY, nosniff, XSS-Protection) → porter dans `next.config.ts` → `headers()`

### Scripts custom à éliminer
- `scripts/prerender-seo.mjs` — **DEVIENT INUTILE**, remplacé par `generateMetadata()` Next.js
- `scripts/precompress.js` — Next gère brotli/gzip automatiquement sur Vercel
- `npm run minify:js` (terser) — Turbopack/SWC le fait

---

## 3. Plan en 6 phases (4-6 jours réalistes)

### Phase 1 — Bootstrap (0.5j)
- [ ] `npx create-next-app@latest artimon-bike-next --typescript --tailwind --app --turbopack`
- [ ] Init shadcn : `npx shadcn@latest init`
- [ ] Copier `tailwind.config.js` (custom theme/colors)
- [ ] Installer toutes les deps Radix/framer/recharts/etc. (cf. `package.json` actuel)
- [ ] Setup `next.config.ts` (redirects + headers depuis `vercel.json`)

### Phase 2 — Layout & i18n (0.5j)
- [ ] `app/layout.tsx` racine + `app/[lang]/layout.tsx` (FR/EN)
- [ ] Migrer `LanguageContext` → server component avec param `lang` OU garder client context
- [ ] GoogleAnalytics → `@next/third-parties/google`
- [ ] Header/Footer/Nav (depuis `src/components/layout/`)
- [ ] Provider sonner / next-themes / tooltip

### Phase 3 — Pages statiques (1.5j)
Ordre conseillé (du plus simple au plus complexe) :
- [ ] `app/contact/page.tsx`
- [ ] `app/mentions-legales/page.tsx`
- [ ] `app/politique-confidentialite/page.tsx`
- [ ] `app/tarifs/page.tsx`
- [ ] `app/faq/page.tsx`
- [ ] `app/reparation/page.tsx`
- [ ] `app/parcours/page.tsx` (BikePathsPage 380 lignes)
- [ ] `app/page.tsx` (HomePage)
- [ ] `app/location/page.tsx`
- [ ] `app/vente/page.tsx`

Pour chaque page : `generateMetadata()` qui consomme `SEO_DATA[key]` (canonical, title, description, OG).

### Phase 4 — Pages dynamiques (1j)
- [ ] `app/vente/[slug]/page.tsx` → BikeDetailPage
- [ ] `app/vente/occasion/[id]/page.tsx` → UsedBikeDetailPage
- [ ] `app/vente/pneus/[slug]/page.tsx`, `app/vente/chambres-a-air/[slug]/page.tsx` → AccessoryDetailPage
- [ ] `app/blog/[slug]/page.tsx` → ArticlePage
- [ ] `app/location-velo-[area]/page.tsx` → LocationAreaPage (params : marseillan/agde/sete/meze)
- [ ] `generateStaticParams()` pour pré-générer les slugs depuis l'API backend

### Phase 5 — SEO & assets (1j)
- [ ] Remplacer `<img>` WebP manuels → `next/image` (gain Lighthouse)
- [ ] Sitemap : `app/sitemap.ts` (générer depuis routes + slugs API)
- [ ] Robots : `app/robots.ts`
- [ ] OG images dynamiques : `app/[...]/opengraph-image.tsx` si besoin
- [ ] Vérifier toutes les balises canonical (FR + `<link rel="alternate" hreflang="en">`)
- [ ] Re-tester avec Screaming Frog (cf. stack Cyril)

### Phase 6 — Validation & cutover (0.5-1j)
- [ ] `npm run build` propre (zero warning)
- [ ] Audit Lighthouse mobile + desktop (cible : >90 partout)
- [ ] Tester les 14 redirects 301 (curl chaque URL)
- [ ] Tester switcher FR↔EN sur les 22 pages
- [ ] Tester formulaire contact (POST vers backend FastAPI)
- [ ] Tester admin (`/admin`) si applicable
- [ ] Vérifier GA4 fire (RealTime view)
- [ ] Vercel preview deploy → smoke test
- [ ] **Bascule prod** : merger sur `main`, surveiller Search Console J+1, J+7, J+30

---

## 4. Pièges connus / decisions à prendre

| Sujet | Décision le jour J |
|---|---|
| **App Router vs Pages Router** | App Router (stack standard Cyril) |
| **TypeScript ou JS ?** | **TypeScript** (Le Divino, MeetVera, Velvet sont en TS) |
| **i18n** | next-intl OU custom param `[lang]` (plus simple, suffit pour 2 langues) |
| **Routing `/en/*`** | Soit `app/[lang]/...` soit route group `app/(fr)/` + `app/(en)/` |
| **Backend proxy** | Garder appel direct vers `BACKEND_URL` (FastAPI Render). Pas besoin de `next.config rewrites` |
| **Repo** | Nouveau repo `artimon-bike-next` puis bascule, OU branche `next-migration` puis remplacement de `src/` |
| **Données blog/vélos** | Restent en MongoDB côté FastAPI. SSR via `fetch()` server-side dans les page components |

---

## 5. Risques SEO (le plus critique)

- [ ] **Toutes les URLs FR existantes doivent rester identiques** (zéro 404)
- [ ] Tous les redirects 301 du `vercel.json` doivent migrer dans `next.config.ts`
- [ ] Canonicals identiques à l'actuel (cf. `prerender-seo.mjs` ligne par ligne)
- [ ] Sitemap soumis à Search Console après deploy
- [ ] Surveiller Search Console les 30 jours suivants (perte impressions = problème)

---

## 6. Commande de lancement (le jour J)

À copier-coller à Claude Code le jour où tu décides de migrer :

```
Lance la migration Next.js d'Artimon Bike documentée dans docs/MIGRATION-NEXTJS.md.
Travaille sur une branche `migration-nextjs`. Suis les 6 phases dans l'ordre.
Commit obligatoire à chaque fin de phase (convention `phase X: <résumé>`).
Stack cible : Next.js 16 App Router + Turbopack + TypeScript + Tailwind 3 + shadcn.
Backend FastAPI inchangé. Garder toutes les routes/redirects/canonicals.
Pose-moi les questions de la section "Pièges connus" avant de bootstrap.
```

---

## 7. Check post-migration (à conserver dans `docs/`)

Une fois migré, supprimer ce fichier OU le renommer `MIGRATION-NEXTJS-DONE.md` avec date.
Mettre à jour le `CLAUDE.md` global de Cyril pour refléter `Next.js` au lieu de `React (CRA)` pour artimon-bike.
