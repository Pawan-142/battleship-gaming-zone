import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { offersData } from '../data/offersData';
import { useLocation } from '../context/LocationContext';
import { TiltCard } from '../components/motion/TiltCard';
import { MagneticButton } from '../components/motion/MagneticButton';
import { TextEffect } from '../components/motion/TextEffect';
import { Copy, Check, Clock } from 'lucide-react';

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
            <TextEffect per="word" preset="fade-in-blur">
              Active Arena Promotions & Passes
            </TextEffect>
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
            {offersData.map((offer, idx) => (
              <motion.div
                key={offer.code}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <TiltCard tiltDegree={6} glare={true} className="glass-card offer-card-u">
                  <div className="offer-top-row">
                    <span className="badge badge-atelier">{offer.badge}</span>
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

                    <MagneticButton strength={0.2}>
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
                    </MagneticButton>
                  </div>

                  <div className="offer-footer-u">
                    <span className="terms-micro">ℹ {offer.terms}</span>
                    <MagneticButton strength={0.2}>
                      <Link
                        to={`/booking?branch=${currentBranch.id}&promo=${offer.code}`}
                        className="btn btn-cyber btn-cyber-primary btn-sm"
                      >
                        BOOK WITH OFFER
                      </Link>
                    </MagneticButton>
                  </div>
                </TiltCard>
              </motion.div>
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
