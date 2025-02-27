// NewsFeed.tsx
import React, { useState, useEffect } from 'react';
import { Article } from './types';
import { fetchNews, fetchLanguages } from './api';
import { languageMap } from './languageMap';



const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<{ query: string; language: string }>({ query: '', language: 'en' });

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const fetchedLanguages = await fetchLanguages();
        setLanguages(fetchedLanguages.map(lang => lang.code));
      } catch (err) {
        console.error('Fehler beim Laden der Sprachen', err);
      }
    };
    loadLanguages();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNews(searchParams.query, searchParams.language);
        setArticles(data.articles);
      } catch (err) {
        setError('Fehler beim Laden der Nachrichten');
      } finally {
        setLoading(false);
      }
    };
    if (searchParams.query || searchParams.language !== 'en') {
      loadNews();
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams({ query, language });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col justify-center  ">
      <h1 className="text-4xl font-bold text-center text-brown-700 mb-6">Breaking News</h1>
      
      <form className="flex justify-center mb-6 " onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Type to search..."
          className="border border-gray-300 rounded-md p-2 w-1/3 mr-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-md p-2 w-1/5 mr-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.entries(languageMap).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-brown-700 border  text-white rounded-md px-4 py-2 hover:bg-brown-800 focus: shadow-lg transform active:scale-75 transition-transform"
        >
          Search
        </button>
      </form>

      {loading && <div className="text-center">Laden...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800 text-white">
          {articles.map((article, index) => (
            <div key={index} className="rounded-md shadow-2xl p-4">
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-md mb-4" />
              )}
              <h2 className="text-lg font-bold mb-2">{article.title}</h2>
              <p className="text-sm mb-4">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline self-end"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
