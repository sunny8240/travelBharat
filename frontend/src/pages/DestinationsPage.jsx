import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import LottiePlaceholder from "../component/LottiePlaceholder";
import { LocationIcon } from "../component/Icons";
import IconSvg from '../component/IconSvg'

export default function DestinationsPage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.destinations.getAll({ limit: 100 });
        const destArray = response.data || response || [];
        setDestinations(Array.isArray(destArray) ? destArray : []);
      } catch (err) {
        console.error('[DestinationsPage] Error:', err);
        setError(err.message || "Failed to load destinations");
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.state?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
        color: "var(--paper)",
        padding: "clamp(40px, 8vw, 60px) clamp(20px, 4vw, 40px)",
        textAlign: "center"
      }}>
        <h1 style={{
          fontFamily: "var(--heading)",
          fontSize: "clamp(2rem, 7vw, 3rem)",
          marginBottom: "clamp(8px, 2vw, 12px)"
        }}>
          Explore All Destinations
        </h1>
        <p style={{
          fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
          opacity: 0.9
        }}>
          Discover the most beautiful and culturally rich destinations across India
        </p>
      </div>

      <div style={{
        maxWidth: "800px",
        margin: "clamp(-20px, -3vw, -30px) auto 0",
        padding: "0 clamp(12px, 3vw, 20px)",
        position: "relative",
        zIndex: 10
      }}>
        <input
          type="text"
          placeholder="Search by destination name, state, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 20px)",
            borderRadius: "12px",
            border: "none",
            fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
            boxShadow: "0 8px 24px rgba(155, 74, 26, 0.15)",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px) clamp(26px, 5vw, 40px)",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{
          marginBottom: "clamp(20px, 4vw, 30px)",
          padding: "clamp(12px, 2vw, 16px)",
          background: "rgba(155, 74, 26, 0.1)",
          borderRadius: "8px",
          color: "var(--dark)",
          fontWeight: "600",
          fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
        }}>
          Found {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? "s" : ""}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading destinations...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            <iframe
              src="https://lottie.host/embed/f9ebd175-d47d-4f53-bcb5-9cc100bdfe13/a6aMlzIDaZ.lottie"
              title="No data animation"
              style={{ border: 'none', width: '100%', maxWidth: '480px', height: '360px', margin: '0 auto' }}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}


        {!loading && !error && filteredDestinations.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px, 85vw, 300px), 1fr))",
            gap: "clamp(16px, 3vw, 32px)"
          }}>
            {filteredDestinations.map(destination => (
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
                  background: "white",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "pointer",
                  height: "380px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: "1px solid rgba(0, 0, 0, 0.05)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-14px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(155, 74, 26, 0.18)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                }}>
                  <div style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)",
                    position: "relative"
                  }}>
                    <img 
                      src={destination.images?.[0] || '/assets/fallback.jpg'}
                      alt={destination.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                      onError={(e) => {
                        e.target.src = '/error.svg';
                      }}
                      onLoad={(e) => {}}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.12)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    />
                    
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.2) 100%)',
                      pointerEvents: 'none'
                    }}></div>

                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(239, 68, 68, 0.95)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {destination.category}
                    </div>
                  </div>

                  <div style={{ 
                    padding: "20px", 
                    flex: 1, 
                    display: "flex", 
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>

                    <div style={{ marginBottom: "8px" }}>
                      <h3 style={{
                        fontFamily: "var(--heading)",
                        fontSize: "1.35rem",
                        color: "var(--dark)",
                        margin: "0 0 6px 0",
                        fontWeight: "700",
                        letterSpacing: "-0.3px"
                      }}>
                        {destination.name}
                      </h3>
                      <div style={{
                        fontSize: "0.9rem",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <LocationIcon size={16} color="var(--accent)" />
                        {destination.state?.name || destination.city}
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: "0.95rem",
                      color: "#6b7280",
                      lineHeight: "1.5",
                      margin: "12px 0 0 0",
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '48px'
                    }}>
                      {destination.description || 'Explore the beauty of this destination.'}
                    </p>

                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "linear-gradient(135deg, var(--accent) 0%, rgba(155, 74, 26, 0.85) 100%)",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      marginTop: "12px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      width: "fit-content",
                      boxShadow: "0 4px 12px rgba(155, 74, 26, 0.25)"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.gap = "10px";
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(155, 74, 26, 0.35)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.gap = "6px";
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(155, 74, 26, 0.25)";
                    }}>
                      <span>View</span>
                      <span style={{ fontSize: "1rem", fontWeight: "700" }}>→</span>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        ) : !loading && !error && (
          <LottiePlaceholder
            title="No Destinations Found"
            message="Try adjusting your search terms"
          />
        )}
      </section>
    </div>
  );
}
