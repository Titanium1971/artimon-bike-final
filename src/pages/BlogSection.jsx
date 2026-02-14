import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { API_URL } from "../constants";

const BlogSection = () => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);
        if (response.ok) {
          const data = await response.json();
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

export default BlogSection;
