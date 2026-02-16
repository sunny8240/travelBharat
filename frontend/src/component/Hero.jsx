import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Experience India Like Never Before</h1>
        <p className="hero-subtitle">Uncover hidden gems, connect with local culture, and create memories that last forever</p>
        <p className="hero-description">
          Escape the ordinary and dive into India's most captivating destinations. Whether you're seeking adventure in misty mountains, tranquility by pristine waters, or vibrant energy in bustling bazaars, Travel Bharat guides you to authentic experiences crafted by locals and loved by explorers. Your next unforgettable story awaits.
        </p>
        <Link to="/destinations" className="btn btn-primary" aria-label="Explore destinations">Explore Now</Link>
      </div>
    </section>
  );
}
