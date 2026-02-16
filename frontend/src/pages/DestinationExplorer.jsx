import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";
import LottiePlaceholder from "../component/LottiePlaceholder";
import { LocationIcon } from "../component/Icons";

export default function DestinationExplorer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  const categories = [
    { value: "Heritage", label: "Heritage" },
    { value: "Nature", label: "Nature" },
    { value: "Religious", label: "Religious" },
    { value: "Adventure", label: "Adventure" },
    { value: "Beach", label: "Beach" },
    { value: "Hill Station", label: "Hill Station" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [destRes, stateRes] = await Promise.all([
          apiClient.destinations.getAll({ limit: 100 }),
          apiClient.states.getAll()
        ]);
        setDestinations(destRes.data);
        setStates(stateRes.data);
        setFilteredDestinations(destRes.data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = destinations;

    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(dest => dest.state === selectedState || dest.state?._id === selectedState);
    }

    if (selectedCategory) {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  }, [searchQuery, selectedState, selectedCategory, destinations]);

  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)" }}>

      <section style={{
        background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
        color: "var(--paper)",
        padding: "clamp(40px, 8vw, 60px) clamp(20px, 4vw, 40px)",
        textAlign: "center"
      }}>
        <h1 style={{
          fontFamily: "var(--heading)",
          fontSize: "clamp(2rem, 7vw, 3rem)",
          marginBottom: "clamp(12px, 2vw, 16px)"
        }}>
          Explore Destinations
        </h1>
        <p style={{
          fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
          opacity: 0.9,
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          Discover amazing tourist places across India. Search, filter, and find your next adventure!
        </p>
      </section>

      <section style={{
        padding: "clamp(26px, 5vw, 40px)",
        maxWidth: "1300px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ marginBottom: "clamp(20px, 4vw, 30px)" }}>
          <input
            type="text"
            placeholder="Search by destination name, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 20px)",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              border: "2px solid var(--accent)",
              borderRadius: "8px",
              fontFamily: "var(--body)",
              transition: "var(--transition)",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.boxShadow = "0 0 0 3px rgba(155, 74, 26, 0.1)"}
            onBlur={(e) => e.target.style.boxShadow = "none"}
          />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(200px, 80vw, 280px), 1fr))",
          gap: "clamp(12px, 3vw, 20px)",
          marginBottom: "clamp(24px, 6vw, 40px)"
        }}>

          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "clamp(8px, 2vw, 10px)",
              color: "var(--dark)",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
            }}>
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "clamp(10px, 2.5vw, 12px)",
                border: "2px solid var(--accent)",
                borderRadius: "6px",
                fontFamily: "var(--body)",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "clamp(8px, 2vw, 10px)",
              color: "var(--dark)",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
            }}>
              Filter by State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: "100%",
                padding: "clamp(10px, 2.5vw, 12px)",
                border: "2px solid var(--accent)",
                borderRadius: "6px",
                fontFamily: "var(--body)",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedState("");
                setSelectedCategory("");
              }}
              style={{
                width: "100%",
                padding: "clamp(10px, 2.5vw, 12px)",
                background: "var(--muted)",
                color: "var(--paper)",
                border: "none",
                borderRadius: "6px",
                fontFamily: "var(--body)",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "var(--transition)"
              }}
              onMouseOver={(e) => e.target.style.background = "var(--dark)"}
              onMouseOut={(e) => e.target.style.background = "var(--muted)"}
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div style={{
          marginBottom: "30px",
          padding: "16px",
          background: "rgba(155, 74, 26, 0.1)",
          borderRadius: "8px",
          color: "var(--dark)",
          fontWeight: "600"
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
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(250px, 85vw, 280px), 1fr))",
            gap: "clamp(16px, 3vw, 24px)"
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
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "var(--transition)",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(155, 74, 26, 0.25)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}>
                  <div style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    background: "#f0f0f0"
                  }}>
                    <img 
                      src={destination.images?.[0] || '/assets/fallback.jpg'}
                      alt={destination.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "var(--transition)"
                      }}
                      onError={(e) => { e.target.src = '/error.svg'; }}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    />
                  </div>

                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <h3 style={{
                        fontFamily: "var(--heading)",
                        fontSize: "1.3rem",
                        color: "var(--dark)",
                        margin: "0 0 8px 0"
                      }}>
                        {destination.name}
                      </h3>
                      <p style={{
                        fontSize: "0.9rem",
                        color: "var(--muted)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <LocationIcon size={16} color="var(--accent)" />
                        {destination.state?.name || destination.city}
                      </p>
                    </div>

                    <p style={{
                      fontSize: "0.95rem",
                      color: "var(--muted)",
                      lineHeight: "1.6",
                      flex: 1,
                      margin: "12px 0"
                    }}>
                      {destination.description?.substring(0, 100)}...
                    </p>


                    <div style={{
                      display: "inline-block",
                      background: "rgba(155, 74, 26, 0.1)",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      color: "var(--accent)",
                      fontWeight: "600",
                      marginTop: "12px"
                    }}>
                      {destination.category}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        ) : !loading && !error && (
          <LottiePlaceholder
            title="No Destinations Found"
            message="Try adjusting your search or filters"
          />
        )}
      </section>
    </div>
  );
}
