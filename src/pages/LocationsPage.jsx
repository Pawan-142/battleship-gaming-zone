import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { MapPin, Clock, Phone, ArrowUpRight, Car, CheckCircle2 } from 'lucide-react';
import { TextEffect } from '../components/motion/TextEffect';


export const LocationsPage = () => {
  const { locationsHierarchy, selectBranch, currentBranch } = useLocation();

  return (
    <div className="forge-locations-root">
      {/* Editorial Luxury Header */}
      <section className="forge-header-section">
        <div className="container">
          <div className="forge-breadcrumbs">
            <Link to="/">BATTLESHIP</Link>
            <span className="sep">/</span>
            <span className="current">ARENA STUDIOS & HUBS</span>
          </div>

          <div className="forge-pill-tag">
            <span className="pulse-dot"></span>
            <span>06 // GEOGRAPHIC COORDINATES</span>
          </div>

          <h1 className="forge-page-title">
            <TextEffect per="word" preset="fade-in-blur">
              Hyderabad Arena Studios.
            </TextEffect>
          </h1>

          <p className="forge-page-desc">
            Two premier commercial entertainment hubs in Hitech City and Gachibowli with dedicated valet parking, executive food lounges, and full attraction line-ups.
          </p>
        </div>
      </section>

      {/* Locations Studio Matrix */}
      <section className="forge-locations-section">
        <div className="container">
          {locationsHierarchy.map((country) => (
            <div key={country.countryCode} className="country-group">
              {country.states.map((state) => (
                <div key={state.stateCode} className="state-group">
                  {state.cities.map((city) => (
                    <div key={city.citySlug} className="city-block">
                      <div className="city-header-bar">
                        <div className="city-title-tag">
                          <MapPin size={18} className="icon-cyan" />
                          <h2>{city.cityName}, {state.stateName}</h2>
                        </div>
                        {city.isActive ? (
                          <span className="status-badge live">
                            <span className="dot-green" /> LIVE ARENAS OPERATIONAL
                          </span>
                        ) : (
                          <span className="status-badge upcoming">
                            UPCOMING EXPANSION ({city.launchDate})
                          </span>
                        )}
                      </div>

                      {city.isActive && city.branches && (
                        <div className="branches-atelier-grid">
                          {city.branches.map((branch, idx) => {
                            const isCurrent = branch.id === currentBranch.id;
                            return (
                              <div key={branch.id} className={`forge-studio-card ${isCurrent ? 'selected' : ''}`}>
                                <div className="studio-image-wrap">
                                  <img src={branch.image} alt={branch.name} className="studio-img" />
                                  <div className="studio-img-vignette" />
                                  
                                  <div className="studio-top-pills">
                                    <span className="mono-idx">ARENA 0{idx + 1} // {branch.badge.toUpperCase()}</span>
                                    {isCurrent && (
                                      <span className="active-selected-chip">
                                        <CheckCircle2 size={12} /> ACTIVE HUB
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="studio-body">
                                  <h3 className="studio-title">{branch.name}</h3>
                                  <p className="studio-address">
                                    <MapPin size={14} className="icon-cyan flex-shrink-0" />
                                    <span>{branch.address}</span>
                                  </p>
                                  <span className="studio-landmark">Landmark: {branch.landmark}</span>

                                  <div className="studio-specs-list">
                                    <div className="s-row">
                                      <Clock size={13} className="spec-icon" />
                                      <span>{branch.openingHours}</span>
                                    </div>
                                    <div className="s-row">
                                      <Phone size={13} className="spec-icon" />
                                      <span>{branch.phone}</span>
                                    </div>
                                    <div className="s-row">
                                      <Car size={13} className="spec-icon" />
                                      <span>Complimentary Valet & Covered Parking</span>
                                    </div>
                                  </div>

                                  <div className="studio-amenities-row">
                                    {branch.facilities.map((fac, fIdx) => (
                                      <span key={fIdx} className="amenity-chip">✓ {fac.name}</span>
                                    ))}
                                  </div>

                                  <div className="studio-actions-grid">
                                    <a 
                                      href={branch.googleMapsUrl} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="forge-ghost-btn"
                                    >
                                      <span>DIRECTIONS</span>
                                      <ArrowUpRight size={14} />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => selectBranch(branch.id)}
                                      className={`forge-select-btn ${isCurrent ? 'active' : ''}`}
                                    >
                                      {isCurrent ? 'CURRENTLY SELECTED' : 'SET AS ACTIVE ARENA'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .forge-locations-root {
          min-height: 100vh;
          padding-top: var(--header-offset, 110px);
          color: var(--text-main);
        }

        .forge-header-section {
          padding: 3rem 0 2.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .forge-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }

        .forge-breadcrumbs a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forge-breadcrumbs a:hover {
          color: var(--text-main);
        }

        .forge-breadcrumbs .current {
          color: var(--accent-cyan);
        }

        .forge-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          letter-spacing: 0.05em;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan);
        }

        .forge-page-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text-main);
          max-width: 900px;
          margin-bottom: 1.25rem;
        }

        .forge-page-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 720px;
        }

        .forge-locations-section {
          padding: 3.5rem 0 6rem;
        }

        .city-block {
          margin-bottom: 4rem;
        }

        .city-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 2rem;
        }

        .city-title-tag {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .city-title-tag h2 {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
        }

        .status-badge.live {
          color: #34d399;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.25);
        }

        .dot-green {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
        }

        .branches-atelier-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem;
        }

        .forge-studio-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .forge-studio-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
        }

        .forge-studio-card.selected {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
        }

        .studio-image-wrap {
          position: relative;
          height: 240px;
        }

        .studio-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .studio-img-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 9, 13, 0.2) 0%, rgba(7, 9, 13, 0.85) 100%);
        }

        .studio-top-pills {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mono-idx {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: #ffffff;
          padding: 0.35rem 0.65rem;
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }

        .active-selected-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: #07090d;
          background: var(--accent-cyan);
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
        }

        .studio-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .studio-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .studio-address {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-secondary);
          margin-bottom: 0.4rem;
        }

        .studio-landmark {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          display: block;
        }

        .studio-specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 1.25rem;
        }

        .s-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .spec-icon {
          color: var(--accent-cyan);
        }

        .studio-amenities-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
        }

        .amenity-chip {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
        }

        .studio-actions-grid {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 0.75rem;
          margin-top: auto;
        }

        .forge-ghost-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-main);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .forge-ghost-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .forge-select-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1rem;
          background: var(--text-main);
          color: var(--bg-deep) !important;
          border-radius: 6px;
          border: none;
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .forge-select-btn:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .forge-select-btn.active {
          background: rgba(0, 240, 255, 0.15);
          color: var(--accent-cyan) !important;
          border: 1px solid var(--accent-cyan);
        }

        /* ==========================================================
           LIGHT MODE OVERRIDES FOR LOCATIONS & STUDIOS
           ========================================================== */
        [data-theme="light"] .forge-locations-root {
          background: #f8fafc;
          color: #0f172a;
        }

        [data-theme="light"] .forge-studio-card {
          background: #ffffff !important;
          border: 1px solid rgba(15, 23, 42, 0.12) !important;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.07), 0 0 1px 1px rgba(15, 23, 42, 0.05) !important;
        }

        [data-theme="light"] .forge-studio-card:hover {
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12) !important;
          border-color: rgba(15, 23, 42, 0.25) !important;
        }

        [data-theme="light"] .studio-title {
          color: #0f172a !important;
        }

        [data-theme="light"] .studio-address {
          color: #475569;
        }

        [data-theme="light"] .studio-landmark {
          color: #64748b;
        }

        [data-theme="light"] .s-row {
          color: #334155;
        }

        [data-theme="light"] .spec-icon {
          color: #0f172a;
        }

        [data-theme="light"] .amenity-chip {
          background: #f1f5f9;
          border: 1px solid rgba(15, 23, 42, 0.1);
          color: #475569;
        }

        [data-theme="light"] .forge-ghost-btn {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.18);
          color: #0f172a;
        }

        [data-theme="light"] .forge-ghost-btn:hover {
          background: #f1f5f9;
          border-color: #0f172a;
        }

        [data-theme="light"] .forge-select-btn {
          background: #0f172a !important;
          color: #ffffff !important;
        }

        [data-theme="light"] .forge-select-btn:hover {
          background: #1e293b !important;
        }

        [data-theme="light"] .status-badge.live {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        [data-theme="light"] .dot-green {
          background: #10b981;
        }

        @media (max-width: 1024px) {
          .branches-atelier-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
