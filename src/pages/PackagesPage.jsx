import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { packagesData } from '../data/packagesData';
import { formatCurrency } from '../utils/formatters';
import { TiltCard } from '../components/motion/TiltCard';
import { TextEffect } from '../components/motion/TextEffect';
import { BorderTrail } from '../components/motion/BorderTrail';
import { MagneticButton } from '../components/motion/MagneticButton';
import { CheckCircle2, Users, Clock, Building2, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const PackagesPage = () => {
  const { currentBranch } = useLocation();

  return (
    <div className="forge-packages-root">
      {/* Editorial Luxury Header */}
      <section className="forge-header-section">
        <div className="container">
          <div className="forge-breadcrumbs">
            <Link to="/">BATTLESHIP</Link>
            <span className="sep">/</span>
            <span className="current">COMMISSIONS & COMBO PASSES</span>
          </div>

          <div className="forge-pill-tag">
            <span className="pulse-dot"></span>
            <span>02 // CURATED SQUAD EXPERIENCES</span>
          </div>

          <h1 className="forge-page-title">
            <TextEffect per="word" preset="fade-in-blur">
              Multi-Attraction Passes. Maximum Velocity.
            </TextEffect>
          </h1>

          <p className="forge-page-desc">
            Bundle high-voltage physical attractions with significant cost savings and guaranteed VIP line privileges. Engineered for friend squads, milestone birthdays, and company tournaments.
          </p>
        </div>
      </section>

      {/* Packages Vertical Atelier Stack */}
      <section className="forge-packages-section">
        <div className="container">
          <div className="forge-packages-stack">
            {packagesData.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
              >
                <TiltCard tiltDegree={4} className="forge-package-card">
                  {/* Left Media */}
                  <div className="pkg-media-col">
                    <img src={pkg.image} alt={pkg.name} className="pkg-img" loading="lazy" />
                    <div className="pkg-media-overlay" />
                    <span className="pkg-badge-index">TIER 0{idx + 1} // {pkg.category.toUpperCase()}</span>
                  </div>

                  {/* Right Info Body */}
                  <div className="pkg-info-col">
                    <div className="pkg-header-row">
                      <div>
                        <span className="pkg-eyebrow">{pkg.badge}</span>
                        <h2 className="pkg-title">{pkg.name}</h2>
                        <p className="pkg-tagline">{pkg.tagline}</p>
                      </div>

                      <div className="pkg-price-box">
                        <span className="orig-price">{formatCurrency(pkg.originalPricePerPerson)}</span>
                        <div className="current-price">
                          {formatCurrency(pkg.pricePerPerson)} <span className="per-p">/ player</span>
                        </div>
                        <span className="savings-chip">{pkg.savingsDisplay}</span>
                      </div>
                    </div>

                    {/* Specs Pill Bar */}
                    <div className="pkg-specs-bar">
                      <div className="pkg-spec-item">
                        <Users size={13} className="spec-icon" />
                        <span>{pkg.idealFor}</span>
                      </div>
                      <div className="pkg-spec-item">
                        <Clock size={13} className="spec-icon" />
                        <span>{pkg.durationDisplay}</span>
                      </div>
                      <div className="pkg-spec-item">
                        <ShieldCheck size={13} className="spec-icon" />
                        <span>₹100 Advance Hold</span>
                      </div>
                    </div>

                    {/* Inclusions List */}
                    <div className="pkg-inclusions-box">
                      <span className="inc-title">INCLUDED ATTRACTIONS & MISSIONS:</span>
                      <div className="inc-grid">
                        {pkg.includedExperiences.map((inc, i) => (
                          <div key={i} className="inc-row">
                            <CheckCircle2 size={14} className="inc-icon" />
                            <span><strong>{inc.name}</strong> • {inc.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pkg-footer-row">
                      <span className="pkg-terms">ℹ {pkg.terms}</span>
                      <MagneticButton strength={0.2}>
                        <Link
                          to={`/booking?package=${pkg.id}&branch=${currentBranch.id}`}
                          className="forge-book-pass-btn"
                        >
                          <BorderTrail size={35} />
                          <span>RESERVE PASS</span>
                          <ArrowUpRight size={15} />
                        </Link>
                      </MagneticButton>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Corporate / Arena Takeover Atelier Banner */}
          <div className="forge-corp-takeover">
            <div className="corp-left">
              <Building2 size={32} className="corp-icon" />
              <div>
                <h3>Planning an Exclusive Arena Takeover or Corporate Cup?</h3>
                <p>We curate private championship brackets for 20 to 300+ guests in Hyderabad with private DJ soundscapes, custom trophy ceremonies, and executive dining.</p>
              </div>
            </div>
            <MagneticButton strength={0.2}>
              <Link to="/contact" className="forge-corp-btn">
                <span>REQUEST CORPORATE PROPOSAL</span>
                <ArrowUpRight size={16} />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      <style>{`
        .forge-packages-root {
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
          font-size: clamp(2.4rem, 4.2vw, 3.8rem);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: var(--text-main);
          max-width: 1400px;
          margin-bottom: 1.25rem;
        }

        .forge-page-desc {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 1000px;
          font-weight: 300;
        }

        .forge-packages-section {
          padding: 3.5rem 0 6rem;
        }

        .forge-packages-stack {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 3.5rem;
        }

        .forge-package-card {
          width: 100%;
          border-radius: var(--radius-sm);
        }

        .forge-package-card .tilt-card-inner {
          background: rgba(14, 19, 29, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          overflow: hidden;
          display: grid;
          grid-template-columns: 380px 1fr;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          width: 100%;
        }

        .forge-package-card:hover .tilt-card-inner {
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
        }

        .pkg-media-col {
          position: relative;
          min-height: 260px;
          background: #07090d;
        }

        .pkg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pkg-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(7, 9, 13, 0.85) 100%);
        }

        .pkg-badge-index {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          color: #ffffff;
          padding: 0.25rem 0.6rem;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-pill);
          letter-spacing: 0.08em;
        }

        .pkg-info-col {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }

        .pkg-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .pkg-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
        }

        .pkg-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 0.25rem;
          letter-spacing: 0.01em;
        }

        .pkg-tagline {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 300;
        }

        .pkg-price-box {
          text-align: right;
          flex-shrink: 0;
        }

        .orig-price {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-decoration: line-through;
          color: #64748b;
          display: block;
        }

        .current-price {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 400;
          color: #ffffff;
          line-height: 1;
        }

        .per-p {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 400;
          color: #94a3b8;
        }

        .savings-chip {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-pill);
          margin-top: 0.35rem;
          letter-spacing: 0.06em;
        }

        .pkg-specs-bar {
          display: flex;
          gap: 1.5rem;
          padding: 0.75rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 1.1rem;
        }

        .pkg-spec-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .spec-icon {
          color: #ffffff;
        }

        .pkg-inclusions-box {
          margin-bottom: 1.25rem;
        }

        .inc-title {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.5rem;
        }

        .inc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
        }

        .inc-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: #cbd5e1;
          font-weight: 300;
        }

        .inc-icon {
          color: #ffffff;
          flex-shrink: 0;
        }

        .pkg-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: auto;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .pkg-terms {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #64748b;
        }

        .forge-book-pass-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem;
          background: #ffffff !important;
          color: #07090d !important;
          border-radius: var(--radius-pill);
          border: 1px solid #ffffff;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.08);
          overflow: hidden;
          transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
        }

        .forge-book-pass-btn:hover {
          transform: translateY(-2px);
          background: #f1f5f9 !important;
        }

        .forge-corp-takeover {
          background: rgba(14, 19, 29, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(16px);
        }

        .corp-left {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .corp-icon {
          color: #ffffff;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .corp-left h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 400;
          margin-bottom: 0.35rem;
          color: #ffffff;
        }

        .corp-left p {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 650px;
          font-weight: 300;
        }

        .forge-corp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: transparent;
          color: #ffffff;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .forge-corp-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* ==========================================================
           LIGHT MODE OVERRIDES FOR COMBO PASSES
           ========================================================== */
        [data-theme="light"] .forge-packages-root {
          background: #f8fafc;
          color: #0f172a;
        }

        [data-theme="light"] .forge-breadcrumbs .current {
          color: #0f172a;
        }

        [data-theme="light"] .forge-pill-tag {
          background: rgba(15, 23, 42, 0.05);
          border-color: rgba(15, 23, 42, 0.15);
          color: #0f172a;
        }

        [data-theme="light"] .pulse-dot {
          background: #0f172a;
          box-shadow: 0 0 8px rgba(15, 23, 42, 0.4);
        }

        [data-theme="light"] .forge-package-card .tilt-card-inner {
          background: #ffffff !important;
          border: 1px solid rgba(15, 23, 42, 0.12) !important;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.07), 0 0 1px 1px rgba(15, 23, 42, 0.05) !important;
        }

        [data-theme="light"] .pkg-eyebrow {
          color: #64748b;
        }

        [data-theme="light"] .pkg-title {
          color: #0f172a !important;
        }

        [data-theme="light"] .pkg-tagline {
          color: #475569;
        }

        [data-theme="light"] .orig-price {
          color: #94a3b8;
        }

        [data-theme="light"] .current-price {
          color: #0f172a;
        }

        [data-theme="light"] .per-p {
          color: #64748b;
        }

        [data-theme="light"] .savings-chip {
          background: #ecfdf5;
          border-color: rgba(16, 185, 129, 0.3);
          color: #059669;
        }

        [data-theme="light"] .pkg-specs-bar {
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        [data-theme="light"] .pkg-spec-item {
          color: #475569;
        }

        [data-theme="light"] .spec-icon {
          color: #0f172a;
        }

        [data-theme="light"] .inc-title {
          color: #64748b;
        }

        [data-theme="light"] .inc-row {
          color: #334155;
        }

        [data-theme="light"] .inc-row strong {
          color: #0f172a;
        }

        [data-theme="light"] .inc-icon {
          color: #059669;
        }

        [data-theme="light"] .pkg-footer-row {
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        [data-theme="light"] .pkg-terms {
          color: #64748b;
        }

        [data-theme="light"] .forge-book-pass-btn {
          background: #0f172a !important;
          color: #ffffff !important;
          border: 1px solid #0f172a !important;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.15);
        }

        [data-theme="light"] .forge-book-pass-btn:hover {
          background: #1e293b !important;
        }

        [data-theme="light"] .forge-corp-takeover {
          background: #ffffff !important;
          border: 1px solid rgba(15, 23, 42, 0.12) !important;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.07);
        }

        [data-theme="light"] .corp-left h3 {
          color: #0f172a !important;
        }

        [data-theme="light"] .corp-left p {
          color: #475569;
        }

        [data-theme="light"] .corp-icon {
          color: #0f172a;
        }

        [data-theme="light"] .forge-corp-btn {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.18);
          color: #0f172a;
        }

        [data-theme="light"] .forge-corp-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        @media (max-width: 900px) {
          .forge-package-card .tilt-card-inner {
            grid-template-columns: 1fr;
          }
          .pkg-media-col {
            height: 220px;
            min-height: unset;
          }
          .forge-corp-takeover {
            flex-direction: column;
            align-items: flex-start;
          }
          .inc-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
