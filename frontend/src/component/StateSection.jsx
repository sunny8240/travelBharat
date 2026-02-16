import { Link } from "react-router-dom";

export default function StateSection() {
  return (
    <section className="state-section">
      <h2>Discover the Diversity of Indian States</h2>
      <p>
        India is a land of incredible diversity, with each state offering its
        own unique culture, traditions, and attractions. From the serene
        backwaters of Kerala to the vibrant festivals of Rajasthan, there's
        something for every traveler to explore. Whether you're seeking
        historical landmarks, natural beauty, or vibrant city life, India's
        states have it all. Dive into the rich tapestry of experiences that
        await you in each corner of this incredible country.
      </p>
      <Link to="/states" className="explore-states-button">
        Explore States
      </Link>
    </section>
  );
}
