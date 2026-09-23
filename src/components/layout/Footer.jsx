import { Link } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import { MapPin, Phone, ShieldCheck, ExternalLink, Award, QrCode } from 'lucide-react';

export const Footer = () => {
  const { branches } = useLocation();

  return (
    <footer className="forge-footer-root">
      {/* Top Value Banner */}
      <div className="forge-footer-banner">
        <div className="container forge-banner-grid">
          <div className="forge-banner-item">
            <ShieldCheck className="forge-b-icon" size={24} />
            <div>
              <h4>100% Safety Certified</h4>
              <p>Certified marshals, pneumatic harnesses, sanitized VR & laser gear.</p>
            </div>
          </div>
          <div className="forge-banner-item">
            <QrCode className="forge-b-icon" size={24} />
            <div>
              <h4>Instant Digital Pass QR</h4>
              <p>Reserve online with ₹100 deposit and scan directly at turnstiles.</p>
            </div>
          </div>
          <div className="forge-banner-item">
            <Award className="forge-b-icon" size={24} />
            <div>
              <h4>Transparent Cancellation</h4>
              <p>100% full refund available up to 24 hours prior to scheduled slot.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container forge-footer-main">
        <div className="forge-footer-grid">
          {/* Brand Info */}
          <div className="forge-f-col brand-col">
            <div className="forge-f-logo">
              <img 
                src="/images/battleship_logo.jpg" 
                alt="Battleship Gaming Zone Logo" 
                className="forge-f-logo-img" 
              />
              <div className="forge-f-logo-text">
                <span className="forge-logo-txt">BATTLESHIP</span>
                <span className="forge-logo-sub">GAMING ZONE • HYDERABAD</span>
              </div>
            </div>
            <p className="forge-brand-manifesto">
              Hyderabad’s premier entertainment & gaming arena for 360° electric drift, 2-tier laser missions, UV bowling, and hydraulic motion pods.
            </p>
            <div className="forge-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="forge-social-link">
                Instagram
              </a>
              <span className="forge-sep">/</span>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="forge-social-link">
                YouTube
              </a>
              <span className="forge-sep">/</span>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="forge-social-link">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="forge-f-col">
            <span className="forge-col-tag">01 // ATTRACTIONS</span>
            <ul className="forge-f-nav">
              <li><Link to="/games">All 6 Experiences</Link></li>
              <li><Link to="/games/bumper-cars">Electric Bumper Drift</Link></li>
              <li><Link to="/games/laser-blast">2-Tier Laser Blast</Link></li>
              <li><Link to="/games/hyper-bowling">UV Glow Bowling</Link></li>
              <li><Link to="/games/vr-pods">9D VR Motion Pods</Link></li>
              <li><Link to="/games/arcade-pass">Smart Cyber Arcade</Link></li>
            </ul>
          </div>

          {/* Party & Corporate */}
          <div className="forge-f-col">
            <span className="forge-col-tag">02 // COMMISSIONS</span>
            <ul className="forge-f-nav">
              <li><Link to="/packages">Value Combo Passes</Link></li>
              <li><Link to="/packages">VIP Birthday Party Suites</Link></li>
              <li><Link to="/contact">Corporate Offsites & Cups</Link></li>
              <li><Link to="/gallery">Arena Photography</Link></li>
              <li><Link to="/my-booking">Lookup Booking Ticket</Link></li>
              <li><Link to="/contact">Concierge & Desks</Link></li>
            </ul>
          </div>

          {/* Hyderabad Branches */}
          <div className="forge-f-col branch-col">
            <span className="forge-col-tag">03 // ARENA HUBS</span>
            <div className="forge-branches-stack">
              {branches.map(branch => (
                <div key={branch.id} className="forge-b-box">
                  <div className="forge-b-title">
                    <MapPin size={13} className="icon-cyan" />
                    <strong>{branch.name}</strong>
                  </div>
                  <p className="forge-b-addr">{branch.address}</p>
                  <div className="forge-b-links">
                    <a href={`tel:${branch.phone}`} className="forge-sub-link">
                      <Phone size={11} /> {branch.phone}
                    </a>
                    <a href={branch.googleMapsUrl} target="_blank" rel="noreferrer" className="forge-sub-link map">
                      Directions <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="forge-footer-bottom">
          <div className="forge-copy">
            © {new Date().getFullYear()} BATTLESHIP GAMING ZONE ARENA ENTERTAINMENT INDIA PVT. LTD. ALL RIGHTS RESERVED.
          </div>
          <div className="forge-legals">
            <Link to="/cancellation-policy">CANCELLATION POLICY</Link>
            <span className="dot">•</span>
            <Link to="/terms">TERMS OF SERVICE</Link>
            <span className="dot">•</span>
            <Link to="/privacy">PRIVACY POLICY</Link>
          </div>
        </div>
      </div>

      <style>{`
        .forge-footer-root {
          background: #05070a;
          border-top: 1px solid var(--border-subtle);
          margin-top: auto;
          position: relative;
          z-index: 10;
          color: var(--text-main);
        }

        .forge-footer-banner {
          border-bottom: 1px solid var(--border-subtle);
          padding: 2.25rem 0;
          background: rgba(255, 255, 255, 0.015);
        }

        .forge-banner-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .forge-banner-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .forge-b-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .forge-banner-item h4 {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #ffffff;
        }

        .forge-banner-item p {
          font-size: 0.8rem;
          line-height: 1.4;
          color: var(--text-secondary);
        }

        .forge-footer-main {
          padding-top: 4rem;
          padding-bottom: 2.5rem;
        }

        .forge-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1.1fr 1.1fr 1.6fr;
          gap: 3rem;
          margin-bottom: 3.5rem;
        }

        .forge-f-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .forge-f-logo-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #00f0ff;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
          flex-shrink: 0;
        }

        .forge-f-logo-text {
          display: flex;
          flex-direction: column;
        }

        .forge-logo-txt {
          font-family: var(--font-display);
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #ffffff;
          font-size: 1.1rem;
          line-height: 1.1;
        }

        .forge-logo-sub {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 2px;
        }

        .forge-brand-manifesto {
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          max-width: 320px;
        }

        .forge-socials {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }

        .forge-social-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forge-social-link:hover {
          color: var(--accent-cyan);
        }

        .forge-sep {
          color: var(--text-muted);
        }

        .forge-col-tag {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        .forge-f-nav {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .forge-f-nav a {
          font-size: 0.84rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .forge-f-nav a:hover {
          color: #ffffff;
          transform: translateX(3px);
        }

        .forge-branches-stack {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .forge-b-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.85rem 1rem;
        }

        .forge-b-title {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.25rem;
          color: #ffffff;
        }

        .forge-b-addr {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .forge-b-links {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }

        .forge-sub-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--accent-cyan);
          text-decoration: none;
        }

        .forge-sub-link:hover {
          text-decoration: underline;
        }

        .forge-footer-bottom {
          border-top: 1px solid var(--border-subtle);
          padding-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .forge-copy {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .forge-legals {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
        }

        .forge-legals a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forge-legals a:hover {
          color: #ffffff;
        }

        /* ==========================================================
           LIGHT MODE OVERRIDES FOR FOOTER
           ========================================================== */
        [data-theme="light"] .forge-footer-root {
          background: #ffffff;
          border-top: 1px solid rgba(15, 23, 42, 0.1);
          color: #0f172a;
        }

        [data-theme="light"] .forge-footer-banner {
          background: #f8fafc;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        [data-theme="light"] .forge-banner-item h4 {
          color: #0f172a;
        }

        [data-theme="light"] .forge-banner-item p {
          color: #475569;
        }

        [data-theme="light"] .forge-b-icon {
          color: #0f172a;
        }

        [data-theme="light"] .forge-logo-txt {
          color: #0f172a;
        }

        [data-theme="light"] .forge-logo-sub {
          color: #64748b;
        }

        [data-theme="light"] .forge-brand-manifesto {
          color: #475569;
        }

        [data-theme="light"] .forge-col-tag {
          color: #64748b;
        }

        [data-theme="light"] .forge-f-nav a {
          color: #475569;
        }

        [data-theme="light"] .forge-f-nav a:hover {
          color: #0f172a;
        }

        [data-theme="light"] .forge-b-box {
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.1);
        }

        [data-theme="light"] .forge-b-title {
          color: #0f172a;
        }

        [data-theme="light"] .forge-b-addr {
          color: #475569;
        }

        [data-theme="light"] .forge-sub-link {
          color: #0f172a;
        }

        [data-theme="light"] .forge-social-link {
          color: #475569;
        }

        [data-theme="light"] .forge-social-link:hover {
          color: #0f172a;
        }

        [data-theme="light"] .forge-footer-bottom {
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        [data-theme="light"] .forge-copy {
          color: #64748b;
        }

        [data-theme="light"] .forge-legals a {
          color: #64748b;
        }

        [data-theme="light"] .forge-legals a:hover {
          color: #0f172a;
        }

        @media (max-width: 1024px) {
          .forge-banner-grid {
            grid-template-columns: 1fr;
          }
          .forge-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .forge-footer-grid {
            grid-template-columns: 1fr;
          }
          .forge-footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};
