import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { gamesData } from '../data/gamesData';
import { formatCurrency } from '../utils/formatters';
import { TiltCard } from '../components/motion/TiltCard';
import { TextEffect } from '../components/motion/TextEffect';
import { BorderTrail } from '../components/motion/BorderTrail';
import { 
  Search, 
  Clock, 
  Users, 
  ShieldCheck, 
  Star, 
  MapPin, 
  ArrowUpRight,
  Zap,
  Flame,
  Activity
} from 'lucide-react';

export const GamesPage = () => {
  const { currentBranch } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "High Adrenaline", "Group Battle", "Family & Social", "Immersive VR", "Family & Kids"];

  const filteredGames = gamesData.filter(game => {
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="forge-games-root">
      {/* Editorial Luxury Header */}
      <section className="forge-games-header">
        <div className="container">
          <div className="forge-breadcrumbs">
            <Link to="/">HYPERDRIVE</Link>
            <span className="sep">/</span>
            <span className="current">ATTRACTIONS ATELIER</span>
          </div>

          <div className="forge-pill-tag">
            <span className="pulse-dot"></span>
            <span>01 // PHYSICAL ARENA REPERTOIRE</span>
          </div>

          <h1 className="forge-page-title">
            <TextEffect per="word" preset="fade-in-blur">
              Physical Adrenaline. Engineered for Distinction.
            </TextEffect>
          </h1>

          <p className="forge-page-desc">
            Six signature real-world physical gaming battlegrounds across 35,000 sq.ft in Hyderabad. High-voltage 360° electric bumper drift pods, 2-tier laser combat, UV glow bowling, and hydraulic VR.
          </p>

          {/* Minimalist Search & Category Filter */}
          <div className="forge-filter-strip">
            <div className="forge-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search attraction name, speed, intensity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="forge-search-input"
              />
            </div>

            <div className="forge-category-pills">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    className={`forge-cat-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ position: 'relative' }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="active-pill-bg"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: '#ffffff',
                          borderRadius: '9999px',
                          zIndex: 0,
                        }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 1, color: isActive ? '#07090e' : 'inherit', fontWeight: isActive ? 600 : 400 }}>
                      {cat.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="forge-catalog-section">
        <div className="container">
          <div className="forge-catalog-meta">
            <span className="mono-count">
              SHOWING <strong>0{filteredGames.length}</strong> ATTRACTIONS
            </span>
            <span className="mono-branch">
              <MapPin size={13} className="icon-cyan" />
              <span>ACTIVE ARENA: <strong>{currentBranch.name.toUpperCase()}</strong></span>
            </span>
          </div>

          <motion.div 
            layout
            className="forge-games-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, idx) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 15 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <TiltCard tiltDegree={8} className="forge-attraction-card">
                    {/* Media Container */}
                    <div className="card-media-wrapper">
                      <img src={game.heroImage} alt={game.name} className="card-img" loading="lazy" />
                      <div className="media-overlay-vignette" />
                      
                      <div className="card-floating-header">
                        <span className="forge-index-badge">0{idx + 1} // {game.category.toUpperCase()}</span>
                        <span className="forge-rating-badge">
                          <Star size={11} fill="#ffffff" color="#ffffff" />
                          <span>{game.rating}</span>
                        </span>
                      </div>

                      <div className="card-floating-price">
                        <span className="from-lbl">PASS FROM</span>
                        <strong className="amt-val">{formatCurrency(game.pricePerPerson)}</strong>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="card-body">
                      <div className="card-title-row">
                        <h3 className="attraction-title">{game.name}</h3>
                        <span className="badge-flame">
                          <Zap size={12} /> {game.badge}
                        </span>
                      </div>

                      <p className="attraction-desc">{game.shortDesc}</p>

                      {/* Specification Table */}
                      <div className="specs-matrix">
                        <div className="spec-cell">
                          <Clock size={14} className="spec-icon" />
                          <div className="spec-meta">
                            <span className="spec-label">SESSION</span>
                            <span className="spec-value">{game.durationDisplay}</span>
                          </div>
                        </div>

                        <div className="spec-cell">
                          <Users size={14} className="spec-icon" />
                          <div className="spec-meta">
                            <span className="spec-label">CAPACITY</span>
                            <span className="spec-value">{game.playersDisplay}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="card-actions">
                        <Link to={`/games/${game.slug}`} className="forge-ghost-btn">
                          <span>SPECIFICATIONS</span>
                          <ArrowUpRight size={14} />
                        </Link>
                        <Link 
                          to={`/booking?game=${game.slug}&branch=${currentBranch.id}`}
                          className="forge-solid-btn"
                        >
                          <span>RESERVE PASS</span>
                        </Link>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <style>{`
        .forge-games-root {
          min-height: 100vh;
          padding-top: var(--header-offset, 110px);
          color: var(--text-main);
        }

        .forge-games-header {
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
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .forge-filter-strip {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 1200px;
        }

        .forge-search-box {
          position: relative;
          max-width: 550px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .forge-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-pill);
          padding: 0.75rem 1.25rem 0.75rem 2.75rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: var(--text-main);
          outline: none;
          transition: all 0.2s ease;
        }

        .forge-search-input:focus {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        .forge-category-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .forge-cat-pill {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          letter-spacing: 0.08em;
          transition: all 0.2s ease;
        }

        .forge-cat-pill:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .forge-cat-pill.active {
          background: #ffffff;
          color: #07090d;
          border-color: #ffffff;
        }

        .forge-catalog-section {
          padding: 3.5rem 0 6rem;
        }

        .forge-catalog-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #94a3b8;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mono-count strong,
        .mono-branch strong {
          color: #ffffff;
        }

        .mono-branch {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .forge-games-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .forge-attraction-card {
          background: rgba(14, 19, 29, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(16px);
          transition: border-color 0.25s ease, transform 0.25s ease;
        }

        .forge-attraction-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .card-media-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #07090d;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .forge-attraction-card:hover .card-img {
          transform: scale(1.05);
        }

        .media-overlay-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 9, 13, 0.2) 0%, rgba(7, 9, 13, 0.8) 100%);
        }

        .card-floating-header {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          right: 0.85rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forge-index-badge {
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

        .forge-rating-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 500;
          color: #ffffff;
          padding: 0.25rem 0.55rem;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-pill);
        }

        .card-floating-price {
          position: absolute;
          bottom: 0.85rem;
          left: 0.85rem;
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .from-lbl {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .amt-val {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 400;
          color: #ffffff;
          line-height: 1;
        }

        .card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .attraction-title {
          font-family: var(--font-display);
          font-size: 1.12rem;
          font-weight: 400;
          color: #ffffff;
          line-height: 1.25;
        }

        .badge-flame {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-pill);
          white-space: nowrap;
        }

        .attraction-desc {
          font-size: 0.82rem;
          line-height: 1.6;
          color: #94a3b8;
          margin-bottom: 1.1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 300;
        }

        .specs-matrix {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
          padding: 0.75rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 1.25rem;
        }

        .spec-cell {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .spec-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .spec-meta {
          display: flex;
          flex-direction: column;
        }

        .spec-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .spec-value {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 400;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
          margin-top: auto;
        }

        .forge-ghost-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.65rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-pill);
          background: transparent;
          color: #ffffff;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .forge-ghost-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
        }

        .forge-solid-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 0.75rem;
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
          transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
        }

        .forge-solid-btn:hover {
          transform: translateY(-2px);
          background: #f1f5f9 !important;
        }

        /* ==========================================================
           LIGHT MODE OVERRIDES FOR ATTRACTIONS
           ========================================================== */
        [data-theme="light"] .forge-games-root {
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

        [data-theme="light"] .attraction-filter-btn {
          background: #f1f5f9;
          border-color: rgba(15, 23, 42, 0.12);
          color: #475569;
        }

        [data-theme="light"] .attraction-filter-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        [data-theme="light"] .attraction-filter-btn.active {
          background: #0f172a !important;
          color: #ffffff !important;
          border-color: #0f172a !important;
        }

        [data-theme="light"] .forge-attraction-card {
          background: #ffffff !important;
          border: 1px solid rgba(15, 23, 42, 0.12) !important;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.07), 0 0 1px 1px rgba(15, 23, 42, 0.05) !important;
        }

        [data-theme="light"] .card-floating-price {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(15, 23, 42, 0.15);
        }

        [data-theme="light"] .card-floating-price .from-lbl {
          color: #64748b;
        }

        [data-theme="light"] .card-floating-price .amt-val {
          color: #0f172a;
        }

        [data-theme="light"] .attraction-title {
          color: #0f172a !important;
        }

        [data-theme="light"] .attraction-desc {
          color: #475569;
        }

        [data-theme="light"] .specs-matrix {
          border-top-color: rgba(15, 23, 42, 0.08);
          border-bottom-color: rgba(15, 23, 42, 0.08);
        }

        [data-theme="light"] .spec-label {
          color: #64748b;
        }

        [data-theme="light"] .spec-value {
          color: #0f172a !important;
        }

        [data-theme="light"] .spec-icon {
          color: #64748b;
        }

        [data-theme="light"] .forge-ghost-btn {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.2);
          color: #0f172a;
        }

        [data-theme="light"] .forge-ghost-btn:hover {
          background: #f1f5f9;
          border-color: #0f172a;
        }

        [data-theme="light"] .forge-solid-btn {
          background: #0f172a !important;
          color: #ffffff !important;
          border: 1px solid #0f172a !important;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.15);
        }

        [data-theme="light"] .forge-solid-btn:hover {
          background: #1e293b !important;
        }

        @media (max-width: 1024px) {
          .forge-games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .forge-games-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
