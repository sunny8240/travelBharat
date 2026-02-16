import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import apiClient from "../services/api";
import StatesSearch from "./StatesSearch";
import LottiePlaceholder from "./LottiePlaceholder";

export default function States() {
    const [states, setStates] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStates = async () => {
            try {
                setLoading(true);
                const response = await apiClient.states.getAll();
                const statesArray = response.data || response || [];
                const statesData = Array.isArray(statesArray) ? statesArray : [];
                setStates(statesData);
                setFilteredStates(statesData);
            } catch (err) {
                setError(err.message || "Failed to load states");
                setStates([]);
                setFilteredStates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStates();
    }, []);

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredStates(states);
        } else {
            const filtered = states.filter(state =>
                state.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStates(filtered);
        }
    };

    const displayStates = filteredStates.length > 0 ? filteredStates : states;

    return (
        <>
            <StatesSearch onSearch={handleSearch} />
            <section style={{
                padding: 'clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px)',
                maxWidth: '1300px',
                margin: '0 auto'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    fontSize: 'clamp(1.8rem, 7vw, 2.8rem)',
                    fontFamily: 'var(--heading)',
                    color: 'var(--dark)',
                    marginBottom: 'clamp(0.4rem, 1vw, 0.5rem)'
                }}>Explore Indian States</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', marginBottom: 'clamp(16px, 3vw, 22px)' }}>
                    <div style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem, 2vw, 0.98rem)' }}>
                        {loading ? 'Loading...' : `${displayStates.length} states`}
                    </div>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading states...</p>
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
                
                {!loading && !error && displayStates.length > 0 ? (
                    <div className="state-list">
                        {displayStates.map((state) => (
                            <div
                                key={state._id}
                                className="state-card"
                                role="link"
                                tabIndex={0}
                                onClick={() => navigate(`/state/${state.slug}`)}
                                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/state/${state.slug}`); }}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <img
                                    src={state.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'}
                                    alt={state.name}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop';
                                    }}
                                />
                                <h3>{state.name}</h3>
                                <p>{state.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        className="explore-button"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/state/${state.slug}`); }}
                                        aria-label={`Explore ${state.name}`}
                                    >
                                        Explore
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && !error && (
                    <LottiePlaceholder
                        title="No States Found"
                        message="Try adjusting your search terms."
                    />
                )}
            </section>
        </>
    );
}