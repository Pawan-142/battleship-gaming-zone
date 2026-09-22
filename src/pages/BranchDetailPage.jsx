import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBranchById } from '../data/branchesData';
import { gamesData } from '../data/gamesData';
import { useLocation } from '../context/LocationContext';
import { formatCurrency } from '../utils/formatters';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Car, 
  Calendar, 
  CheckCircle2,
  Users
} from 'lucide-react';

export const BranchDetailPage = () => {
  const { branchId } = useParams();
  const { selectBranch } = useLocation();
  const branch = getBranchById(branchId);

  const availableGames = gamesData.filter(g => g.branchesAvailable.includes(branch.id));

  return (
    <div className="branch-detail-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <Link to="/locations">LOCATIONS</Link> <span>/</span> <span className="curr">{branch.shortName.toUpperCase()}</span>
          </div>
          <span className="section-tag">{branch.badge}</span>
          <h1 className="page-hero-title">{branch.name}</h1>
          <p className="page-hero-desc">
            <MapPin size={16} className="icon-cyan inline-icon" /> {branch.address} (Landmark: {branch.landmark})
          </p>
        </div>
      </section>

      {/* Arena Overview Banner */}
      <section className="section-padding">
        <div className="container">
          <div className="branch-overview-split">
            <div className="branch-cover-frame">
              <img src={branch.image} alt={branch.name} className="branch-main-img" />
              <div className="branch-cta-float">
                <Link
                  to={`/booking?branch=${branch.id}`}
                  className="btn btn-primary btn-lg"
                  onClick={() => selectBranch(branch.id)}
                >
                  <Calendar size={18} />
                  <span>BOOK AT THIS ARENA</span>
                </Link>
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-glass btn-lg"
                >
                  <Navigation size={18} />
                  <span>GET DIRECTIONS</span>
                </a>
              </div>
            </div>

            <div className="branch-quick-specs glass-card">
              <span className="section-tag amber">ARENA INFORMATION</span>
              <h3 className="mb-3">Operating Hours & Contact</h3>

              <div className="branch-info-list">
                <div className="info-item-u">
                  <Clock size={16} className="icon-amber" />
                  <div>
                    <span className="k">OPENING HOURS</span>
                    <strong>{branch.openingHours}</strong>
                  </div>
                </div>
                <div className="info-item-u">
                  <Phone size={16} className="icon-cyan" />
                  <div>
                    <span className="k">DIRECT HELPLINE</span>
                    <strong>{branch.phone}</strong>
                  </div>
                </div>
                <div className="info-item-u">
                  <Car size={16} className="icon-emerald" />
                  <div>
                    <span className="k">PARKING & TRANSIT</span>
                    <strong>Multi-Level Covered Mall Parking & Free Valet</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Games at This Branch */}
      <section className="section-padding pt-0">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">ATTRACTIONS AT THIS LOCATION</span>
            <h2>AVAILABLE EXPERIENCES</h2>
          </div>

          <div className="grid-3">
            {availableGames.map(game => (
              <div key={game.id} className="glass-card catalog-game-card glass-card-interactive">
                <div className="card-top-media">
                  <img src={game.heroImage} alt={game.name} className="c-img" />
                  <span className="badge badge-magenta cat-badge-top">{game.category}</span>
                </div>
                <div className="card-body-block">
                  <h3 className="card-title-text">{game.name}</h3>
                  <p className="card-desc-text">{game.shortDesc}</p>
                  <div className="card-actions-grid">
                    <Link to={`/games/${game.slug}`} className="btn btn-glass btn-sm flex-1">
                      SPECS
                    </Link>
                    <Link
                      to={`/booking?game=${game.slug}&branch=${branch.id}`}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      BOOK NOW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding pt-0">
        <div className="container">
          <div className="glass-card p-4">
            <span className="section-tag">VISITOR AMENITIES</span>
            <h2 className="mb-4">VENUE FACILITIES & CONVENIENCES</h2>
            <div className="grid-4">
              {branch.facilities.map((fac, idx) => (
                <div key={idx} className="fac-item-box">
                  <CheckCircle2 size={18} className="icon-cyan" />
                  <div>
                    <h4>{fac.name}</h4>
                    <span>Complimentary for guests</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .branch-overview-split {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 2.5rem;
          align-items: stretch;
        }

        .branch-cover-frame {
          position: relative;
          min-height: 360px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          border: 1px solid var(--border-strong);
        }

        .branch-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .branch-cta-float {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .branch-quick-specs {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .branch-info-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item-u {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: var(--bg-deep);
          border: 1px solid var(--border-subtle);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-xs);
        }

        .info-item-u .k {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .info-item-u strong {
          font-size: 0.88rem;
          color: #ffffff;
        }

        .fac-item-box {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          background: var(--bg-deep);
          border: 1px solid var(--border-subtle);
          padding: 1rem;
          border-radius: var(--radius-xs);
        }

        .fac-item-box h4 {
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }

        .fac-item-box span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .branch-overview-split { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
