import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <Link to="/" className="logo" onClick={closeMenu}>
        <img src={logo} alt="Travel Bharat Logo" />
        <span className="travel">Travel</span>
        <span className="bharat">Bharat</span>
      </Link>

      {/* Menu */}
      <button
        className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Links */}
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/states" className="nav-link" onClick={closeMenu}>States</Link>
        <Link to="/destinations" className="nav-link" onClick={closeMenu}>Destinations</Link>
        <Link to="/explore-destinations" className="nav-link" onClick={closeMenu}>Explore</Link>
        <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/admin" className="nav-link" onClick={closeMenu}>
              {user?.role === 'admin' ? 'admin' : (user?.name || user?.email)}
            </Link>
            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-login" onClick={closeMenu}>Login</Link>
        )}
      </div>
    </nav>
  );
}
