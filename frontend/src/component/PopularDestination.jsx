import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../services/api";
import LottiePlaceholder from "./LottiePlaceholder";

export default function PopularDestination() {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const response = await apiClient.destinations.getAll({ limit: 6 });
                setDestinations(response.data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <section className="popular-destinations" style={{
            padding: "60px 40px",
            background: "var(--paper)",
            maxWidth: "1300px",
            margin: "0 auto"
        }}>
            <h2 style={{ 
                fontFamily: "var(--heading)", 
                color: "var(--accent)", 
                textAlign: "center", 
                marginTop: "40px", 
                fontSize: "2.8rem", 
                marginBottom: "2rem" 
            }}>
                Popular Destinations in India
            </h2>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading destinations...</p>
                </div>
            ) : error ? (
                <LottiePlaceholder
                    title="Unable to Load Destinations"
                    message="Something went wrong. Please try again later."
                />
            ) : destinations.length === 0 ? (
                <LottiePlaceholder
                    title="No Destinations Found"
                    message="Check back soon for more amazing destinations!"
                />
            ) : (
                <div className="cards-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "24px"
                }}>
                    {destinations.map((destination) => (
                        <div
                            key={destination._id}
                            role="link"
                            tabIndex={0}
                            onClick={() => navigate(`/destination/${destination.slug}`)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate(`/destination/${destination.slug}`);
                                }
                            }}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                transition: 'var(--transition)',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(155, 74, 26, 0.25)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                width: '100%',
                                height: '200px',
                                overflow: 'hidden',
                                background: '#f0f0f0'
                            }}>
                                <img
                                    src={destination.images?.[0] || '/assets/fallback.jpg'}
                                    alt={destination.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'var(--transition)'
                                    }}
                                    onError={(e) => { e.target.src = '/error.svg'; }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            </div>

                            {/* Content */}
                            <div style={{ padding: '20px' }}>
                                <h3 style={{
                                    fontFamily: 'var(--heading)',
                                    fontSize: '1.3rem',
                                    color: 'var(--dark)',
                                    margin: '0 0 8px 0'
                                }}>
                                    {destination.name}
                                </h3>

                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--muted)',
                                    marginBottom: '12px'
                                }}>
                                    {destination.state?.name || destination.city}
                                </p>

                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'var(--muted)',
                                    lineHeight: '1.6',
                                    marginBottom: '12px'
                                }}>
                                    {destination.description?.substring(0, 100)}...
                                </p>

                                {/* Category Badge */}
                                <div style={{
                                    display: 'inline-block',
                                    background: 'rgba(155, 74, 26, 0.1)',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    color: 'var(--accent)',
                                    fontWeight: '600'
                                }}>
                                    {destination.category}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}