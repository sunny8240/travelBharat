import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import LottiePlaceholder from "../component/LottiePlaceholder";
import { extractMapSrc } from "../utils/mapHelpers";
import IconSvg from '../component/IconSvg';

export default function StateDestinations() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchStateAndDestinations = async () => {
      try {
        setLoading(true);
        const stateResponse = await apiClient.states.getBySlug(slug);
        const stateData = stateResponse.data || stateResponse;
        setState(stateData);

        const destResponse = await apiClient.destinations.getByState(stateData._id);
        const destArray = destResponse.data || destResponse || [];
        setDestinations(Array.isArray(destArray) ? destArray : []);
      } catch (err) {
        setError(err.message || "Failed to load state information");
      } finally {
        setLoading(false);
      }
    };

    fetchStateAndDestinations();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", paddingRight: "20px", paddingBottom: "100px", paddingLeft: "20px" }}>
        <p>Loading state information...</p>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", paddingRight: "20px", paddingBottom: "100px", paddingLeft: "20px" }}>
        {error ? (
          <LottiePlaceholder
            title="State Not Found"
            message={error || "The state you're looking for doesn't exist."}
          />
        ) : (
          <LottiePlaceholder
            title="State Not Found"
            message="The state you're looking for doesn't exist."
          />
        )}
        <button 
          onClick={() => navigate("/states")}
          style={{
            marginTop: "20px",
            background: "var(--accent)",
            color: "var(--paper)",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "var(--transition)"
          }}
          onMouseOver={(e) => e.target.style.background = "var(--dark)"}
          onMouseOut={(e) => e.target.style.background = "var(--accent)"}
        >
          Back to States
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)" }}>

      <section style={{
        background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
        color: "var(--paper)",
        padding: "clamp(40px, 8vw, 60px) clamp(20px, 4vw, 40px)",
        textAlign: "center"
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "clamp(12px, 2vw, 20px)",
            background: "rgba(255, 255, 255, 0.2)",
            color: "var(--paper)",
            border: "none",
            padding: "clamp(8px, 1.5vw, 10px) clamp(14px, 2vw, 20px)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            transition: "var(--transition)"
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
        >
          ← Back
        </button>
        
        <h1 style={{
          fontFamily: "var(--heading)",
          fontSize: "clamp(2rem, 7vw, 3rem)",
          marginBottom: "clamp(12px, 2vw, 16px)"
        }}>
          {state.name}
        </h1>
        <p style={{
          fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
          opacity: 0.9
        }}>
          Discover {destinations.length} amazing destination{destinations.length !== 1 ? "s" : ""} in {state.name}
        </p>
      </section>

      <section style={{ padding: "clamp(32px, 8vw, 60px) clamp(16px, 6vw, 40px)", maxWidth: "960px", margin: "0 auto" }}>
        <style>{`
          .state-layout-grid { 
            display: grid; 
            grid-template-columns: 1fr; 
            gap: clamp(28px, 6vw, 48px); 
            align-items: start; 
          }
          @media (min-width: 900px) {
            .state-layout-grid { grid-template-columns: 1fr 360px; }
          }
          @media (min-width: 1200px) {
            .state-layout-grid { grid-template-columns: 1fr 420px; }
          }
        `}</style>
        <div className="state-layout-grid">
          <div>
            <div style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}>
              <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.4rem, 5vw, 1.9rem)", color: "var(--dark)", marginBottom: "16px", borderBottom: "3px solid var(--accent)", paddingBottom: "12px" }}>
                Description
              </h2>
              <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: "1.8", color: "var(--muted)" }}>
                {state.description}
              </p>
            </div>

            {state.attractions && state.attractions.length > 0 && (
              <div style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}>
                <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.4rem, 5vw, 1.9rem)", color: "var(--dark)", marginBottom: "16px", borderBottom: "3px solid var(--accent)", paddingBottom: "12px" }}>
                  Key Attractions
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(150px, 40vw, 180px), 1fr))", gap: "clamp(12px, 2vw, 16px)" }}>
                  {state.attractions.slice(0, 6).map((a, i) => (
                    <div key={i} style={{ background: "rgba(155, 74, 26, 0.08)", padding: "clamp(10px, 2vw, 14px)", borderRadius: "10px", border: "1px solid rgba(155, 74, 26, 0.15)" }}>
                      <p style={{ margin: 0, fontSize: "clamp(0.85rem, 2vw, 0.95rem)", color: "var(--dark)", fontWeight: "500", lineHeight: "1.5" }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {extractMapSrc(state.mapLink) && (
              <div style={{ marginTop: "clamp(1.5rem, 4vw, 3rem)" }}>
                <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.4rem, 5vw, 1.9rem)", color: "var(--dark)", marginBottom: "16px", borderBottom: "3px solid var(--accent)", paddingBottom: "12px" }}>
                  Location Map
                </h2>
                <div className="responsive-iframe" style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
                  <iframe title="state-map" src={extractMapSrc(state.mapLink)} loading="lazy" style={{ width: "100%", height: "350px", border: "none" }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 3vw, 20px)" }}>
            {state.images && state.images.slice(0, 2).map((img, i) => (
              <div key={i} style={{ height: "clamp(140px, 35vw, 180px)", borderRadius: "12px", overflow: "hidden", background: "#f0f0f0", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", cursor: "pointer", transition: "var(--transition)" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"} onClick={() => setSelectedImage(img)}>
                <img 
                  src={img} 
                  alt={`${state.name} ${i}`} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e) => e.target.src = '/error.svg'} 
                />
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 16px)" }}>
              {state.type && (
                <div style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)", color: "var(--paper)", padding: "clamp(16px, 4vw, 24px)", borderRadius: "12px", boxShadow: "0 8px 24px rgba(155, 74, 26, 0.2)" }}>
                  <div style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)", fontWeight: "700", opacity: 0.85, marginBottom: "8px", letterSpacing: "0.5px" }}>TYPE</div>
                  <div style={{ fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)", fontWeight: "700", lineHeight: "1.3" }}>
                    {state.type}
                  </div>
                </div>
              )}

              {state.capital && (
                <div style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)", color: "white", padding: "clamp(16px, 4vw, 24px)", borderRadius: "12px", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.2)" }}>
                  <div style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)", fontWeight: "700", opacity: 0.85, marginBottom: "8px", letterSpacing: "0.5px" }}>CAPITAL</div>
                  <div style={{ fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)", fontWeight: "700", lineHeight: "1.3" }}>
                    {state.capital}
                  </div>
                </div>
              )}

              {state.area_km2 && (
                <div style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)", color: "white", padding: "clamp(16px, 4vw, 24px)", borderRadius: "12px", boxShadow: "0 8px 24px rgba(34, 197, 94, 0.2)" }}>
                  <div style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)", fontWeight: "700", opacity: 0.85, marginBottom: "8px", letterSpacing: "0.5px" }}>AREA</div>
                  <div style={{ fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)", fontWeight: "700", lineHeight: "1.3" }}>
                    {state.area_km2.toLocaleString()} km²
                  </div>
                </div>
              )}

              {state.bestTimeToVisit && (
                <div style={{ background: "linear-gradient(135deg, rgba(251, 146, 60, 0.95) 0%, rgba(234, 88, 12, 0.95) 100%)", color: "white", padding: "clamp(16px, 4vw, 24px)", borderRadius: "12px", boxShadow: "0 8px 24px rgba(251, 146, 60, 0.2)" }}>
                  <div style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)", fontWeight: "700", opacity: 0.85, marginBottom: "8px", letterSpacing: "0.5px" }}>BEST TIME</div>
                  <div style={{ fontSize: "clamp(1.05rem, 3vw, 1.25rem)", fontWeight: "600", lineHeight: "1.5" }}>
                    {state.bestTimeToVisit}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px)", maxWidth: "960px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ marginBottom: "clamp(24px, 6vw, 40px)", paddingBottom: "clamp(16px, 4vw, 24px)", borderBottom: "2px solid rgba(155, 74, 26, 0.15)" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.6rem, 6vw, 2.2rem)", color: "var(--dark)", margin: 0, marginBottom: "8px" }}>
            Explore Destinations
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "clamp(0.9rem, 2vw, 1rem)", margin: 0 }}>
            {destinations.length} {destinations.length === 1 ? "destination" : "destinations"} to discover
          </p>
        </div>
        {destinations.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(260px, 85vw, 300px), 1fr))',
            gap: 'clamp(16px, 3vw, 32px)'
          }}>
            {destinations.map(destination => (
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
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '420px',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 24px 48px rgba(155, 74, 26, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{
                  position: 'relative',
                  height: '240px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)'
                }}>
                  {destination.images && destination.images.length > 0 ? (
                    <img
                      src={destination.images[0]}
                      alt={destination.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onError={(e) => { e.target.src = '/error.svg'; }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.12) rotate(0.5deg)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1) rotate(0)'}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      <IconSvg name="pin" size={40} />
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
                    pointerEvents: 'none'
                  }}></div>
                </div>

                <div style={{
                  padding: '24px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--heading)',
                      fontSize: '1.5rem',
                      color: 'var(--dark)',
                      margin: '0',
                      fontWeight: '700',
                      letterSpacing: '-0.5px'
                    }}>{destination.name}</h3>

                    <p style={{
                      fontSize: '0.95rem',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      margin: '12px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '48px'
                    }}>{destination.description || 'Explore this place'}</p>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, var(--accent) 0%, rgba(155, 74, 26, 0.85) 100%)',
                      color: 'white',
                      padding: '11px 16px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: 'fit-content',
                      boxShadow: '0 4px 12px rgba(155, 74, 26, 0.25)'
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.gap = '12px';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 74, 26, 0.35)';
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.gap = '8px';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(155, 74, 26, 0.25)';
                    }}>
                      <span>Discover</span>
                      <span style={{ fontSize: '1rem', fontWeight: '700' }}>→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--muted)"
          }}>
            <h2 style={{
              fontFamily: "var(--heading)",
              fontSize: "1.8rem",
              marginBottom: "12px"
            }}>
              No destinations yet
            </h2>
            <p>No tourist places have been added yet for {state.name}.</p>
            <div style={{ marginTop: 20 }}>
              <button
                onClick={() => navigate('/states')}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--dark)'}
                onMouseOut={(e) => e.target.style.background = 'var(--accent)'}
              >
                Back to States
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedImage && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "clamp(16px, 4vw, 32px)" }} onClick={() => setSelectedImage(null)}>
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage} 
              alt="Full view" 
              style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "12px", objectFit: "contain" }} 
            />
            <button 
              onClick={() => setSelectedImage(null)} 
              style={{ position: "absolute", top: "clamp(12px, 3vw, 20px)", right: "clamp(12px, 3vw, 20px)", background: "rgba(255, 255, 255, 0.9)", border: "none", width: "clamp(36px, 8vw, 48px)", height: "clamp(36px, 8vw, 48px)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: "700", color: "var(--dark)", transition: "var(--transition)" }} 
              onMouseOver={(e) => e.target.style.background = "white"} 
              onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.9)"}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
