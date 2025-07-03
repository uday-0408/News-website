import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/shared/ArticleCard";
import ArticleModal from "../components/shared/ArticleModal";

const categoryOptions = [
  "top",
  "business",
  "entertainment",
  "environment",
  "food",
  "health",
  "politics",
  "science",
  "sports",
  "technology",
  "world",
];

const countryOptions = [
  { code: "in", label: "India" },
  { code: "us", label: "USA" },
  { code: "gb", label: "UK" },
  { code: "au", label: "Australia" },
  { code: "ca", label: "Canada" },
  { code: "jp", label: "Japan" },
];

const languageOptions = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
];

export default function News() {
  const [articles, setArticles] = useState([]);
  const [hoveredArticle, setHoveredArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("top");
  const [country, setCountry] = useState("in");
  const [language, setLanguage] = useState("en");
  const [articleSize, setArticleSize] = useState(9);

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:4000/api/news/fetch", {
        params: { category, country, language, articleSize },
        withCredentials: true,
      });

      if (res.data.success && res.data.articles) {
        setArticles(res.data.articles);
      } else {
        setArticles([]);
        setError(res.data.message || "No articles found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch news.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };
  const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


  // useEffect(() => {
  //   fetchNews();
  // }, [category, country, language, articleSize]);

  return (
    <div className={`container mt-4 ${hoveredArticle ? "blurred" : ""}`}>
      {/* Filters and Header */}
      <nav className="navbar bg-light px-3 rounded shadow-sm mb-4">
        <div className="container-fluid">
          {/* Title */}
          <span className="navbar-brand mb-0 h4">📰 {capitalize(category)} News</span>

          {/* Button + Dropdowns */}
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button className="btn btn-primary btn-sm" onClick={fetchNews}>
              Load News
            </button>

            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countryOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languageOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={articleSize}
              onChange={(e) => setArticleSize(Number(e.target.value))}
            >
              {[3, 6, 9, 12, 15].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* Loader */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Articles */}
      {!loading && articles.length > 0 && (
        <div className="row">
          {articles.map((article, idx) => (
            <div className="col-md-4 mb-3" key={article.article_id || idx}>
              <ArticleCard article={article} onHover={setHoveredArticle} />
            </div>
          ))}
        </div>
      )}

      {/* No Articles */}
      {!loading && !error && articles.length === 0 && (
        <p className="text-center text-muted">No articles available.</p>
      )}

      {/* Modal */}
      <ArticleModal
        article={hoveredArticle}
        onClose={() => setHoveredArticle(null)}
      />
    </div>
  );
}
