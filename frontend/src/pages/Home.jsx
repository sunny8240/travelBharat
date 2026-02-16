import Hero from "../component/Hero";
import HomeSearch from "../component/HomeSearch";
import StateSection from "../component/StateSection";
import PopularDestinations from "../component/PopularDestination";
import AutoGallery from "../component/AutoGallery";
import { useDestinations } from "../hooks/useApi";
import { destinationsData } from "../data/destinationsData";

export default function Home() {
  const { destinations = [] } = useDestinations();
  const MAX_GALLERY = 14;

  const slugify = (s) => {
    if (!s) return null;
    return s
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const galleryItems = [];

  if (Array.isArray(destinations)) {
    destinations.forEach((d) => {
      if (d.isApproved === false) return;
      if (d.images && d.images.length > 0) {
        galleryItems.push({ image: d.images[0], name: d.name, slug: d.slug });
      }
    });
  }

  // Fallback
  if (galleryItems.length < MAX_GALLERY) {
    for (const def of destinationsData) {
      if (galleryItems.length >= MAX_GALLERY) break;
      if (!galleryItems.some((g) => g.name === def.name) && def.images && def.images.length > 0) {
        const match = destinations.find((d) => d.name && d.name.toLowerCase() === def.name.toLowerCase());
        const slug = match ? match.slug : slugify(def.name);
        galleryItems.push({ image: def.images[0], name: def.name, slug });
      }
    }
  }

  return (
    <div>
      <Hero />
      <HomeSearch />
      <StateSection />
      <PopularDestinations />
      <style>{`
        .marquee-wrap { width: 100%; overflow: hidden; box-sizing: border-box; padding: clamp(12px, 3vw, 20px) 0; }
        .marquee-row { --gap: clamp(12px, 3vw, 18px); display: block; overflow: hidden; }
        .marquee-track { display: flex; gap: var(--gap); align-items: center; will-change: transform; min-width: max-content; }
        .marquee-caption { position: absolute; left: 0; right: 0; bottom: 0; padding: 8px; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%); display:flex; align-items:center; }
        .marquee-caption-text { color: white; font-weight:600; font-size: clamp(0.8rem, 2.2vw, 1rem); padding: 6px 10px; background: rgba(0,0,0,0.25); border-radius: 8px; margin-left: 8px; }
        .marquee-item { position: relative; }
        .marquee-item { flex: 0 0 auto; width: clamp(140px, 22vw, 260px); height: clamp(90px, 14vw, 160px); border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06); cursor: pointer; }
        .marquee-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

        @keyframes move-left { from { transform: translateX(0%); } to { transform: translateX(-50%); } }
        @keyframes move-right { from { transform: translateX(-50%); } to { transform: translateX(0%); } }

        .marquee-track--left { animation: move-left linear infinite; animation-duration: 28s; }
        .marquee-track--right { animation: move-right linear infinite; animation-duration: 34s; }

        .marquee-row:hover .marquee-track--left,
        .marquee-row:hover .marquee-track--right { animation-play-state: paused; }

        @media (min-width: 900px) {
          .marquee-item { width: clamp(160px, 18vw, 300px); height: clamp(110px, 12vw, 180px); }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginTop: 'clamp(18px, 4vw, 28px)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>
        <h2 className="gallery-heading">Gallery</h2>
      </div>

      <style>{`
        .gallery-heading { font-family: var(--heading); font-size: clamp(1.1rem, 4vw, 1.6rem); color: var(--dark); margin: 0; }
      `}</style>

      <div className="marquee-wrap" aria-hidden="false">
        <div className="marquee-row" style={{ marginBottom: '12px' }}>
          <div className="marquee-track marquee-track--left" style={{ gap: 'var(--gap)' }}>
            {galleryItems.concat(galleryItems).map((g, i) => (
              <div key={`l-${i}`} className="marquee-item" onClick={() => window.location.href = `/destination/${g.slug}`} role="link" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') window.location.href = `/destination/${g.slug}` }}>
                <img src={g.image} alt={g.name} onError={(e) => e.target.src = '/error.svg'} />
                <div className="marquee-caption"><div className="marquee-caption-text">{g.name}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-row">
          <div className="marquee-track marquee-track--right" style={{ gap: 'var(--gap)' }}>
            {galleryItems.concat(galleryItems).map((g, i) => (
              <div key={`r-${i}`} className="marquee-item" onClick={() => window.location.href = `/destination/${g.slug}`} role="link" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') window.location.href = `/destination/${g.slug}` }}>
                <img src={g.image} alt={g.name} onError={(e) => e.target.src = '/error.svg'} />
                <div className="marquee-caption"><div className="marquee-caption-text">{g.name}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
