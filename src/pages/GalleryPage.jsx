import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryCategories, galleryItems } from '../data/galleryData';
import { Lightbox } from '../components/common/Lightbox';
import { TiltCard } from '../components/motion/TiltCard';
import { TextEffect } from '../components/motion/TextEffect';
import { Eye } from 'lucide-react';

export const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredItems = galleryItems.filter(item => {
    return selectedCategory === "All" || item.category === selectedCategory;
  });

  return (
    <div className="forge-gallery-root">
      {/* Editorial Luxury Header */}
      <section className="forge-header-section">
        <div className="container">
          <div className="forge-breadcrumbs">
            <Link to="/">BATTLESHIP</Link>
            <span className="sep">/</span>
            <span className="current">PHOTOGRAPHY EXHIBITION</span>
          </div>

          <div className="forge-pill-tag">
            <span className="pulse-dot"></span>
            <span>04 // VISUAL REPERTOIRE</span>
          </div>

          <h1 className="forge-page-title">
            <TextEffect per="word" preset="fade-in-blur">
              Atmosphere & Velocity Captured.
            </TextEffect>
          </h1>

          <p className="forge-page-desc">
            An authentic photographic look inside our 35,000 sq.ft physical entertainment arena in Hyderabad. High-octane electric bumper drift tracks, 2-tier infrared laser combat, UV glow bowling lanes, and private VIP lounges.
          </p>

          {/* Minimalist Filter Pills with Motion Layout Indicator */}
          <div className="forge-gallery-filters">
            {galleryCategories.map(cat => {
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
                      layoutId="activeGalleryPill"
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
      </section>

      {/* Gallery Exhibition Grid */}
      <section className="forge-gallery-section">
        <div className="container">
          <div className="forge-gallery-meta">
            <span className="mono-count">SHOWING <strong>0{filteredItems.length}</strong> EXHIBITION FRAMES</span>
            <span className="mono-tag">CLICK ANY FRAME FOR EXPANDED 4K VIEW</span>
          </div>

          <motion.div layout className="forge-gallery-grid">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 15 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  <TiltCard
                    tiltDegree={8}
                    className="forge-gallery-card cursor-pointer"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <div className="gallery-media-wrap">
                      <img src={item.image} alt={item.title} className="gallery-img" loading="lazy" />
                      <div className="gallery-vignette" />
                      
                      <div className="gallery-top-badge">
                        <span className="mono-idx">0{idx + 1} // {item.category.toUpperCase()}</span>
                      </div>

                      <div className="gallery-bottom-info">
                        <h3 className="g-title">{item.title}</h3>
                        <p className="g-sub">{item.subtitle}</p>
                        <div className="g-expand-pill">
                          <Eye size={12} />
                          <span>EXPAND FRAME</span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1))}
          onNext={() => setLightboxIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0))}
        />
      )}

      <style>{`
        .forge-gallery-root {
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
          margin-bottom: 2.25rem;
        }

        .forge-gallery-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .forge-cat-pill {
          padding: 0.5rem 0.95rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .forge-cat-pill:hover {
          color: var(--text-main);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .forge-cat-pill.active {
          background: var(--text-main);
          color: var(--bg-deep);
          border-color: var(--text-main);
        }

        .forge-gallery-section {
          padding: 3.5rem 0 6rem;
        }

        .forge-gallery-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .mono-count strong {
          color: var(--text-main);
        }

        .forge-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .forge-gallery-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .forge-gallery-card:hover {
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
        }

        .gallery-media-wrap {
          position: relative;
          height: 320px;
          overflow: hidden;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .forge-gallery-card:hover .gallery-img {
          transform: scale(1.06);
        }

        .gallery-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 9, 13, 0.2) 0%, rgba(7, 9, 13, 0.9) 100%);
        }

        .gallery-top-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
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

        .gallery-bottom-info {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          right: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .g-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .g-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .g-expand-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--accent-cyan);
        }

        @media (max-width: 1024px) {
          .forge-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .forge-gallery-grid {
            grid-template-columns: 1fr;
          }
          .gallery-media-wrap {
            height: 260px;
          }
        }
      `}</style>
    </div>
  );
};
