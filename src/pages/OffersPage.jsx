import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { offersData } from '../data/offersData';
import { useLocation } from '../context/LocationContext';
import { Copy, Check, Clock, Calendar } from 'lucide-react';

export const OffersPage = () => {
  const { currentBranch } = useLocation();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="offers-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <span className="curr">DEALS & OFFERS</span>
          </div>
          <span className="section-tag amber">VERIFIED PROMO CODES</span>
          <h1 className="page-hero-title">
            ACTIVE ARENA <span className="gradient-text-amber">PROMOTIONS</span>
          </h1>
          <p className="page-hero-desc">
            Save on your next squad battle, weekend family outing, or student rush hours with our verified instant promo codes.
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2">
            {offersData.map((offer) => (
              <div key={offer.code} className="glass-card offer-card-u">
                <div className="offer-top-row">
                  <span className="badge badge-magenta">{offer.badge}</span>
                  <span className="validity-txt">
                    <Clock size={13} /> {offer.validity}
                  </span>
                </div>

                <h3 className="offer-name-u">{offer.title}</h3>
                <p className="offer-desc-u">{offer.description}</p>

                <div className="offer-meta-chips-u">
                  <span className="m-chip">Applies to: {offer.applicableFor}</span>
                  <span className="m-chip">Min Spend: ₹{offer.minSpend}</span>
                </div>

                <div className="offer-code-bar">
                  <div className="code-col">
                    <span className="lbl-micro">PROMO CODE</span>
                    <strong className="code-big">{offer.code}</strong>
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="btn btn-glass btn-sm"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check size={14} className="icon-emerald" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="offer-footer-u">
                  <span className="terms-micro">ℹ {offer.terms}</span>
                  <Link
                    to={`/booking?branch=${currentBranch.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    BOOK WITH OFFER
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .offer-card-u {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          justify-content: space-between;
        }

        .offer-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .validity-txt {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .offer-name-u {
          font-size: 1.35rem;
        }

        .offer-desc-u {
          font-size: 0.92rem;
          line-height: 1.6;
          color: #cbd5e1;
        }

        .offer-meta-chips-u {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .m-chip {
          font-size: 0.75rem;
          background: var(--bg-deep);
          border: 1px solid var(--border-subtle);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-xs);
          color: var(--text-secondary);
        }

        .offer-code-bar {
          background: var(--bg-deep);
          border: 1.5px dashed var(--border-amber);
          border-radius: var(--radius-xs);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .code-col {
          display: flex;
          flex-direction: column;
        }

        .code-big {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--amber-primary);
          letter-spacing: 0.08em;
        }

        .offer-footer-u {
          border-top: 1px solid var(--border-subtle);
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};
