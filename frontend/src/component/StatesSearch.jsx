import { useState, useEffect } from "react";
import "../styles/StatesSearch.css";
import IconSvg from './IconSvg'

export default function StatesSearch({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (onSearch) {
            onSearch(searchQuery);
        }
    }, [searchQuery, onSearch]);

    const handleClear = () => {
        setSearchQuery("");
    };

    return (
        <div className="states-search-wrapper">
            <div className="states-search-container">
                <div className="states-search-box">
                    <input
                        type="text"
                        placeholder="Search states by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="states-search-input"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClear}
                            className="states-search-clear"
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <div className="states-search-hint">
                        Showing results for "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}
