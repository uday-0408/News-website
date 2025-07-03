// components/ArticleCard.js
import React, { useRef } from 'react';
import defaultImage from '../../assets/default.png' 

export default function ArticleCard({ article, onHover }) {
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      onHover(article);
    }, 3000); // 2s delay
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
  };

  const truncate = (text, max) => {
    if (!text) return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
  };

  return (
    <div
      className="card h-100 border shadow-sm"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
          src={article.image_url}
          alt='No image available'
          className="card-img-top"
          style={{ height: '180px', objectFit: 'cover' }}
        />
      {/* {console.log('image',article.image_url)} */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{truncate(article.title, 700)}</h5>
        <p className="card-text text-muted small mb-1">
          {article.source_name || 'Unknown Source'}
        </p>
        <p className="card-text">
          {truncate(article.description || 'No Description', 100)}
        </p>
        {article.viewedAt && (
          <p className="text-muted small mt-auto">
            Viewed: {new Date(article.viewedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
