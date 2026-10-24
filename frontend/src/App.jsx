
import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

const categories = [
  "general",
  "business",
  "technology",
  "sports",
  "health",
  "science",
  "entertainment"
];

function App() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("general");
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchArticles(url) {
    setLoading(true);
    setError("");
    setArticles([]);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to load news"
        );
      }

      const news = Array.isArray(data.articles)
        ? data.articles.filter(
            (article) =>
              article.title &&
              article.title !== "[Removed]" &&
              article.url
          )
        : [];

      setArticles(news);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Backend connect nahi ho raha. Check karo ki localhost:5000 par server chal raha hai."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function loadNews(selectedCategory = category) {
    setActiveSearch("");
    return fetchArticles(
      `${API}/news?category=${encodeURIComponent(
        selectedCategory
      )}&country=in&pageSize=24`
    );
  }

  async function searchNews(event) {
    event.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) {
      setActiveSearch("");
      return loadNews(category);
    }

    setActiveSearch(searchTerm);

    return fetchArticles(
      `${API}/search?q=${encodeURIComponent(
        searchTerm
      )}&pageSize=24`
    );
  }

  useEffect(() => {
    loadNews(category);
  }, [category]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="logo">DailyPulse</div>
          <p>Fast, clean and simple news.</p>
        </div>

        <form onSubmit={searchNews} className="search">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news..."
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <nav className="categories">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item && !activeSearch ? "active" : ""}
            onClick={() => {
              setQuery("");
              setActiveSearch("");
              setCategory(item);
            }}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

      <main>
        <div className="title-row">
          <h1>
            {activeSearch
              ? `Search: ${activeSearch}`
              : `${category[0].toUpperCase()}${category.slice(1)} News`}
          </h1>

          <button
            type="button"
            className="refresh"
            onClick={() =>
              activeSearch
                ? fetchArticles(
                    `${API}/search?q=${encodeURIComponent(
                      activeSearch
                    )}&pageSize=24`
                  )
                : loadNews(category)
            }
          >
            ↻ Refresh
          </button>
        </div>

        {loading && (
          <div className="status">Loading latest news...</div>
        )}

        {error && (
          <div className="status error">{error}</div>
        )}

        {!loading && !error && articles.length > 0 && (
          <section className="grid">
            {articles.map((article, index) => (
              <article
                className="card"
                key={article.url || index}
              >
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    DailyPulse
                  </div>
                )}

                <div className="content">
                  <span className="source">
                    {article.source?.name || "News"}
                  </span>

                  <h2>{article.title}</h2>

                  <p>
                    {article.description ||
                      "Read the full story for more details."}
                  </p>

                  <div className="bottom">
                    <small>
                      {article.publishedAt
                        ? new Date(
                            article.publishedAt
                          ).toLocaleString()
                        : ""}
                    </small>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="status">
            No articles found. Try another category.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
