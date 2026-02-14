import { useEffect } from 'react';

export const useSEO = ({ title, description, canonical, keywords }) => {
  useEffect(() => {
    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    
    // Keywords meta tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) metaKeywords.setAttribute('content', keywords);
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    let ogDesc = document.querySelector('meta[property="og:description"]');
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDesc) ogDesc.setAttribute('content', description);
    if (ogUrl && canonical) ogUrl.setAttribute('content', canonical);
    
    let twTitle = document.querySelector('meta[property="twitter:title"]');
    let twDesc = document.querySelector('meta[property="twitter:description"]');
    let twUrl = document.querySelector('meta[property="twitter:url"]');
    if (twTitle) twTitle.setAttribute('content', title);
    if (twDesc) twDesc.setAttribute('content', description);
    if (twUrl && canonical) twUrl.setAttribute('content', canonical);
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink && canonical) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (canonicalLink && canonical) canonicalLink.setAttribute('href', canonical);
  }, [title, description, canonical, keywords]);
};
