import React from 'react';
import { useLocation } from '../../context/LocationContext';
import { 
  X, 
  MapPin, 
  Check, 
  Clock, 
  Phone, 
  Sparkles,
  Navigation,
  Car,
  Zap,
  Lock,
  Coffee
} from 'lucide-react';

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
    <div className="modal-backdrop" onClick={() => setIsLocationModalOpen(false)}>
      <div className="modal-container location-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="section-tag">ARENA LOCATIONS</span>
            <h3>Select Your Gaming Arena</h3>
            <p className="modal-sub">Choose your preferred branch in Hyderabad to check real-time lane and pod availability.</p>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setIsLocationModalOpen(false)}
            aria-label="Close location selector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scalable Country / State / City Section */}
        <div className="modal-body">
          {locationsHierarchy.map(country => (
            <div key={country.countryCode} className="country-block">
              {country.states.map(state => (
                <div key={state.stateCode} className="state-block">
                  {state.cities.map(city => (
                    <div key={city.citySlug} className="city-section">
                      <div className="city-heading-row">
                        <div className="city-tag">
                          <MapPin size={16} className="icon-cyan" />
                          <span className="city-name">{city.cityName}</span>
                          <span className="state-pill">{state.stateName}</span>
                        </div>
                        {city.isActive && (
                          <span className="badge badge-cyan badge-live">Live Booking Active</span>
                        )}
                        {city.comingSoon && (
                          <span className="badge badge-amber">Launching {city.launchDate}</span>
                        )}
                      </div>

                      {/* Active Branches Grid */}
                      {city.isActive && city.branches && (
                        <div className="branches-grid">
                          {city.branches.map(branch => {
                            const isSelected = branch.id === selectedBranchId;
                            return (
                              <div
                                key={branch.id}
                                className={`branch-card-select ${isSelected ? 'selected' : ''}`}
                                onClick={() => selectBranch(branch.id)}
                              >
                                <div className="branch-card-image" style={{ backgroundImage: `url(${branch.image})` }}>
                                  <span className="branch-badge-pill">{branch.badge}</span>
                                  {isSelected && (
                                    <div className="selected-tag">
                                      <Check size={14} /> ACTIVE SELECTION
                                    </div>
                                  )}
                                </div>

                                <div className="branch-card-info">
                                  <h4 className="branch-title-text">{branch.name}</h4>
                                  <p className="branch-address-text">{branch.address}</p>

                                  <div className="branch-meta-row">
                                    <div className="meta-pill">
                                      <Clock size={13} /> {branch.openingHours}
                                    </div>
                                    <div className="meta-pill">
                                      <Phone size={13} /> {branch.phone}
                                    </div>
                                  </div>

                                  <div className="facilities-chips">
                                    {branch.facilities.slice(0, 4).map((f, i) => (
                                      <span key={i} className="facility-chip">✓ {f.name}</span>
                                    ))}
                                  </div>

                                  <button className={`btn btn-sm btn-full ${isSelected ? 'btn-primary' : 'btn-glass'}`}>
                                    {isSelected ? 'Currently Selected' : 'Select This Branch'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Coming Soon Teaser */}
                      {city.comingSoon && (
                        <div className="coming-soon-box">
                          <Sparkles size={20} className="icon-amber" />
                          <div>
                            <h5>Expansion Under Construction</h5>
                            <p>We are building high-octane arenas in {city.cityName} to bring next-gen laser tag and bumper cars near you.</p>
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
      </div>

      <style>{`
        .location-modal {
          max-width: 780px;
          padding: 0;
          overflow: hidden;
        }

        .modal-header {
          padding: 1.75rem 2rem;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background: var(--bg-surface-2);
        }

        .modal-sub {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: #ffffff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .modal-close-btn:hover {
          background: var(--magenta-primary);
          border-color: var(--magenta-primary);
        }

        .modal-body {
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
        }

        .city-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .city-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .city-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
        }

        .state-pill {
          font-size: 0.75rem;
          background: var(--bg-surface-3);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
        }

        .branches-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .branch-card-select {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .branch-card-select:hover {
          border-color: var(--cyan-primary);
          transform: translateY(-3px);
        }

        .branch-card-select.selected {
          border-color: var(--cyan-primary);
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
          background: rgba(0, 240, 255, 0.04);
        }

        .branch-card-image {
          height: 140px;
          background-size: cover;
          background-position: center;
          position: relative;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .branch-card-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7,9,14,0.2) 0%, rgba(7,9,14,0.85) 100%);
          z-index: 1;
        }

        .branch-badge-pill {
          position: relative;
          z-index: 2;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-light);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          align-self: flex-start;
          color: #ffffff;
        }

        .selected-tag {
          position: relative;
          z-index: 2;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          background: var(--cyan-primary);
          color: #050b14;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          align-self: flex-end;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .branch-card-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .branch-title-text {
          font-size: 1.05rem;
          color: #ffffff;
        }

        .branch-address-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .branch-meta-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .meta-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .facilities-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.25rem;
        }

        .facility-chip {
          font-size: 0.7rem;
          background: var(--bg-surface-3);
          color: var(--text-secondary);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .coming-soon-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--bg-surface-2);
          border: 1px dashed var(--border-amber);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
        }

        .coming-soon-box h5 {
          font-size: 0.95rem;
          color: var(--amber-primary);
        }

        .coming-soon-box p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 680px) {
          .branches-grid {
            grid-template-columns: 1fr;
          }
          .modal-header, .modal-body {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};
