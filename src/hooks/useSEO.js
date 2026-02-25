import { useEffect } from 'react';

/**
 * SEO helper for SPA pages.
 *
 * Important for multilingual routing:
 * - If the current URL starts with /en, we want the canonical to be the /en URL,
 *   otherwise Google will treat the EN page as a duplicate of the FR page.
 *
 * Strategy:
 * - Default canonical = current origin + pathname (no query/hash).
 * - If a canonical is provided:
 *    - use it for normal routes
 *    - but if we're on an /en route, force canonical to current URL.
 */
export const useSEO = ({ title, description, canonical, keywords }) => {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) metaDesc.setAttribute('content', description);

    // Keywords meta tag (optional)
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) metaKeywords.setAttribute('content', keywords);

    const origin = window.location.origin;
    const pathname = window.location.pathname; // already excludes query/hash
    const currentCanonical = `${origin}${pathname}`;

    // If we are on an EN route, force canonical to the EN URL.
    const resolvedCanonical =
      pathname.startsWith('/en') ? currentCanonical : (canonical || currentCanonical);

    // OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    let ogDesc = document.querySelector('meta[property="og:description"]');
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogTitle && title) ogTitle.setAttribute('content', title);
    if (ogDesc && description) ogDesc.setAttribute('content', description);
    if (ogUrl) ogUrl.setAttribute('content', resolvedCanonical);

    // Twitter
    let twTitle = document.querySelector('meta[property="twitter:title"]');
    let twDesc = document.querySelector('meta[property="twitter:description"]');
    let twUrl = document.querySelector('meta[property="twitter:url"]');
    if (twTitle && title) twTitle.setAttribute('content', title);
    if (twDesc && description) twDesc.setAttribute('content', description);
    if (twUrl) twUrl.setAttribute('content', resolvedCanonical);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', resolvedCanonical);
  }, [title, description, canonical, keywords]);
};
