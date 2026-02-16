import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import GallerySlider from "../component/GallerySlider";
import LottiePlaceholder from "../component/LottiePlaceholder";
import { extractMapSrc } from "../utils/mapHelpers";
import { CalendarIcon, DollarIcon, ClockIcon } from "../component/Icons";

export default function DestinationDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [nearbyDestinations, setNearbyDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        let response;
        
        try {
          response = await apiClient.destinations.getBySlug(id);
        } catch (err) {
          response = await apiClient.destinations.getById(id);
        }
        
        const data = response.data || response;
        setDestination(data);
        
        let nearby = [];
        
        if (data.latitude && data.longitude) {
          try {
            const nearbyResponse = await apiClient.destinations.getNearby(
              data.latitude, 
              data.longitude, 
              50, 
              6
            );
            const nearbyData = Array.isArray(nearbyResponse.data) ? nearbyResponse.data : nearbyResponse.data?.data || [];
            nearby = nearbyData.slice(0, 6);
          } catch (err) {
          }
        }
        
        if (nearby.length === 0 && data.state && data.state._id) {
          const stateResponse = await apiClient.destinations.getByState(data.state._id);
          const stateDestArray = stateResponse.data || stateResponse || [];
          nearby = Array.isArray(stateDestArray) 
            ? stateDestArray.filter(d => d._id !== data._id).slice(0, 6)
            : [];
        }
        
        setNearbyDestinations(nearby);
      } catch (err) {
        setError(err.message || "Failed to load destination");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", paddingRight: "clamp(12px, 4vw, 20px)", paddingBottom: "clamp(20px, 6vw, 100px)", paddingLeft: "clamp(12px, 4vw, 20px)" }}>
        <p>Loading destination details...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", paddingRight: "clamp(12px, 4vw, 20px)", paddingBottom: "clamp(20px, 6vw, 100px)", paddingLeft: "clamp(12px, 4vw, 20px)" }}>
        <LottiePlaceholder
          title="Destination Not Found"
          message={error || "The destination you're looking for doesn't exist."}
        />
        
        <button 
          onClick={() => navigate("/destinations")}
          style={{
            background: "var(--accent)",
            color: "var(--paper)",
            border: "none",
            padding: "clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "var(--transition)",
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            marginTop: "clamp(16px, 4vw, 24px)"
          }}
          onMouseOver={(e) => e.target.style.background = "var(--dark)"}
          onMouseOut={(e) => e.target.style.background = "var(--accent)"}
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)" }}>
      <div style={{
        padding: "clamp(12px, 4vw, 20px) clamp(16px, 8vw, 40px)",
        maxWidth: "1200px", 
        margin: "0 auto" 
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: "var(--accent)",
            color: "var(--paper)",
            border: "none",
            padding: "clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "var(--transition)",
            fontSize: "clamp(0.85rem, 2vw, 1rem)"
          }}
          onMouseOver={(e) => e.target.style.background = "var(--dark)"}
          onMouseOut={(e) => e.target.style.background = "var(--accent)"}
        >
          ← Back
        </button>
      </div>

      <div style={{ padding: "clamp(24px, 8vw, 40px) clamp(12px, 4vw, 20px)", background: "#f5f5f5" }}>
        <GallerySlider images={destination.images || []} title={destination.name} />
      </div>

      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(32px, 8vw, 60px) clamp(16px, 6vw, 40px)"
      }}>
        <div style={{ marginBottom: "clamp(24px, 6vw, 40px)", textAlign: "center" }}>
          <h1 style={{
            fontFamily: "var(--heading)",
            fontSize: "clamp(1.75rem, 8vw, 3rem)",
            color: "var(--dark)",
            marginBottom: "12px"
          }}>
            {destination.name}
          </h1>
          <p style={{
            fontSize: "clamp(0.95rem, 3vw, 1.2rem)",
            color: "var(--accent)",
            fontWeight: "600"
          }}>
            {destination.state?.name || destination.city} • {destination.category}
          </p>
        </div>

        <div className="destination-detail-grid">
          <div>
            <div style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}>
              <h2 style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
                color: "var(--dark)",
                marginBottom: "16px",
                borderBottom: "3px solid var(--accent)",
                paddingBottom: "12px"
              }}>
                Description
              </h2>
              <p style={{
                fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                lineHeight: "1.8",
                color: "var(--muted)"
              }}>
                {destination.description}
              </p>
            </div>

            {destination.historicalSignificance && (
              <div style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)" }}>
                <h2 style={{
                  fontFamily: "var(--heading)",
                  fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
                  color: "var(--dark)",
                  marginBottom: "16px",
                  borderBottom: "3px solid var(--accent)",
                  paddingBottom: "12px"
                }}>
                  Historical Significance
                </h2>
                <p style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                  lineHeight: "1.8",
                  color: "var(--muted)"
                }}>
                  {destination.historicalSignificance}
                </p>
              </div>
            )}

            <div>
              <h2 style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
                color: "var(--dark)",
                marginBottom: "16px",
                borderBottom: "3px solid var(--accent)",
                paddingBottom: "12px"
              }}>
                Nearby Attractions
              </h2>
              {nearbyDestinations.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 40vw, 220px), 1fr))', 
                  gap: 'clamp(12px, 2vw, 16px)' 
                }}>
                  {nearbyDestinations.map(d => (
                    <div 
                      key={d._id} 
                      role="link" 
                      tabIndex={0}
                      onClick={() => navigate(`/destination/${d.slug}`)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/destination/${d.slug}`); }}
                      style={{ 
                        background: 'white', 
                        borderRadius: 10, 
                        overflow: 'hidden', 
                        boxShadow: '0 6px 18px rgba(0,0,0,0.06)', 
                        cursor: 'pointer',
                        transition: "var(--transition)"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{ height: 'clamp(100px, 25vw, 120px)', overflow: 'hidden', background: '#f0f0f0', position: 'relative' }}>
                        <img 
                          src={d.images?.[0] || '/assets/fallback.jpg'} 
                          alt={d.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => e.target.src = '/error.svg'} 
                        />
                        {d.distance && (
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                            fontWeight: '600'
                          }}>
                            {d.distance.toFixed(1)} km
                          </div>
                        )}
                      </div>
                      <div style={{ padding: 'clamp(8px, 2vw, 12px)' }}>
                        <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: "4px", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>{d.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)' }}>{d.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--muted)" }}>No nearby attractions available</p>
              )}
            </div>
          </div>


          <div>
            <div style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
              color: "var(--paper)",
              padding: "clamp(16px, 4vw, 24px)",
              borderRadius: "12px",
              marginBottom: "clamp(12px, 3vw, 20px)",
              boxShadow: "0 8px 24px rgba(155, 74, 26, 0.2)"
            }}>
              <h3 style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <CalendarIcon size={24} color="white" />
                Best Time to Visit
              </h3>
              <p style={{ lineHeight: "1.6", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                {destination.bestTimeToVisit}
              </p>
            </div>

              {extractMapSrc(destination.mapLink) && (
                <div style={{ marginBottom: 'clamp(12px, 3vw, 20px)' }}>
                  <div className="responsive-iframe">
                    <iframe title="destination-map" src={extractMapSrc(destination.mapLink)} loading="lazy" />
                  </div>
                </div>
              )}

            <div style={{
              background: "rgba(155, 74, 26, 0.05)",
              border: "2px solid var(--accent)",
              padding: "clamp(16px, 4vw, 24px)",
              borderRadius: "12px",
              marginBottom: "clamp(12px, 3vw, 20px)"
            }}>
              <h3 style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                color: "var(--dark)",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <DollarIcon size={24} color="var(--accent)" />
                Entry Fee
              </h3>
              <p style={{
                color: "var(--muted)",
                lineHeight: "1.6",
                fontWeight: "600",
                fontSize: "clamp(0.9rem, 2vw, 1rem)"
              }}>
                {destination.entryFee}
              </p>
            </div>

            <div style={{
              background: "rgba(155, 74, 26, 0.05)",
              border: "2px solid var(--accent)",
              padding: "clamp(16px, 4vw, 24px)",
              borderRadius: "12px"
            }}>
              <h3 style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                color: "var(--dark)",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <ClockIcon size={24} color="var(--accent)" />
                Timings
              </h3>
              <p style={{
                color: "var(--muted)",
                lineHeight: "1.6",
                fontWeight: "600",
                fontSize: "clamp(0.9rem, 2vw, 1rem)"
              }}>
                {destination.timings}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
