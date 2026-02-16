import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="new_footer_area bg_color">
      <div className="new_footer_top">
        <div className="container">
          <div className="row">

            {/* About */}
            <div className="col-lg-4 col-md-6">
              <div className="f_widget about-widget">
                <h3 className="f-title f_600 t_color f_size_18">About TravelBharat</h3>
                <p className="footer-about-text">Your gateway to explore India state by state. Discover tourist destinations, attractions, and travel guides for all 28 states and UTs. Plan your perfect trip with comprehensive travel information and beautiful imagery.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-4 col-md-6">
              <div className="f_widget about-widget">
                <h3 className="f-title f_600 t_color f_size_18">Quick Links</h3>
                <ul className="list-unstyled f_list">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/destinations">Destinations</Link></li>
                  <li><Link to="/states">States</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>

            {/* Follow Us */}
            <div className="col-lg-4 col-md-6">
              <div className="f_widget social-widget">
                <h3 className="f-title f_600 t_color f_size_18">Connect With Us</h3>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px", lineHeight: "1.6" }}>Join our travel community and discover amazing destinations, travel tips, and exclusive updates about India's hidden gems.</p>
                <div className="f_social_icon">
                  <a href="https://facebook.com/travelbharat" target="_blank" rel="noopener noreferrer" aria-label="facebook" className="social-link" title="Follow on Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h3v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h3z"></path>
                    </svg>
                  </a>
                  <a href="https://x.com/travelbharat" target="_blank" rel="noopener noreferrer" aria-label="x" className="social-link" title="Follow on X">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="4" x2="20" y2="20"></line>
                      <line x1="20" y1="4" x2="4" y2="20"></line>
                    </svg>
                  </a>
                  <a href="https://instagram.com/travelbharat" target="_blank" rel="noopener noreferrer" aria-label="instagram" className="social-link" title="Follow on Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                      <circle cx="17.5" cy="6.5" r="1.5"></circle>
                    </svg>
                  </a>
                  <a href="https://youtube.com/travelbharat" target="_blank" rel="noopener noreferrer" aria-label="youtube" className="social-link" title="Subscribe on YouTube">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Decorative Footer Background */}
        <div className="footer_bg">
          <div className="footer_bg_one"></div>
          <div className="footer_bg_two"></div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer_bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <p className="mb-0 f_400" style={{ textAlign: "center" }}>
                © {year} TravelBharat. All rights reserved. | Explore India State by State
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
