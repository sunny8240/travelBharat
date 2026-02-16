import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AutoGallery.css';
import IconSvg from './IconSvg'

export default function AutoGallery({ items = [], speed = 30, label = 'Explore', maxItems = 14 }) {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);

  const visible = items.slice(0, maxItems);

  const doubled = useMemo(() => [...visible, ...visible], [visible]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const base = 42; 
    const speedFactor = 30 / Math.max(1, speed);
    let duration = Math.round(base * speedFactor);
    if (duration < 40) duration = 40;
    if (duration > 48) duration = 48;
    track.style.setProperty('--scroll-duration', `${duration}s`);
  }, [visible, speed]);

  const cardWidth = 360; 
  const cardGap = 28; 

  const handleScroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    setIsManualScroll(true);
    const itemCount = visible.length;
    const totalWidth = itemCount * (cardWidth + cardGap);
    const step = cardWidth + cardGap;

    let newPos = scrollPos + (direction === 'left' ? -step : step);
    newPos = Math.max(0, Math.min(newPos, totalWidth - step));

    setScrollPos(newPos);
    track.style.transform = `translateX(-${newPos}px)`;

    setTimeout(() => {
      setIsManualScroll(false);
      setScrollPos(0);
      track.style.transform = 'translateX(0)';
    }, 5000);
  };

  const onActivate = (slug) => {
    if (slug) navigate(`/destination/${slug}`);
    else navigate('/destinations');
  };

  if (!visible || visible.length === 0) return null;

  return (
    <section className="auto-gallery">
      <div className="gallery-header">
        <h3>{label}</h3>
      </div>

      <div className="gallery-controls">
        <button
          className="gallery-nav-btn gallery-nav-left"
          onClick={() => handleScroll('left')}
          aria-label="Scroll gallery left"
          title="Move left"
        >
          <IconSvg name="chevronLeft" size={18} />
        </button>

        <div className="gallery-viewport" aria-hidden={false}>
          <div
            className={`gallery-track ${isManualScroll ? 'manual' : ''}`}
            ref={trackRef}
          >
            {doubled.map((it, idx) => (
              <button
                key={idx}
                className="gallery-card"
                onClick={() => onActivate(it.slug)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onActivate(it.slug); }}
                title={it.name}
                aria-label={`Open ${it.name}`}
              >
                <img src={it.image} alt={it.name} onError={(e) => { e.target.src = '/error.svg'; }} />
                <div className="gallery-label">{it.name}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          className="gallery-nav-btn gallery-nav-right"
          onClick={() => handleScroll('right')}
          aria-label="Scroll gallery right"
          title="Move right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
