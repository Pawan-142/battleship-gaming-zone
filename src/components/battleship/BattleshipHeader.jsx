import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import './Battleship.css';

export const BattleshipHeader = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let prev = false;
    const handleScroll = () => {
      const next = window.scrollY > 40;
      if (next !== prev) {
        prev = next;
        setIsScrolled(next);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`bs-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="bs-header-inner">
        {/* Left: Official Emblem & Wordmark */}
        <div className="bs-logo-container">
          <Link to="/" className="bs-logo-text" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/images/battleship/battleship_logo.jpg" 
              alt="Battleship Gaming Zone" 
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '50%', 
                objectFit: 'cover', 
                border: '1.5px solid #00f0ff',
                boxShadow: '0 0 14px rgba(0, 240, 255, 0.45)'
              }}
            />
            <div>
              <div className="bs-logo-main" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ letterSpacing: '0.08em', fontWeight: 800 }}>BATTLESHIP</span>
              </div>
              <span className="bs-logo-sub" style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em' }}>
                GAMING ZONE &bull; HYDERABAD
              </span>
            </div>
          </Link>

          <div className="bs-live-badge">
            <span className="bs-live-dot"></span>
            <span>17.4483° N, 78.3915° E</span>
          </div>
        </div>

        {/* Center: Minimal Navigation */}
        <nav className="bs-nav">
          <button onClick={() => scrollToSection('cinematic-hero')} className="bs-nav-link active">
            <span className="bs-nav-dot"></span>
            Bumper Cars
          </button>
          <button onClick={() => scrollToSection('experiences')} className="bs-nav-link">
            Experience
          </button>
          <button onClick={() => scrollToSection('specs')} className="bs-nav-link">
            Architecture
          </button>
          <button onClick={() => scrollToSection('gallery')} className="bs-nav-link">
            Atmosphere
          </button>
          <button onClick={() => scrollToSection('booking')} className="bs-nav-link">
            Reserve
          </button>
          <button onClick={() => scrollToSection('location')} className="bs-nav-link">
            Location
          </button>
        </nav>

        {/* Right: Forge Style Minimal Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              if (onBookClick) onBookClick();
              else scrollToSection('booking');
            }}
            className="bs-btn-forge"
          >
            <span>Reserve Track</span>
            <ArrowUpRight size={13} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bs-mobile-trigger"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="bs-mobile-menu">
          <button onClick={() => scrollToSection('cinematic-hero')}>Bumper Cars Experience</button>
          <button onClick={() => scrollToSection('experiences')}>01 Ride &bull; 02 Bump &bull; 03 Repeat</button>
          <button onClick={() => scrollToSection('specs')}>Arena Specifications</button>
          <button onClick={() => scrollToSection('gallery')}>Atmosphere & Gallery</button>
          <button onClick={() => scrollToSection('booking')}>Reserve Track Session</button>
          <button onClick={() => scrollToSection('location')}>Jubilee Hills, Hyderabad</button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToSection('booking');
            }}
            className="bs-btn-forge-crimson"
            style={{ width: '100%', marginTop: '12px' }}
          >
            <span>Book Your Session</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      )}
    </header>
  );
};
