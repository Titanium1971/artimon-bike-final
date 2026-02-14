import { useState, useEffect, useMemo } from "react";
import { API_URL } from "../constants";

// Tab icons
const TabIcons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  analytics: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  articles: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  messages: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

// Simple Bar Chart Component
const BarChart = ({ data, title, color = "orange" }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const colors = {
    orange: { bg: "bg-orange-500", light: "bg-orange-100" },
    blue: { bg: "bg-blue-500", light: "bg-blue-100" },
    green: { bg: "bg-green-500", light: "bg-green-100" },
    purple: { bg: "bg-purple-500", light: "bg-purple-100" },
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-600 truncate" title={item.label}>{item.label}</div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors[color].bg} rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-10 text-sm font-bold text-gray-900 text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mini Line Chart Component (CSS only)
const MiniLineChart = ({ data, title, total, trend }) => {
  const maxValue = Math.max(...data, 1);
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (val / maxValue) * 80
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-500">{title}</h3>
          <div className="text-3xl font-bold text-gray-900">{total}</div>
        </div>
        {trend !== undefined && (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${trend >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <svg viewBox="0 0 100 50" className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L 100 50 L 0 50 Z`} fill="url(#lineGradient)" />
        <path d={pathD} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// KPI Dashboard Tab
const DashboardTab = ({ stats, analyticsData }) => {
  if (!stats && !analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const contacts = analyticsData?.contacts || {};
  const articles = analyticsData?.articles || stats || {};

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
          <div className="text-3xl font-bold text-orange-500">{articles.total_articles || articles.total || 0}</div>
          <div className="text-gray-600 text-sm">Articles total</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-500">{articles.published_articles || articles.published || 0}</div>
          <div className="text-gray-600 text-sm">Publiés</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-500">{articles.draft_articles || articles.draft || 0}</div>
          <div className="text-gray-600 text-sm">Brouillons</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-500">{contacts.total || 0}</div>
          <div className="text-gray-600 text-sm">Messages total</div>
        </div>
      </div>

      {/* Contact Stats */}
      {contacts.total > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Messages par période</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Aujourd'hui</span>
                <span className="font-bold text-gray-900 bg-orange-100 px-3 py-1 rounded-full">{contacts.today || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cette semaine</span>
                <span className="font-bold text-gray-900 bg-blue-100 px-3 py-1 rounded-full">{contacts.week || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ce mois</span>
                <span className="font-bold text-gray-900 bg-green-100 px-3 py-1 rounded-full">{contacts.month || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Statut des messages</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">Envoyés</span>
                </span>
                <span className="font-bold text-green-600">{contacts.by_status?.sent || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-600">En attente</span>
                </span>
                <span className="font-bold text-yellow-600">{contacts.by_status?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">Erreurs</span>
                </span>
                <span className="font-bold text-red-600">{contacts.by_status?.error || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages par sujet */}
      {contacts.by_subject?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Messages par sujet</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contacts.by_subject.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                <div className="text-sm text-gray-600 truncate" title={item.subject}>{item.subject}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Dashboard Tab
const AnalyticsTab = ({ analyticsData, messages }) => {
  // Generate mock data for demonstration (replace with real GA data if integrated)
  const last7Days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Calculate messages per day from actual data
  const messagesPerDay = useMemo(() => {
    const dayCount = [0, 0, 0, 0, 0, 0, 0];
    messages.forEach(msg => {
      const date = new Date(msg.created_at);
      const dayOfWeek = date.getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      dayCount[adjustedDay]++;
    });
    return dayCount;
  }, [messages]);

  // Top subjects
  const topSubjects = useMemo(() => {
    const subjects = {};
    messages.forEach(msg => {
      subjects[msg.subject] = (subjects[msg.subject] || 0) + 1;
    });
    return Object.entries(subjects)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [messages]);

  // Top hours
  const messagesByHour = useMemo(() => {
    const hours = { 'Matin (8-12h)': 0, 'Midi (12-14h)': 0, 'Après-midi (14-18h)': 0, 'Soir (18-22h)': 0 };
    messages.forEach(msg => {
      const hour = new Date(msg.created_at).getHours();
      if (hour >= 8 && hour < 12) hours['Matin (8-12h)']++;
      else if (hour >= 12 && hour < 14) hours['Midi (12-14h)']++;
      else if (hour >= 14 && hour < 18) hours['Après-midi (14-18h)']++;
      else if (hour >= 18 && hour < 22) hours['Soir (18-22h)']++;
    });
    return Object.entries(hours).map(([label, value]) => ({ label, value }));
  }, [messages]);

  const contacts = analyticsData?.contacts || {};
  const weekTrend = contacts.week > 0 && contacts.month > 0 
    ? Math.round(((contacts.week / (contacts.month / 4)) - 1) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <MiniLineChart 
          data={messagesPerDay}
          title="Messages cette semaine"
          total={contacts.week || 0}
          trend={weekTrend}
        />
        <MiniLineChart 
          data={[contacts.today || 0, contacts.week || 0, contacts.month || 0].reverse()}
          title="Messages ce mois"
          total={contacts.month || 0}
        />
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Taux de conversion email</h3>
          <div className="text-3xl font-bold text-gray-900">
            {contacts.total > 0 ? Math.round((contacts.by_status?.sent || 0) / contacts.total * 100) : 0}%
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${contacts.total > 0 ? (contacts.by_status?.sent || 0) / contacts.total * 100 : 0}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {contacts.by_status?.sent || 0} envoyés sur {contacts.total || 0}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <BarChart 
          data={topSubjects.length > 0 ? topSubjects : [{ label: 'Aucune donnée', value: 0 }]}
          title="Top sujets de contact"
          color="orange"
        />
        <BarChart 
          data={messagesByHour}
          title="Messages par créneau horaire"
          color="blue"
        />
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activité par jour</h3>
        <div className="flex gap-2">
          {last7Days.map((day, index) => {
            const value = messagesPerDay[index];
            const maxVal = Math.max(...messagesPerDay, 1);
            const intensity = value / maxVal;
            return (
              <div key={day} className="flex-1 text-center">
                <div 
                  className="h-20 rounded-lg mb-2 flex items-center justify-center text-white font-bold transition-all"
                  style={{ 
                    backgroundColor: `rgba(249, 115, 22, ${0.2 + intensity * 0.8})`,
                    color: intensity > 0.5 ? 'white' : '#666'
                  }}
                >
                  {value}
                </div>
                <div className="text-xs text-gray-600">{day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Analytics Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-blue-900">Intégrer Google Analytics</h3>
            <p className="text-blue-700 text-sm mt-1">
              Pour des statistiques de visites plus détaillées (pages vues, sources de trafic, comportement utilisateur), 
              configurez Google Analytics en ajoutant votre ID de mesure (G-XXXXXXXXXX) dans les variables d'environnement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Articles Tab
const ArticlesTab = ({ articles, authHeader, onRefresh }) => {
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", content: "", image_url: "", category: "Actualités", tags: "", published: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const articleData = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(t => t)
    };

    try {
      const url = editingArticle 
        ? `${API_URL}/api/blog/${editingArticle.slug}`
        : `${API_URL}/api/blog`;
      const method = editingArticle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(articleData)
      });

      if (response.ok) {
        setEditingArticle(null);
        setFormData({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "Actualités", tags: "", published: true });
        onRefresh();
      } else {
        const err = await response.json();
        setError(err.detail || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      const response = await fetch(`${API_URL}/api/blog/${slug}`, {
        method: "DELETE",
        headers: { "Authorization": authHeader }
      });
      if (response.ok) onRefresh();
    } catch (err) {
      console.error("Error deleting article");
    }
  };

  const startEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image_url: article.image_url,
      category: article.category,
      tags: article.tags?.join(", ") || "",
      published: article.published
    });
  };

  const cancelEdit = () => {
    setEditingArticle(null);
    setFormData({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "Actualités", tags: "", published: true });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingArticle ? "Modifier l'article" : "Nouvel article"}
        </h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
            <textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (Markdown)</label>
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
            <input type="url" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option>Actualités</option>
                <option>Conseils</option>
                <option>Itinéraires</option>
                <option>Équipement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par ,)</label>
              <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
            <label className="text-sm text-gray-700">Publier immédiatement</label>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
              {loading ? "..." : (editingArticle ? "Mettre à jour" : "Créer l'article")}
            </button>
            {editingArticle && (
              <button type="button" onClick={cancelEdit} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Articles ({articles.length})</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto">
          {articles.map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{article.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.published ? 'Publié' : 'Brouillon'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                    {article.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 ml-4 flex-shrink-0">
                  <button onClick={() => startEdit(article)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(article.slug)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {articles.length === 0 && <div className="text-center py-8 text-gray-500">Aucun article pour le moment</div>}
        </div>
      </div>
    </div>
  );
};

// Messages Tab with read/unread tracking
const MessagesTab = ({ messages, authHeader, onRefresh, readMessages, onMarkAsRead }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredMessages = messages.filter(msg => {
    if (filter === "all") return true;
    if (filter === "unread") return !readMessages.has(getMessageId(msg));
    return msg.status === filter;
  });

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    onMarkAsRead(msg);
  };

  const handleDelete = async (email, createdAt) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      const response = await fetch(
        `${API_URL}/api/analytics/contacts/${encodeURIComponent(email)}/${encodeURIComponent(createdAt)}`,
        { method: "DELETE", headers: { "Authorization": authHeader } }
      );
      if (response.ok) {
        onRefresh();
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message");
    }
  };

  const getStatusBadge = (status) => {
    const styles = { sent: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", error: "bg-red-100 text-red-700" };
    const labels = { sent: "Envoyé", pending: "En attente", error: "Erreur" };
    return <span className={`px-2 py-0.5 text-xs rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>{labels[status] || status}</span>;
  };

  const isUnread = (msg) => !readMessages.has(getMessageId(msg));

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filtrer:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "Tous" },
              { value: "unread", label: "Non lus" },
              { value: "sent", label: "Envoyés" },
              { value: "pending", label: "En attente" },
              { value: "error", label: "Erreurs" }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === item.value ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.label}
                {item.value === "unread" && (
                  <span className="ml-1">({messages.filter(m => !readMessages.has(getMessageId(m))).length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredMessages.map((msg, index) => (
            <div
              key={index}
              onClick={() => handleSelectMessage(msg)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedMessage === msg ? "bg-orange-50 border-l-4 border-orange-500" : ""
              } ${isUnread(msg) ? "bg-blue-50/50" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isUnread(msg) && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    )}
                    <span className={`font-semibold text-gray-900 ${isUnread(msg) ? 'font-bold' : ''}`}>{msg.name}</span>
                    {getStatusBadge(msg.status)}
                  </div>
                  <p className={`text-sm text-gray-600 truncate ${isUnread(msg) ? 'font-medium' : ''}`}>{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {msg.email} • {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun message {filter !== "all" ? `avec le filtre "${filter}"` : ""}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {selectedMessage ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900">{selectedMessage.subject}</h3>
              <button onClick={() => handleDelete(selectedMessage.email, selectedMessage.created_at)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><span className="text-gray-500 w-20">De:</span><span className="font-medium text-gray-900">{selectedMessage.name}</span></div>
              <div className="flex items-center gap-2"><span className="text-gray-500 w-20">Email:</span><a href={`mailto:${selectedMessage.email}`} className="text-orange-500 hover:underline">{selectedMessage.email}</a></div>
              {selectedMessage.phone && (
                <div className="flex items-center gap-2"><span className="text-gray-500 w-20">Téléphone:</span><a href={`tel:${selectedMessage.phone}`} className="text-orange-500 hover:underline">{selectedMessage.phone}</a></div>
              )}
              <div className="flex items-center gap-2"><span className="text-gray-500 w-20">Date:</span><span className="text-gray-700">{new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className="flex items-center gap-2"><span className="text-gray-500 w-20">Statut:</span>{getStatusBadge(selectedMessage.status)}</div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</div>
            </div>

            <div className="pt-4 flex gap-3">
              <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg text-center font-medium hover:bg-orange-600 transition-colors">Répondre par email</a>
              {selectedMessage.phone && (
                <a href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">WhatsApp</a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p>Sélectionnez un message pour voir les détails</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate unique message ID
const getMessageId = (msg) => `${msg.email}_${msg.created_at}`;

// Main Admin Page Component
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState("");
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [readMessages, setReadMessages] = useState(new Set());

  const authHeader = authToken ? `Bearer ${authToken}` : "";
  const messages = analyticsData?.recent_contacts || [];

  // Load read messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('artimon_read_messages');
    if (saved) {
      try {
        setReadMessages(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Error loading read messages');
      }
    }
  }, []);

  // Save read messages to localStorage
  const markAsRead = (msg) => {
    const id = getMessageId(msg);
    if (!readMessages.has(id)) {
      const newSet = new Set(readMessages);
      newSet.add(id);
      setReadMessages(newSet);
      localStorage.setItem('artimon_read_messages', JSON.stringify([...newSet]));
    }
  };

  // Count unread messages
  const unreadCount = useMemo(() => {
    return messages.filter(msg => !readMessages.has(getMessageId(msg))).length;
  }, [messages, readMessages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        fetchAllData(data.token);
      } else {
        setError(data.detail || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (token) => {
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      const [articlesRes, statsRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/api/blog?published_only=false`, { headers }),
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/analytics/stats`, { headers })
      ]);
      if (articlesRes.ok) setArticles(await articlesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (analyticsRes.ok) setAnalyticsData(await analyticsRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleRefresh = () => {
    if (authToken) fetchAllData(authToken);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setAuthToken("");
    setArticles([]);
    setStats(null);
    setAnalyticsData(null);
  };

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.svg" alt="Artimon Bike" className="w-16 h-16 mb-4" data-testid="admin-login-logo" />
            <h1 className="text-2xl font-bold text-gray-900 text-center">Administration</h1>
          </div>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@artimonbike.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required data-testid="admin-email-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required data-testid="admin-password-input" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50" data-testid="admin-login-button">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard with 4 tabs
  const tabs = [
    { id: "dashboard", label: "Tableau de bord", icon: TabIcons.dashboard },
    { id: "analytics", label: "Analytics", icon: TabIcons.analytics },
    { id: "articles", label: "Articles", icon: TabIcons.articles },
    { id: "messages", label: "Messages", icon: TabIcons.messages, badge: unreadCount },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Artimon Bike" className="w-12 h-12" data-testid="admin-logo" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panneau d'administration</h1>
              <p className="text-sm text-gray-500">Gérez votre contenu et vos messages</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors" data-testid="admin-logout-button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
                }`}
                data-testid={`admin-tab-${tab.id}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && <DashboardTab stats={stats} analyticsData={analyticsData} />}
        {activeTab === "analytics" && <AnalyticsTab analyticsData={analyticsData} messages={messages} />}
        {activeTab === "articles" && <ArticlesTab articles={articles} authHeader={authHeader} onRefresh={handleRefresh} />}
        {activeTab === "messages" && (
          <MessagesTab 
            messages={messages} 
            authHeader={authHeader} 
            onRefresh={handleRefresh}
            readMessages={readMessages}
            onMarkAsRead={markAsRead}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
