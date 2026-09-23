import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import { Calendar, MapPin } from 'lucide-react';

export const MobileStickyBar = () => {
  const { currentBranch, setIsLocationModalOpen } = useLocation();
  const routerLocation = useRouterLocation();

  // Hide sticky bar if user is already on the booking or checkout pages
  if (routerLocation.pathname === '/booking' || routerLocation.pathname === '/checkout') {
    return null;
  }

  return (
    <div className="mobile-sticky-action">
      <div 
        className="mobile-sticky-location"
        onClick={() => setIsLocationModalOpen(true)}
      >
        <MapPin size={16} className="icon-cyan" />
        <div className="text-col">
          <span className="tiny-label">SELECTED ARENA</span>
          <span className="branch-name">{currentBranch.shortName}</span>
        </div>
      </div>

      <Link to="/booking" className="btn btn-primary btn-sm sticky-book-btn">
        <Calendar size={16} />
        <span>BOOK EXPERIENCE</span>
      </Link>

      <style>{`
        .mobile-sticky-action {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-sticky-action {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
            background: var(--bg-surface);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid var(--border-subtle);
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
          }
        }

        .mobile-sticky-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .mobile-sticky-location .text-col {
          display: flex;
          flex-direction: column;
        }

        .mobile-sticky-location .tiny-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .mobile-sticky-location .branch-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .sticky-book-btn {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};
