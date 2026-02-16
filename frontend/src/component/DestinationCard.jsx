import React from "react";
import IconSvg from './IconSvg'

export default function DestinationCard({
  image,
  title,
  location,
  description,
  category = "Destination",
  tags = [],
  rating = null,
  isPopular = false,
  onExplore = () => {}
}) {
  const handleImgError = (e) => {
    e.currentTarget.src = '/assets/error.png';
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onExplore();
  };

  return (
    <article className="destination-card" role="article" tabIndex={0} onKeyDown={handleKeyDown} aria-label={`Destination: ${title}`}>
      <div className="card-media">
        <img src={image} alt={title} onError={handleImgError} />
        
        {/* Category Badge */}
        <div className="card-category-badge">{category}</div>
        
        {/* Popular Badge */}
        {isPopular && <div className="card-popular-badge"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFF55"><path d="M160-400q0-105 50-187t110-138q60-56 110-85.5l50-29.5v132q0 37 25 58.5t56 21.5q17 0 32.5-7t28.5-23l18-22q72 42 116 116.5T800-400q0 88-43 160.5T644-125q17-24 26.5-52.5T680-238q0-40-15-75.5T622-377L480-516 339-377q-29 29-44 64t-15 75q0 32 9.5 60.5T316-125q-70-42-113-114.5T160-400Zm320-4 85 83q17 17 26 38t9 45q0 49-35 83.5T480-120q-50 0-85-34.5T360-238q0-23 9-44.5t26-38.5l85-83Z"/></svg> Popular</div>}
        
        <div className="card-media-overlay">
          <div className="overlay-top">
            {location && <span className="card-location"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/></svg> {location}</span>}
          </div>
          <h3 className="card-title">{title}</h3>
        </div>
      </div>

      <div className="card-body">
        <p className="card-desc">{description}</p>
        
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map((t, i) => (
              <span key={i} className="tag">#{t}</span>
            ))}
            {tags.length > 3 && <span className="tag-more">+{tags.length - 3}</span>}
          </div>
        )}
        
        {rating && (
          <div className="card-rating">
            <span className="rating-stars">
              {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                <IconSvg key={i} name="star" size={14} style={{ marginRight: 4 }} />
              ))}
            </span>
            <span className="rating-value">{rating.toFixed(1)}</span>
          </div>
        )}

        <div className="card-actions">
          <button className="explore-btn" onClick={onExplore} aria-label={`Explore ${title}`}>
            Explore Destination →
          </button>
        </div>
      </div>
    </article>
  );
}
