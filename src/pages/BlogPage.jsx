import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { API_URL, FALLBACK_BLOG_ARTICLES } from "../constants";
import { CTASection } from "../components/sections";

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
    const filterByLanguage = (data) => {
      return data.filter((article) => {
        const hasEnglishTag = article.tags && article.tags.includes('english');
        return language === 'en' ? hasEnglishTag : !hasEnglishTag;
      });
    };

    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);
        if (response.ok) {
          const data = await response.json();
          const filteredArticles = filterByLanguage(data);
          setArticles(filteredArticles.length ? filteredArticles : filterByLanguage(FALLBACK_BLOG_ARTICLES));
        } else {
          setArticles(filterByLanguage(FALLBACK_BLOG_ARTICLES));
        }
      } catch (error) {
        setArticles(filterByLanguage(FALLBACK_BLOG_ARTICLES));
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

export default BlogPage;
