import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/api";
import LottiePlaceholder from "./LottiePlaceholder";
import IconSvg from './IconSvg'
import "../styles/HomeSearch.css";

export default function HomeSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all"); 
    const [selectedState, setSelectedState] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);
    const [allStates, setAllStates] = useState([]);
    const [allDestinations, setAllDestinations] = useState([]);
    const [_loadingStates, setLoadingStates] = useState(true);
    const [_loadingDestinations, setLoadingDestinations] = useState(true);
    const searchBoxRef = useRef(null);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await apiClient.states.getAll();
                const statesArray = response.data || response || [];
                setAllStates(Array.isArray(statesArray) ? statesArray : []);
            } catch (err) {
                console.error(err);
                setAllStates([]);
            } finally {
                setLoadingStates(false);
            }
        };

        const fetchDestinations = async () => {
            try {
                const response = await apiClient.destinations.getAll({ limit: 1000 });
                const destArray = response.data || response || [];
                setAllDestinations(Array.isArray(destArray) ? destArray : []);
            } catch (err) {
                console.error(err);
                setAllDestinations([]);
            } finally {
                setLoadingDestinations(false);
            }
        };

        fetchStates();
        fetchDestinations();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "" && selectedState === "") {
            setFilteredResults([]);
            return;
        }

        let results = [];
        const query = searchQuery.toLowerCase();

        // Search Destinations
        if (selectedType === "all" || selectedType === "destinations") {
            let destinations = allDestinations;

            if (selectedState) {
                destinations = destinations.filter(d => 
                    (d.state && d.state.name === selectedState) || (d.state === selectedState)
                );
            }

            if (query) {
                destinations = destinations.filter(d =>
                    d.name.toLowerCase().includes(query) ||
                    (d.state && typeof d.state === 'object' && d.state.name.toLowerCase().includes(query)) ||
                    (typeof d.state === 'string' && d.state.toLowerCase().includes(query)) ||
                    d.description.toLowerCase().includes(query) ||
                    (d.category && d.category.toLowerCase().includes(query))
                );
            }

            results = results.concat(destinations.map(d => ({ ...d, type: 'destination' })));
        }

        // Search States
        if ((selectedType === "all" || selectedType === "states") && !selectedState) {
            let states = allStates;

            if (query) {
                states = states.filter(s => s.name.toLowerCase().includes(query));
            }

            results = results.concat(states.map(s => ({ ...s, type: 'state' })));
        }

        setFilteredResults(results);
        setShowResults(true);
    }, [searchQuery, selectedType, selectedState, allStates, allDestinations]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchFocus = () => {
        if (searchQuery.trim() !== "" || selectedState !== "") {
            setShowResults(true);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setSelectedState("");
        setSelectedType("all");
        setShowResults(false);
    };

    const destinationResults = filteredResults.filter(r => r.type === 'destination');
    const stateResults = filteredResults.filter(r => r.type === 'state');

    return (
        <div className="home-search-section">
            <div className="home-search-container">
                <h2 className="home-search-title">Find Your Perfect Destination</h2>
                <p className="home-search-subtitle">Search across all of India's beautiful destinations and states</p>

                <div className="home-search-form">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search destinations, states, or experiences..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={handleSearchFocus}
                            className="home-search-input"
                        />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="home-search-select"
                        >
                            <option value="all">All Results</option>
                            <option value="destinations">Destinations Only</option>
                            <option value="states">States Only</option>
                        </select>
                        {(searchQuery || selectedState) && (
                            <button
                                onClick={handleClearSearch}
                                className="home-search-clear"
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="search-input-wrapper">
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="home-search-select"
                            style={{ flex: 1 }}
                        >
                            <option value="">All States</option>
                            {allStates.map(state => (
                                <option key={state._id} value={state.name}>{state.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Results */}
                    {showResults && (searchQuery.trim() !== "" || selectedState !== "") && (
                        <div className="home-search-results" ref={searchBoxRef}>
                            {filteredResults.length > 0 ? (
                                <>
                                    <div className="search-results-header">
                                        Found <span className="results-count">{filteredResults.length}</span> result{filteredResults.length !== 1 ? 's' : ''}
                                    </div>
                                    <div className="search-results-list">
                                        {/* States Results */}
                                        {stateResults.length > 0 && (
                                            <>
                                                <div className="search-category-header">States</div>
                                                {stateResults.map((state, idx) => (
                                                    <Link
                                                        key={`state-${state._id || idx}`}
                                                        to={`/state/${encodeURIComponent(state.slug || state.name)}`}
                                                        className="search-result-item state-result-item"
                                                        onClick={() => setShowResults(false)}
                                                    >
                                                        <div className="result-item-icon"><IconSvg name="pin" size={18} /></div>
                                                        <div className="result-item-content">
                                                            <h4>{state.name}</h4>
                                                            <p className="result-state">Explore all destinations</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </>
                                        )}

                                        {/* Destinations Results */}
                                        {destinationResults.length > 0 && (
                                            <>
                                                <div className="search-category-header">Destinations</div>
                                                {destinationResults.map(destination => (
                                                    <Link
                                                        key={destination._id || destination.id}
                                                        to={`/destination/${destination.slug || destination._id}`}
                                                        className="search-result-item"
                                                        onClick={() => setShowResults(false)}
                                                    >
                                                        <div className="result-item-image">
                                                            <img
                                                                src={destination.images && destination.images[0]}
                                                                alt={destination.name}
                                                                onError={(e) => {
                                                                    e.target.src = '/error.svg';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="result-item-content">
                                                            <h4>{destination.name}</h4>
                                                            <p className="result-state">{destination.state && typeof destination.state === 'object' ? destination.state.name : destination.state}</p>
                                                            <p className="result-description">{destination.description.substring(0, 60)}...</p>
                                                        </div>
                                                        {destination.category && (
                                                            <span className="result-category">
                                                                {destination.category}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <LottiePlaceholder
                                    title="No Results Found"
                                    message="Try adjusting your filters or search terms."
                                />
                            )}
                        </div>
                    )}
                </div>

                <p className="home-search-cta">
                    <Link to="/explore-destinations" className="link-text">View all destinations →</Link>
                </p>
            </div>
        </div>
    );
}
