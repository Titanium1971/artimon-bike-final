#!/usr/bin/env node
// Prerender SEO — injecte canonical / title / description / OG par route dans build/
// Résout le problème SPA : les crawlers non-JS voient des canonicals corrects.
// Vercel sert le fichier statique si présent (build/location/index.html), sinon rewrite vers /index.html.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BUILD_DIR = resolve(ROOT, "build");
const ORIGIN = "https://www.artimonbike.com";

const INDEX_HTML = resolve(BUILD_DIR, "index.html");
if (!existsSync(INDEX_HTML)) {
  console.error(`❌ ${INDEX_HTML} introuvable. Lance 'npm run build' d'abord.`);
  process.exit(1);
}

// Import SEO_DATA depuis les sources (ESM)
const { SEO_DATA } = await import(resolve(ROOT, "src/constants/index.js"));

// Mapping route → clé SEO_DATA (+ variante EN)
const ROUTES = [
  { path: "/",                          key: "home",      lang: "fr" },
  { path: "/location",                  key: "location",  lang: "fr" },
  { path: "/reparation",                key: "reparation", lang: "fr" },
  { path: "/vente",                     key: "vente",     lang: "fr" },
  { path: "/tarifs",                    key: "tarifs",    lang: "fr" },
  { path: "/contact",                   key: "contact",   lang: "fr" },
  { path: "/parcours",                  key: "parcours",  lang: "fr" },
  { path: "/faq",                       key: "faq",       lang: "fr" },
  { path: "/blog",                      key: null,        lang: "fr",
    title: "Blog Artimon Bike | Conseils & Parcours Vélo à Marseillan",
    description: "Conseils d'experts, nouveaux parcours vélo autour de l'Étang de Thau, actualités location et réparation vélo à Marseillan.",
    keywords: "blog vélo Marseillan, conseils location VTT, parcours Étang de Thau, actualité vélo Hérault" },
  { path: "/mentions-legales",          key: null,        lang: "fr",
    title: "Mentions Légales | Artimon Bike Nautique",
    description: "Mentions légales du site Artimon Bike Nautique — Location, vente et réparation de vélos à Marseillan (Hérault).",
    keywords: "mentions légales Artimon Bike" },
  { path: "/politique-confidentialite", key: null,        lang: "fr",
    title: "Politique de Confidentialité | Artimon Bike Nautique",
    description: "Politique de confidentialité et gestion des données personnelles du site Artimon Bike Nautique (Marseillan).",
    keywords: "politique confidentialité Artimon Bike, RGPD" },

  // EN routes
  { path: "/en",              key: "home",      lang: "en" },
  { path: "/en/location",     key: "location",  lang: "en" },
  { path: "/en/reparation",   key: "reparation", lang: "en" },
  { path: "/en/vente",        key: "vente",     lang: "en" },
  { path: "/en/tarifs",       key: "tarifs",    lang: "en" },
  { path: "/en/contact",      key: "contact",   lang: "en" },
  { path: "/en/parcours",     key: "parcours",  lang: "en" },
  { path: "/en/faq",          key: "faq",       lang: "en" },
];

function seoFor(route) {
  const data = route.key && SEO_DATA[route.key]?.[route.lang];
  return {
    title: route.title || data?.title || "Artimon Bike",
    description: route.description || data?.description || "",
    keywords: route.keywords || data?.keywords || "",
  };
}

function alternatesFor(route) {
  const frToEn = {
    "/": "/en/",
    "/location": "/en/location",
    "/reparation": "/en/reparation",
    "/vente": "/en/vente",
    "/tarifs": "/en/tarifs",
    "/contact": "/en/contact",
    "/parcours": "/en/parcours",
    "/faq": "/en/faq",
  };
  const enToFr = Object.fromEntries(Object.entries(frToEn).map(([k, v]) => [v, k]));
  let fr = route.path, en = route.path;
  if (route.path in frToEn) en = frToEn[route.path];
  else if (route.path in enToFr) fr = enToFr[route.path];
  return [
    { hreflang: "fr", href: `${ORIGIN}${fr}` },
    { hreflang: "en", href: `${ORIGIN}${en}` },
    { hreflang: "x-default", href: `${ORIGIN}${fr}` },
  ];
}

function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }

function injectSeo(html, route) {
  const seo = seoFor(route);
  const canonical = `${ORIGIN}${route.path}`;
  const alternates = alternatesFor(route);

  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${seo.title}</title>`);

  // meta description
  if (/<meta\s+name=["']description["'][^>]*>/i.test(out)) {
    out = out.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeAttr(seo.description)}" />`);
  }
  // meta keywords
  if (/<meta\s+name=["']keywords["'][^>]*>/i.test(out)) {
    out = out.replace(/<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${escapeAttr(seo.keywords)}" />`);
  }

  // OG url + title + description
  out = out.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${escapeAttr(canonical)}" />`);
  out = out.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeAttr(seo.title)}" />`);
  out = out.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeAttr(seo.description)}" />`);
  out = out.replace(/<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${escapeAttr(canonical)}" />`);
  out = out.replace(/<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${escapeAttr(seo.title)}" />`);
  out = out.replace(/<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${escapeAttr(seo.description)}" />`);

  // <html lang="...">
  out = out.replace(/<html\s+lang=["'][^"']*["']/i, `<html lang="${route.lang}"`);

  // canonical + alternates — injectés avant </head>
  const linkBlock = [
    `<link rel="canonical" href="${canonical}" />`,
    ...alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${escapeAttr(a.href)}" />`),
  ].join("\n        ");

  // Retire canonical existant si déjà présent puis injecte
  out = out.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
  out = out.replace(/<link\s+rel=["']alternate["'][^>]*hreflang=[^>]*>\s*/gi, "");
  out = out.replace(/<\/head>/i, `    ${linkBlock}\n    </head>`);

  return out;
}

function writeRoute(route, html) {
  // Stratégie Vercel cleanUrls:true → écrire build/<route>.html (pas de dossier)
  // Vercel servira /<route> depuis <route>.html sans redirect.
  // Exception: /en/ (base EN) doit rester en dossier.
  const clean = route.path.replace(/^\//, "").replace(/\/$/, "");
  const target = clean === "en" || clean === ""
    ? join(BUILD_DIR, clean, "index.html")
    : join(BUILD_DIR, `${clean}.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  return target;
}

async function main() {
  const baseHtml = readFileSync(INDEX_HTML, "utf8");
  let created = 0;
  for (const route of ROUTES) {
    const html = injectSeo(baseHtml, route);
    const target = writeRoute(route, html);
    console.log(`✅ ${route.path.padEnd(35)} → ${target.replace(ROOT + "/", "")}`);
    created++;
  }
  console.log(`\n${created} pages prérendues avec SEO statique.`);
}

main().catch((e) => { console.error("💥", e); process.exit(2); });
