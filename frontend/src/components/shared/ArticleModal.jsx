import React, { useState,useEffect  } from "react";
import axios from "axios";
import "../css/ArticleModal.css";
import CommentCard from "./CommentCard"; // adjust path if needed

export default function ArticleModal({ article, onClose }) {
  if (!article) return null;

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articleId, setArticleId] = useState(null);

  // Helper to send /view and return articleId
  const ensureArticleInDatabase = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/article/view",
        {
          link: article.link,
          title: article.title,
          description: article.description || null,
          image_url: article.image_url || null,
          publishedAt: article.pubDate || null,
          author: article.creator || null,
          source_name: article.source_name || null,
          source_url: article.source_url || null,
          source_icon: article.source_icon || null,
          category: article.category || null,
          country: article.country || null,
        },
        { withCredentials: true }
      );
     
      return res.data.articleId;
    } catch (error) {
      console.error("Failed to mark article as viewed:", error);
      console.log("Article data from ensureArticleInDatabase:", {
        link: article.link,
        title: article.title,
        description: article.description || null,
        image_url: article.image_url || null,
        publishedAt: article.pubDate || null,
        author: article.creator || null,
        source_name: article.source_name || null,
        source_url: article.source_url || null,
        source_icon: article.source_icon || null,
        category: article.category || null,
        country: article.country || null,
      });
      return null;
    }
  };
  useEffect(() => {
  const storeArticleAndSetId = async () => {
    const id = await ensureArticleInDatabase();
    if (id) {
      setArticleId(id);
    }
  };
  storeArticleAndSetId();
}, [article]);


  const handleReadFull = async () => {
    await ensureArticleInDatabase();
    window.open(article.link, "_blank");
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      const articleId = await ensureArticleInDatabase();
      if (!articleId) return;

      await axios.patch(
        "http://localhost:4000/api/article/like",
        {
          articleId,
        },
        { withCredentials: true }
      );

      setLiked(!liked);
    } catch (error) {
      console.error("Error liking article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      setLoading(true);
      const articleId = await ensureArticleInDatabase();
      if (!articleId) return;

      await axios.patch(
        "http://localhost:4000/api/article/bookmark",
        {
          articleId,
        },
        { withCredentials: true }
      );

      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("Error bookmarking article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content bg-dark text-light"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="modal-image mb-3"
          />
        )}

        <h2>{article.title}</h2>
        <p>{article.description || "No description available."}</p>

        {article.creator && (
          <p>
            <strong>By:</strong>{" "}
            {Array.isArray(article.creator)
              ? article.creator.join(", ")
              : article.creator}
          </p>
        )}

        <p>
          <strong>Published:</strong>{" "}
          {article.pubDate
            ? new Date(article.pubDate).toLocaleString()
            : "Unknown"}
        </p>

        <p>
          <strong>Source:</strong> {article.source_name || "N/A"}&nbsp;&nbsp;
          {
            <a href={article.source_url} target="_blank">
              <img
                src={article.source_icon}
                alt=""
                style={{ height: "30px", width: "30px" }}
              />
            </a>
          }
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {Array.isArray(article.category)
            ? article.category.join(", ")
            : article.category || "N/A"}
        </p>

        <p>
          <strong>Country:</strong>{" "}
          {Array.isArray(article.country)
            ? article.country.join(", ")
            : article.country || "N/A"}
        </p>

        <div className="d-flex gap-2 mt-4 flex-wrap">
          <button
            className="btn btn-outline-primary"
            onClick={handleReadFull}
            disabled={loading}
          >
            Read Full Article
          </button>

          <button
            className={`btn ${liked ? "btn-success" : "btn-outline-success"}`}
            onClick={handleLike}
            disabled={loading}
          >
            {liked ? "Liked" : "Like"}
          </button>

          <button
            className={`btn ${
              bookmarked ? "btn-warning text-dark" : "btn-outline-warning"
            }`}
            onClick={handleBookmark}
            disabled={loading}
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
        {articleId && <CommentCard articleId={articleId} />}
      </div>
    </div>
  );
}
