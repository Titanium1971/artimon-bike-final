# Sécurité — Artimon Bike

> Dernière mise à jour : **2026-05-03**

## TL;DR

- ✅ **0 vulnérabilité runtime** (`npm audit --omit=dev`)
- ⚠️ **2 vulnérabilités dev-only restantes** (webpack-dev-server, react-scripts) — moderate, sans impact production
- 📉 **Réduction : 28 → 2 vulns** (-93%) sur la session 2026-05-03
- 🚪 Solution long terme = migration Next.js (cf. `MIGRATION-NEXTJS.md`)

---

## Snapshot npm audit

| Date | Total | High | Moderate | Low | Runtime |
|---|---|---|---|---|---|
| Avant interventions | 31 | ? | ? | ? | ? |
| Après `npm audit fix` (commit `1d9cb56`) | 28 | 14 | 5 | 9 | 0 |
| **Après overrides (2026-05-03)** | **2** | **0** | **2** | **0** | **0** |

---

## Stratégie appliquée

### 1. Reclassement `react-scripts` en `devDependencies`

CRA met `react-scripts` dans `dependencies` par héritage historique, mais c'est un **outil de build** (jamais shippé au client).
Déplacement vers `devDependencies` → `npm audit --omit=dev` reflète enfin la réalité prod.

### 2. Overrides npm sur les sous-deps vulnérables

Dans `package.json` :

```json
"overrides": {
  "nth-check": "^2.1.1",
  "postcss": "^8.4.49",
  "serialize-javascript": "^7.0.5",
  "underscore": "^1.13.7",
  "svgo": "^3.3.2",
  "uuid": "^14.0.0",
  "@tootallnate/once": "^3.0.1",
  "http-proxy-agent": "^7.0.0"
}
```

Force des versions patchées dans la chaîne de dépendances de `react-scripts`, sans toucher à CRA lui-même.

**Build vérifié** : `npm run build` compile (warnings pré-existants sur dompurify source maps, non liés à la sécurité).

---

## Vulnérabilités résiduelles (acceptées)

### `webpack-dev-server <=5.2.0` (moderate)
- **Advisories** :
  - GHSA-9jgg-88mc-972h (vol code source via site malveillant, non-Chromium)
  - GHSA-4v9v-hfq4-rm2v (vol code source via site malveillant)
- **Pourquoi acceptée** : Affecte UNIQUEMENT le dev server local (`npm start`). N'est jamais déployé en production.
- **Vecteur d'attaque** : Un dev qui visite un site malveillant pendant que `webpack-dev-server` tourne sur localhost. Risque ciblé sur poste développeur, pas sur les visiteurs du site.
- **Mitigation** : Ne pas utiliser de navigateur non-Chromium (Firefox/Safari) avec le dev server actif sur des sites suspects.

### `react-scripts >=0.1.0` (moderate)
- Hérité de la dépendance `webpack-dev-server` ci-dessus.
- Le seul fix proposé par npm (`react-scripts@0.0.0`) est un placeholder qui casse tout. Inutilisable.
- Sera éliminé par la migration Next.js (cf. `MIGRATION-NEXTJS.md`).

---

## Headers de sécurité (HTTP)

Configurés dans `vercel.json` (commit `3019de8`) :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

Visibles sur tous les chemins de `https://www.artimonbike.com`.

---

## Procédure de mise à jour

### Audit régulier (recommandé : mensuel)

```bash
npm audit
npm audit --omit=dev   # confirmer 0 vuln runtime
```

### Si une nouvelle vuln apparaît

1. Identifier si elle touche le runtime (`--omit=dev`) ou seulement le build.
2. **Runtime** → fix immédiat (override version patchée + commit).
3. **Build only** → évaluer la criticité, ajouter override si possible, sinon documenter ici en "vulnérabilité résiduelle acceptée".
4. Tester `npm run build` après chaque override.

### Mise à jour des overrides

Vérifier les versions disponibles :
```bash
npm view <package> version
npm view <package> versions --json | tail -20
```

---

## Solution définitive

La migration Next.js documentée dans **`docs/MIGRATION-NEXTJS.md`** éliminera l'intégralité de ces vulns en remplaçant le stack CRA (déprécié) par Next.js (maintenu activement).

Déclencheur : prochaine grosse évolution fonctionnelle du site.
