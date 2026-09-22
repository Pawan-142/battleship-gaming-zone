import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation as useRouterLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../../context/LocationContext';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  MapPin, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown, 
  Zap,
  Activity,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { BorderTrail } from '../motion';

export const Navbar = () => {
  const { currentBranch, setIsLocationModalOpen } = useLocation();
  const { activeHold } = useBooking();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerLocation = useRouterLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [routerLocation.pathname]);

  return (
    <div className="header-wrapper">
      {/* Top Ambient Live Ticker */}
      <div className="live-broadcast-ticker">
        <div className="ticker-track">
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span><strong>ARENA LIVE:</strong> {currentBranch.name.toUpperCase()} • OPEN TODAY UNTIL 11:30 PM</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span><strong>ELECTRIC BUMPER DRIFT:</strong> 8 PODS ACTIVE</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span><strong>2-TIER LASER BLAST:</strong> SQUAD MISSIONS EVERY 15 MINS</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span><strong>UV GLOW BOWLING:</strong> LANES ONLINE</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span><strong>ADVANCE PASS:</strong> ₹100 LOCKS REAL-TIME INVENTORY</span>
          </div>
          {/* Loop duplicates */}
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span><strong>ARENA LIVE:</strong> {currentBranch.name.toUpperCase()} • OPEN TODAY UNTIL 11:30 PM</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-dot" />
            <span><strong>ELECTRIC BUMPER DRIFT:</strong> 8 PODS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Sleek Floating Island Navigation */}
      <header className={`navbar-root ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" aria-label="Battleship Gaming Zone Home">
            <img 
              src="/images/battleship_logo.jpg" 
              alt="Battleship Gaming Zone Logo" 
              className="brand-logo-img" 
            />
            <div className="logo-text-stack">
              <span className="logo-brand-main">BATTLESHIP</span>
              <span className="logo-brand-sub">GAMING ZONE • HYDERABAD</span>
            </div>
          </Link>

          {/* Location Switcher Pill */}
          <button
            type="button"
            className="location-switcher-btn"
            onClick={() => setIsLocationModalOpen(true)}
            title="Switch Hyderabad Branch"
          >
            <MapPin size={14} className="icon-loc" />
            <div className="loc-text-col">
              <span className="loc-eyebrow">ARENA LOCATION</span>
              <span className="loc-title">{currentBranch.shortName}</span>
            </div>
            <ChevronDown size={13} className="loc-arrow" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav-menu" aria-label="Main Navigation">
            <NavLink to="/games" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              • ATTRACTIONS
            </NavLink>
            <NavLink to="/story" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ color: '#00f0ff' }}>
              • 3D STORY
            </NavLink>
            <NavLink to="/packages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              • COMBO PASSES
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              • GALLERY
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              • FACILITY
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              • CONCIERGE
            </NavLink>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="nav-actions-group">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isDark ? "Switch to Light Titanium Mode" : "Switch to Dark Obsidian Mode"}
              title={isDark ? "Switch to Light Titanium Mode" : "Switch to Dark Obsidian Mode"}
            >
              {isDark ? (
                <Sun size={17} className="theme-icon" />
              ) : (
                <Moon size={17} className="theme-icon" />
              )}
            </button>

            {/* Active Hold Countdown Badge */}
            {activeHold && (
              <Link to="/booking" className="active-hold-pill" title="You have slots held in inventory">
                <span className="hold-pulse-dot" />
                <span className="hold-txt">SLOTS HELD</span>
              </Link>
            )}

            {/* Book Now Primary Button */}
            <Link to="/booking" className="forge-nav-cta">
              <BorderTrail size={40} duration={3} />
              <span>BOOK PASS ↗</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="mobile-nav-drawer"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <div className="mobile-branch-row" onClick={() => { setIsLocationModalOpen(true); setIsMobileMenuOpen(false); }}>
                <div className="mob-branch-info">
                  <MapPin size={16} className="icon-cyan" />
                  <div>
                    <span className="mob-b-lbl">ACTIVE ARENA:</span>
                    <strong className="mob-b-val">{currentBranch.name}</strong>
                  </div>
                </div>
                <span className="btn btn-glass btn-xs">CHANGE</span>
              </div>

              <motion.div 
                className="mobile-links-list"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.06 }
                  }
                }}
              >
                {[
                  { to: "/", label: "ARENA HOME" },
                  { to: "/story", label: "⚡ 3D SCROLLYTELLING STORY" },
                  { to: "/games", label: "ALL 6 ATTRACTIONS" },
                  { to: "/packages", label: "COMBO PASSES" },
                  { to: "/gallery", label: "ARENA GALLERY" },
                  { to: "/about", label: "ARENA SPECS & SAFETY" },
                  { to: "/contact", label: "HOURS & LOCATION" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -15 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <NavLink to={item.to} end={item.to === "/"} className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <span>{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>

              <div className="mobile-cta-box">
                <Link 
                  to="/booking" 
                  className="btn btn-cyber btn-cyber-primary btn-block btn-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar size={18} />
                  <span>BOOK ATTRACTIONS (FROM ₹100)</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        .header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          width: 100%;
        }

        .live-broadcast-ticker {
          height: 32px;
          background: rgba(4, 6, 10, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #94a3b8;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          overflow: hidden;
          white-space: nowrap;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1001;
        }

        [data-theme="light"] .live-broadcast-ticker {
          background: rgba(241, 245, 249, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #475569;
          border-bottom-color: rgba(15, 23, 42, 0.08);
        }

        .ticker-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: tickerScroll 35s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-right: 3.5rem;
        }

        .ticker-item strong {
          color: #ffffff;
          font-weight: 500;
        }

        [data-theme="light"] .ticker-item strong {
          color: #090d16;
        }

        .ticker-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #64748b;
        }

        /* Glassmorphism Header */
        .navbar-root {
          height: 70px;
          background: rgba(8, 12, 20, 0.68);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        [data-theme="light"] .navbar-root {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        .navbar-root.scrolled {
          background: rgba(6, 9, 16, 0.84);
          border-bottom-color: rgba(255, 255, 255, 0.14);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        [data-theme="light"] .navbar-root.scrolled {
          background: rgba(255, 255, 255, 0.88);
          border-bottom-color: rgba(15, 23, 42, 0.12);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-logo-img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #00f0ff;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
          flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .brand-logo:hover .brand-logo-img {
          transform: scale(1.08);
          box-shadow: 0 0 22px rgba(0, 240, 255, 0.7);
        }

        .logo-text-stack {
          display: flex;
          flex-direction: column;
        }

        .logo-brand-main {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: #ffffff;
          line-height: 1;
        }

        [data-theme="light"] .logo-brand-main {
          color: #090d16;
        }

        .logo-brand-sub {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          color: var(--text-muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .location-switcher-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-pill);
          cursor: pointer;
          color: #ffffff;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
          outline: none;
        }

        [data-theme="light"] .location-switcher-btn {
          background: rgba(15, 23, 42, 0.04);
          border-color: rgba(15, 23, 42, 0.1);
          color: #090d16;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .location-switcher-btn:hover {
          border-color: rgba(0, 240, 255, 0.4);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.2);
        }

        [data-theme="light"] .location-switcher-btn:hover {
          border-color: rgba(15, 23, 42, 0.25);
          background: rgba(15, 23, 42, 0.08);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .icon-loc {
          color: var(--text-muted);
        }

        .loc-text-col {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .loc-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.52rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1;
        }

        .loc-title {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 500;
          color: #ffffff;
          line-height: 1.1;
          margin-top: 2px;
        }

        [data-theme="light"] .loc-title {
          color: #090d16;
        }

        .desktop-nav-menu {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }

        .nav-item {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          letter-spacing: 0.08em;
          transition: color 0.15s ease;
          position: relative;
          padding: 0.4rem 0;
        }

        .nav-item:hover, .nav-item.active {
          color: #ffffff;
        }

        [data-theme="light"] .nav-item {
          color: #64748b;
        }

        [data-theme="light"] .nav-item:hover,
        [data-theme="light"] .nav-item.active {
          color: #090d16;
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #ffffff;
        }

        [data-theme="light"] .nav-item.active::after {
          background: #090d16;
        }

        .nav-actions-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .forge-nav-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.25rem;
          background: #ffffff;
          color: #07090d !important;
          border-radius: var(--radius-pill);
          font-family: var(--font-display);
          font-size: 0.76rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-decoration: none;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.08);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .forge-nav-cta:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        [data-theme="light"] .forge-nav-cta {
          background: #090d16;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(9, 13, 22, 0.15);
        }

        .theme-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        [data-theme="light"] .theme-toggle-btn {
          background: #f1f5f9;
          border-color: rgba(15, 23, 42, 0.12);
        }

        .theme-toggle-btn:hover {
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(15deg);
        }

        [data-theme="light"] .theme-toggle-btn:hover {
          border-color: #090d16;
          background: #e2e8f0;
        }

        .theme-icon {
          display: block;
          color: #ffffff;
        }

        [data-theme="light"] .theme-icon {
          color: #090d16;
        }

        .btn-nav-cta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          font-size: 0.82rem;
          white-space: nowrap;
        }

        .active-hold-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #ffffff;
          text-decoration: none;
        }

        .mobile-hamburger-btn {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-xs);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        [data-theme="light"] .mobile-hamburger-btn {
          background: #f1f5f9;
          border-color: rgba(15, 23, 42, 0.1);
          color: #090d16;
        }

        @media (max-width: 1080px) {
          .desktop-nav-menu, .location-switcher-btn {
            display: none;
          }
          .mobile-hamburger-btn {
            display: flex;
          }
        }

        .mobile-nav-drawer {
          position: absolute;
          top: 74px;
          left: 0;
          right: 0;
          background: rgba(8, 11, 17, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }

        [data-theme="light"] .mobile-nav-drawer {
          background: rgba(255, 255, 255, 0.98);
          border-bottom-color: rgba(15, 23, 42, 0.12);
        }

        .mobile-branch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          cursor: pointer;
        }

        [data-theme="light"] .mobile-branch-row {
          background: #f8fafc;
          border-color: rgba(15, 23, 42, 0.1);
        }

        .mob-branch-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mob-b-lbl {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .mob-b-val {
          font-size: 0.88rem;
          color: var(--text-pure);
        }

        [data-theme="light"] .mob-b-val {
          color: #090d16;
        }

        .mobile-links-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-link {
          padding: 0.75rem 1rem;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-secondary);
          border-radius: var(--radius-xs);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        [data-theme="light"] .mobile-nav-link {
          color: #334155;
        }

        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: var(--cyan-dim);
          color: var(--cyan-primary);
        }
      `}</style>
    </div>
  );
};
