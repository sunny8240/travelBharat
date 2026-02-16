import { useState } from "react";
import "../styles/GallerySlider.css";
import IconSvg from './IconSvg'

export default function GallerySlider({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  return (
    <div className="gallery-slider" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="slider-container">
        <div className="slider-wrapper">
          <div 
            className="slider" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="slide">
                <img src={image} alt={`${title} ${index + 1}`} onError={(e) => { e.target.src = '/error.svg'; }} />
                <div className="slide-label">{title}</div>
                <div className="slide-number">
                  {index + 1} / {images.length}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="thumbnails">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} onError={(e) => { e.target.src = '/error.svg'; }} />
            </div>
          ))}
        </div>

        <div className="controls">
          <button 
            className="btn" 
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <span className="slide-info">
            <span>{currentIndex + 1}</span> / <span>{images.length}</span>
          </span>
          <button 
            className="btn" 
            onClick={nextSlide}
            disabled={currentIndex === images.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

