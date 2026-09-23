import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../../context/LocationContext';
import { X, MapPin, Check, Clock, Phone, Sparkles, Compass } from 'lucide-react';

export const LocationModal = () => {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    selectedBranchId, 
    selectBranch,
    locationsHierarchy 
  } = useLocation();

  if (!isLocationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="location-modal-backdrop" onClick={() => setIsLocationModalOpen(false)}>
        <motion.div 
          className="location-modal-card" 
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          {/* Modal Header */}
          <div className="loc-modal-header">
            <div className="loc-modal-title-wrap">
              <span className="loc-modal-eyebrow">
                <Compass size={13} className="eyebrow-icon" />
                ARENA SELECTOR
              </span>
              <h3 className="loc-modal-heading">Select Your Physical Battleground</h3>
              <p className="loc-modal-sub">
                Choose your preferred arena in Hyderabad for real-time station availability, live queue tracking, and instant slot reservations.
              </p>
            </div>
            <button 
              type="button"
              className="loc-modal-close-btn" 
              onClick={() => setIsLocationModalOpen(false)}
              aria-label="Close location selector"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scroll Body */}
          <div className="loc-modal-body">
            {locationsHierarchy.map(country => (
              <div key={country.countryCode} className="loc-country-section">
                {country.states.map(state => (
                  <div key={state.stateCode} className="loc-state-section">
                    {state.cities.map(city => (
                      <div key={city.citySlug} className="loc-city-block">
                        <div className="loc-city-header">
                          <div className="loc-city-pill">
                            <MapPin size={14} className="loc-city-icon" />
                            <span className="loc-city-title">{city.cityName.toUpperCase()}</span>
                            <span className="loc-state-tag">{state.stateName}</span>
                          </div>
                          {city.isActive && (
                            <span className="loc-live-badge">
                              <span className="live-pulse-dot" />
                              2 ARENAS LIVE
                            </span>
                          )}
                          {city.comingSoon && (
                            <span className="badge badge-amber">LAUNCHING {city.launchDate}</span>
                          )}
                        </div>

                        {/* Active Arena Cards Grid */}
                        {city.isActive && city.branches && (
                          <div className="loc-branches-grid">
                            {city.branches.map(branch => {
                              const isSelected = branch.id === selectedBranchId;
                              return (
                                <div
                                  key={branch.id}
                                  className={`loc-branch-card ${isSelected ? 'is-selected' : ''}`}
                                  onClick={() => {
                                    selectBranch(branch.id);
                                    setIsLocationModalOpen(false);
                                  }}
                                >
                                  {/* Media Image Header */}
                                  <div className="loc-card-media-wrap">
                                    <img src={branch.image} alt={branch.name} className="loc-card-img" />
                                    <div className="loc-card-media-overlay" />
                                    <span className="loc-card-badge">{branch.badge}</span>
                                    {isSelected && (
                                      <div className="loc-active-pill">
                                        <Check size={12} />
                                        <span>ACTIVE ARENA</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Info Body */}
                                  <div className="loc-card-content">
                                    <div className="loc-card-header-row">
                                      <h4 className="loc-branch-name">{branch.name}</h4>
                                    </div>
                                    <p className="loc-branch-address">{branch.address}</p>

                                    <div className="loc-specs-list">
                                      <div className="loc-spec-item">
                                        <Clock size={13} className="loc-spec-icon" />
                                        <span>{branch.openingHours}</span>
                                      </div>
                                      <div className="loc-spec-item">
                                        <Phone size={13} className="loc-spec-icon" />
                                        <span>{branch.phone}</span>
                                      </div>
                                    </div>

                                    {/* Feature Chips */}
                                    <div className="loc-chips-row">
                                      {branch.facilities.slice(0, 4).map((f, i) => (
                                        <span key={i} className="loc-chip">✓ {f.name}</span>
                                      ))}
                                    </div>

                                    <button 
                                      type="button" 
                                      className={`btn btn-block loc-select-btn ${isSelected ? 'btn-cyber btn-cyber-primary' : 'btn-cyber btn-cyber-outline'}`}
                                    >
                                      {isSelected ? 'CURRENTLY SELECTED ARENA' : 'SWITCH TO THIS ARENA'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Coming Soon Expansion Teaser */}
                        {city.comingSoon && (
                          <div className="loc-expansion-box">
                            <Sparkles size={20} className="expansion-icon" />
                            <div>
                              <h5 className="expansion-title">Expansion Under Construction: {city.cityName}</h5>
                              <p className="expansion-desc">
                                We are engineering high-voltage physical arenas in {city.cityName} with multi-tier laser tags and drift karts.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        <style>{`
          .location-modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(3, 5, 8, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1.5rem;
          }

          .location-modal-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-strong);
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 860px;
            max-height: 88vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
          }

          [data-theme="light"] .location-modal-card {
            background: #ffffff;
            border-color: rgba(15, 23, 42, 0.12);
            box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.15);
          }

          /* Header */
          .loc-modal-header {
            padding: 1.75rem 2rem 1.25rem;
            border-bottom: 1px solid var(--border-subtle);
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1.5rem;
            background: var(--bg-card);
          }

          [data-theme="light"] .loc-modal-header {
            background: #f8fafc;
            border-bottom-color: rgba(15, 23, 42, 0.08);
          }

          .loc-modal-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: var(--font-mono);
            font-size: 0.68rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            color: var(--cyan-primary);
            text-transform: uppercase;
            margin-bottom: 0.35rem;
          }

          .loc-modal-heading {
            margin: 0;
            font-size: 1.35rem;
            font-weight: 600;
            color: var(--text-pure);
            letter-spacing: -0.01em;
          }

          .loc-modal-sub {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 0.35rem;
            line-height: 1.45;
          }

          .loc-modal-close-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--border-subtle);
            color: var(--text-primary);
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.2s ease;
          }

          [data-theme="light"] .loc-modal-close-btn {
            background: #ffffff;
            border-color: rgba(15, 23, 42, 0.15);
            color: #0f172a;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          }

          .loc-modal-close-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: scale(1.05);
          }

          [data-theme="light"] .loc-modal-close-btn:hover {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
          }

          /* Body */
          .loc-modal-body {
            padding: 1.75rem 2rem;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: var(--border-subtle) transparent;
          }

          .loc-modal-body::-webkit-scrollbar {
            width: 6px;
          }

          .loc-modal-body::-webkit-scrollbar-thumb {
            background: var(--border-subtle);
            border-radius: 9999px;
          }

          .loc-city-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--border-subtle);
          }

          .loc-city-pill {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .loc-city-icon {
            color: var(--cyan-primary);
          }

          .loc-city-title {
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--text-pure);
            letter-spacing: 0.04em;
          }

          .loc-state-tag {
            font-family: var(--font-mono);
            font-size: 0.72rem;
            background: rgba(255, 255, 255, 0.06);
            padding: 0.2rem 0.55rem;
            border-radius: var(--radius-pill);
            color: var(--text-muted);
          }

          [data-theme="light"] .loc-state-tag {
            background: #f1f5f9;
            color: #475569;
          }

          .loc-live-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: var(--font-mono);
            font-size: 0.72rem;
            font-weight: 600;
            color: #10b981;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.25);
            padding: 0.25rem 0.65rem;
            border-radius: var(--radius-pill);
          }

          .live-pulse-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #10b981;
            box-shadow: 0 0 8px #10b981;
            animation: pulse-ring 1.8s infinite;
          }

          /* Branches Grid */
          .loc-branches-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .loc-branch-card {
            background: var(--bg-card);
            border: 1.5px solid var(--border-subtle);
            border-radius: var(--radius-md);
            overflow: hidden;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          [data-theme="light"] .loc-branch-card {
            background: #ffffff;
            border-color: rgba(15, 23, 42, 0.1);
            box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          }

          .loc-branch-card:hover {
            transform: translateY(-3px);
            border-color: var(--cyan-primary);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
          }

          [data-theme="light"] .loc-branch-card:hover {
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
          }

          .loc-branch-card.is-selected {
            border-color: var(--cyan-primary);
            box-shadow: 0 0 0 1.5px var(--cyan-primary), 0 12px 32px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.02);
          }

          [data-theme="light"] .loc-branch-card.is-selected {
            border-color: #0088cc;
            box-shadow: 0 0 0 1.5px #0088cc, 0 12px 32px rgba(0, 136, 204, 0.1);
            background: #f0f9ff;
          }

          /* Card Media */
          .loc-card-media-wrap {
            position: relative;
            height: 140px;
            overflow: hidden;
          }

          .loc-card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }

          .loc-branch-card:hover .loc-card-img {
            transform: scale(1.05);
          }

          .loc-card-media-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%);
          }

          .loc-card-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            font-family: var(--font-mono);
            font-size: 0.65rem;
            font-weight: 600;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 0.25rem 0.6rem;
            border-radius: var(--radius-pill);
            z-index: 2;
          }

          .loc-active-pill {
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-family: var(--font-mono);
            font-size: 0.68rem;
            font-weight: 700;
            background: #00f0ff;
            color: #040810;
            padding: 0.25rem 0.65rem;
            border-radius: var(--radius-pill);
            display: flex;
            align-items: center;
            gap: 4px;
            z-index: 2;
            box-shadow: 0 2px 10px rgba(0, 240, 255, 0.4);
          }

          [data-theme="light"] .loc-active-pill {
            background: #0088cc;
            color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 136, 204, 0.3);
          }

          /* Card Content */
          .loc-card-content {
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            flex: 1;
            justify-content: space-between;
          }

          .loc-branch-name {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--text-pure);
          }

          .loc-branch-address {
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.45;
            margin: 0;
          }

          .loc-specs-list {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            font-size: 0.78rem;
            color: var(--text-muted);
          }

          .loc-spec-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .loc-spec-icon {
            color: var(--cyan-primary);
          }

          .loc-chips-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.35rem;
            margin: 0.25rem 0;
          }

          .loc-chip {
            font-size: 0.7rem;
            background: var(--bg-surface-2);
            color: var(--text-secondary);
            padding: 0.2rem 0.5rem;
            border-radius: var(--radius-xs);
            border: 1px solid var(--border-subtle);
          }

          [data-theme="light"] .loc-chip {
            background: #f1f5f9;
            border-color: rgba(15, 23, 42, 0.08);
            color: #334155;
          }

          .loc-select-btn {
            margin-top: 0.5rem;
            padding: 0.65rem 1rem;
            font-size: 0.8rem;
          }

          /* Expansion Box */
          .loc-expansion-box {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: var(--bg-card);
            border: 1px dashed var(--border-amber);
            padding: 1.15rem 1.4rem;
            border-radius: var(--radius-md);
            margin-top: 1rem;
          }

          [data-theme="light"] .loc-expansion-box {
            background: #fffbeb;
            border-color: #d97706;
          }

          .expansion-icon {
            color: var(--amber-primary);
            flex-shrink: 0;
          }

          .expansion-title {
            margin: 0 0 0.2rem;
            font-size: 0.95rem;
            color: var(--amber-primary);
            font-weight: 600;
          }

          .expansion-desc {
            margin: 0;
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.45;
          }

          @media (max-width: 680px) {
            .loc-branches-grid {
              grid-template-columns: 1fr;
            }
            .loc-modal-header, .loc-modal-body {
              padding: 1.25rem;
            }
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
};
