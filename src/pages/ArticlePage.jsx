import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { API_URL, FALLBACK_BLOG_ARTICLES } from "../constants";
import { CTASection } from "../components/sections";

const ENGLISH_TAG = "english";

const normalizeTags = (tags) => (Array.isArray(tags) ? tags : []);

const isEnglishArticle = (article) =>
  normalizeTags(article?.tags).some((tag) => String(tag).toLowerCase() === ENGLISH_TAG);

const slugBase = (slug = "") =>
  slug
    .toLowerCase()
    .replace(/-(en|english|anglais)$/i, "")
    .trim();

const tagTranslationKey = (article) => {
  const tags = normalizeTags(article?.tags).map((tag) => String(tag));
  const keyTag = tags.find((tag) => /^(translation|pair|i18n|lang):/i.test(tag));
  return keyTag ? keyTag.split(":").slice(1).join(":").trim().toLowerCase() : "";
};

const sameCalendarDay = (left, right) => {
  if (!left || !right) return false;
  try {
    const leftDate = new Date(left).toISOString().slice(0, 10);
    const rightDate = new Date(right).toISOString().slice(0, 10);
    return leftDate === rightDate;
  } catch {
    return false;
  }
};

const findTranslatedArticle = (currentArticle, allArticles, targetLanguage) => {
  const targetIsEnglish = targetLanguage === "en";
  const targetArticles = allArticles.filter((candidate) => isEnglishArticle(candidate) === targetIsEnglish);

  if (!targetArticles.length) return null;

  const currentKey = tagTranslationKey(currentArticle);
  if (currentKey) {
    const byTag = targetArticles.find((candidate) => tagTranslationKey(candidate) === currentKey);
    if (byTag) return byTag;
  }

  const currentBaseSlug = slugBase(currentArticle.slug);
  const bySlugBase = targetArticles.find((candidate) => slugBase(candidate.slug) === currentBaseSlug);
  if (bySlugBase) return bySlugBase;

  const byImageAndDate = targetArticles.find(
    (candidate) =>
      candidate.image_url &&
      currentArticle.image_url &&
      candidate.image_url === currentArticle.image_url &&
      sameCalendarDay(candidate.created_at, currentArticle.created_at)
  );
  if (byImageAndDate) return byImageAndDate;

  return null;
};

const getFallbackArticle = (currentSlug, currentLanguage) => {
  const preferredIsEnglish = currentLanguage === "en";
  return (
    FALLBACK_BLOG_ARTICLES.find((article) => article.slug === currentSlug) ||
    FALLBACK_BLOG_ARTICLES.find((article) => isEnglishArticle(article) === preferredIsEnglish) ||
    null
  );
};

const ArticlePage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        // Prefer language-aware API if supported, fallback to legacy endpoint.
        const languageAwareUrl = `${API_URL}/api/blog/${slug}?lang=${language}`;
        let response = await fetch(languageAwareUrl);

        if (!response.ok && response.status >= 400) {
          response = await fetch(`${API_URL}/api/blog/${slug}`);
        }

        if (response.ok) {
          const data = await response.json();
          setArticle(data);
          setError(null);
        } else {
          const fallbackArticle = getFallbackArticle(slug, language);
          if (fallbackArticle) {
            setArticle(fallbackArticle);
            setError(null);
          } else {
            setError(language === "fr" ? "Article non trouvé" : "Article not found");
          }
        }
      } catch (error) {
        const fallbackArticle = getFallbackArticle(slug, language);
        if (fallbackArticle) {
          setArticle(fallbackArticle);
          setError(null);
        } else {
          setError(language === "fr" ? "Erreur de chargement" : "Loading error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, language]);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);
        if (!response.ok) {
          setAllArticles(FALLBACK_BLOG_ARTICLES);
          return;
        }
        const data = await response.json();
        const normalized = Array.isArray(data) ? data : [];
        setAllArticles(normalized.length ? normalized : FALLBACK_BLOG_ARTICLES);
      } catch (error) {
        setAllArticles(FALLBACK_BLOG_ARTICLES);
      }
    };

    fetchAllArticles();
  }, []);

  useEffect(() => {
    if (!article || !allArticles.length) return;
    const articleMatchesLanguage = isEnglishArticle(article) === (language === "en");
    if (articleMatchesLanguage) return;

    const translatedArticle = findTranslatedArticle(article, allArticles, language);
    if (translatedArticle?.slug && translatedArticle.slug !== slug) {
      navigate(`/blog/${translatedArticle.slug}`, { replace: true });
    }
  }, [article, allArticles, language, navigate, slug]);

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
          <p className="mt-4 text-gray-600">
            {language === "fr" ? "Chargement de l'article..." : "Loading article..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "fr" ? "Article non trouvé" : "Article not found"}
          </h1>
          <Link to="/blog" className="text-orange-500 hover:underline">
            {language === "fr" ? "Retour au blog" : "Back to blog"}
          </Link>
        </div>
      </div>
    );
  }

  // Simple markdown to HTML converter
  const renderContent = (content) => {
    return content
      .split('\n\n')
      .map((paragraph, i) => {
        const trimmed = paragraph.trim();

        // Hide raw markdown image/link separators that look unprofessional in article body.
        if (/^!\[.*\]\(.*\)$/.test(trimmed) || trimmed === '---') {
          return null;
        }

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
          decoding="async"
          fetchPriority="high"
          width="1200"
          height="675"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-white/80 mb-4">
              <span className="px-3 py-1 bg-orange-500 rounded-full text-sm font-medium text-white">{article.category}</span>
              <span>
                {new Date(article.created_at).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
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

export default ArticlePage;
