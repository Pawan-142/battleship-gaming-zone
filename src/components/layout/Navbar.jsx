import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation as useRouterLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../../context/LocationContext';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Calendar, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';


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

  const isHomePage = routerLocation.pathname === '/';

  return (
    <div className="header-wrapper">
      {/* Sleek Floating Island Navigation */}
      <header className={`navbar-root ${scrolled ? 'scrolled' : ''} ${isHomePage ? 'home-navbar-override' : ''}`}>
        <div className="container nav-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" aria-label="Battleship Gaming Zone Home">
            <img 
              src="/images/bs_header_logo.png" 
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
              ATTRACTIONS
            </NavLink>
            <span className="nav-divider">|</span>
            <NavLink to="/story" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              3D STORY
            </NavLink>
            <span className="nav-divider">|</span>
            <NavLink to="/packages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              PASSES
            </NavLink>
            <span className="nav-divider">|</span>
            <NavLink to="/gallery" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              GALLERY
            </NavLink>
            <span className="nav-divider">|</span>
            <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              FACILITY
            </NavLink>
            <span className="nav-divider">|</span>
            <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              CONTACT
            </NavLink>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="nav-actions-group">
            {/* Theme Toggle Button with Smooth Icon Morph & Spin */}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isDark ? "Switch to Light Titanium Mode" : "Switch to Dark Obsidian Mode"}
              title={isDark ? "Switch to Light Titanium Mode" : "Switch to Dark Obsidian Mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark-sun' : 'light-moon'}
                  initial={{ y: -8, opacity: 0, rotate: -70, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ y: 8, opacity: 0, rotate: 70, scale: 0.5 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isDark ? (
                    <Sun size={17} className="theme-icon" />
                  ) : (
                    <Moon size={17} className="theme-icon" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Active Hold Countdown Badge */}
            {activeHold && (
              <Link to="/booking" className="active-hold-pill" title="You have slots held in inventory">
                <span className="hold-pulse-dot" />
                <span className="hold-txt">SLOTS HELD</span>
              </Link>
            )}

            {/* Book Now Primary Button with Glossy Capsule */}
            <Link to="/booking" className="forge-nav-cta battleship-nav-book-btn">
              <span>BOOK PASS →</span>
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
          top: 1.25rem;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.25rem;
          pointer-events: none;
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

        /* Ultra-Premium Glassmorphism Floating Rounded Header */
        .navbar-root {
          pointer-events: auto;
          height: 68px;
          width: 100%;
          max-width: 1360px;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(8, 12, 22, 0.68) 55%, rgba(4, 7, 14, 0.8) 100%);
          backdrop-filter: blur(32px) saturate(190%) contrast(105%);
          -webkit-backdrop-filter: blur(32px) saturate(190%) contrast(105%);
          border: 1.5px solid rgba(255, 255, 255, 0.16);
          border-top: 1.5px solid rgba(255, 255, 255, 0.32);
          box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme="light"] .navbar-root {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(248, 250, 252, 0.72) 100%);
          backdrop-filter: blur(32px) saturate(190%) contrast(105%);
          -webkit-backdrop-filter: blur(32px) saturate(190%) contrast(105%);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-bottom: 1.5px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 16px 36px -10px rgba(15, 23, 42, 0.1), inset 0 1.5px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(15, 23, 42, 0.04);
        }

        .navbar-root.scrolled {
          height: 62px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(6, 9, 16, 0.88) 100%);
          border-color: rgba(255, 255, 255, 0.22);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        [data-theme="light"] .navbar-root.scrolled {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.88) 100%);
          border-color: rgba(15, 23, 42, 0.14);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 0.75rem;
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
          border: 1.5px solid rgba(255, 255, 255, 0.28);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
          flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .brand-logo:hover .brand-logo-img {
          transform: scale(1.06);
          border-color: rgba(0, 240, 255, 0.6);
          box-shadow: 0 0 18px rgba(0, 240, 255, 0.4);
        }

        .logo-text-stack {
          display: flex;
          flex-direction: column;
        }

        .logo-brand-main {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.12rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #ffffff;
          line-height: 1;
        }

        [data-theme="light"] .logo-brand-main {
          color: #090d16;
        }

        .logo-brand-sub {
          font-family: 'Space Grotesk', monospace;
          font-size: 0.58rem;
          color: #94a3b8;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-top: 4px;
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

        .nav-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.72rem;
          font-weight: 300;
          user-select: none;
        }

        [data-theme="light"] .nav-divider {
          color: rgba(15, 23, 42, 0.18);
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

        /* Home page floating navbar overrides for Dark Mode */
        [data-theme="dark"] .home-navbar-override,
        [data-theme="dark"] header.navbar-root.home-navbar-override {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(8, 12, 22, 0.68) 55%, rgba(4, 7, 14, 0.8) 100%) !important;
          backdrop-filter: blur(32px) saturate(190%) contrast(105%) !important;
          -webkit-backdrop-filter: blur(32px) saturate(190%) contrast(105%) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.16) !important;
          border-top: 1.5px solid rgba(255, 255, 255, 0.32) !important;
          box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(0, 0, 0, 0.3) !important;
        }

        [data-theme="dark"] .home-navbar-override .nav-item {
          color: rgba(255, 255, 255, 0.75) !important;
        }

        [data-theme="dark"] .home-navbar-override .nav-item:hover,
        [data-theme="dark"] .home-navbar-override .nav-item.active {
          color: #ffffff !important;
        }

        [data-theme="dark"] .home-navbar-override .nav-item.active::after {
          background: #ffffff !important;
        }

        [data-theme="dark"] .home-navbar-override .nav-divider {
          color: rgba(255, 255, 255, 0.2) !important;
        }

        [data-theme="dark"] .home-navbar-override .logo-brand-main {
          color: #ffffff !important;
        }

        [data-theme="dark"] .home-navbar-override .logo-brand-sub {
          color: #94a3b8 !important;
        }

        [data-theme="dark"] .home-navbar-override .location-switcher-btn {
          background: rgba(255, 255, 255, 0.06) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          color: #ffffff !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
        }

        [data-theme="dark"] .home-navbar-override .loc-eyebrow,
        [data-theme="dark"] .home-navbar-override .icon-loc {
          color: #94a3b8 !important;
        }

        [data-theme="dark"] .home-navbar-override .loc-title,
        [data-theme="dark"] .home-navbar-override .loc-arrow {
          color: #ffffff !important;
        }

        [data-theme="dark"] .home-navbar-override .theme-toggle-btn {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
        }

        [data-theme="dark"] .home-navbar-override .theme-icon {
          color: #ffffff !important;
        }

        [data-theme="dark"] .home-navbar-override .battleship-nav-book-btn {
          background: linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%) !important;
          color: #07090d !important;
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25), inset 0 1px 0 #ffffff !important;
        }

        /* Home page floating navbar overrides for Light Mode */
        [data-theme="light"] .home-navbar-override,
        [data-theme="light"] header.navbar-root.home-navbar-override {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(248, 250, 252, 0.72) 100%) !important;
          backdrop-filter: blur(32px) saturate(190%) contrast(105%) !important;
          -webkit-backdrop-filter: blur(32px) saturate(190%) contrast(105%) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.85) !important;
          border-bottom: 1.5px solid rgba(15, 23, 42, 0.08) !important;
          box-shadow: 0 16px 36px -10px rgba(15, 23, 42, 0.1), inset 0 1.5px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(15, 23, 42, 0.04) !important;
        }

        [data-theme="light"] .home-navbar-override .nav-item {
          color: #475569 !important;
        }

        [data-theme="light"] .home-navbar-override .nav-item:hover,
        [data-theme="light"] .home-navbar-override .nav-item.active {
          color: #090d16 !important;
        }

        [data-theme="light"] .home-navbar-override .nav-item.active::after {
          background: #090d16 !important;
        }

        [data-theme="light"] .home-navbar-override .nav-divider {
          color: rgba(15, 23, 42, 0.18) !important;
        }

        [data-theme="light"] .home-navbar-override .logo-brand-main {
          color: #090d16 !important;
        }

        [data-theme="light"] .home-navbar-override .logo-brand-sub {
          color: #64748b !important;
        }

        [data-theme="light"] .home-navbar-override .location-switcher-btn {
          background: rgba(255, 255, 255, 0.65) !important;
          border: 1px solid rgba(15, 23, 42, 0.1) !important;
          color: #090d16 !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
        }

        [data-theme="light"] .home-navbar-override .loc-eyebrow,
        [data-theme="light"] .home-navbar-override .icon-loc {
          color: #64748b !important;
        }

        [data-theme="light"] .home-navbar-override .loc-title,
        [data-theme="light"] .home-navbar-override .loc-arrow {
          color: #090d16 !important;
        }

        [data-theme="light"] .home-navbar-override .theme-toggle-btn {
          background: rgba(255, 255, 255, 0.7) !important;
          border: 1px solid rgba(15, 23, 42, 0.12) !important;
          color: #090d16 !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
        }

        [data-theme="light"] .home-navbar-override .theme-icon {
          color: #090d16 !important;
        }

        [data-theme="light"] .home-navbar-override .battleship-nav-book-btn {
          background: linear-gradient(180deg, #1e293b 0%, #090d16 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 18px rgba(9, 13, 22, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
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
