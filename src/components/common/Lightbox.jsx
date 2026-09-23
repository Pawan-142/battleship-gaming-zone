import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const Lightbox = ({ items, currentIndex, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close Lightbox">
        <X size={28} />
      </button>

      <button
        className="lightbox-nav prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous Image"
      >
        <ChevronLeft size={32} />
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={currentItem.image}
          alt={currentItem.title || "Gallery Item"}
          className="lightbox-img"
        />
        <div className="lightbox-caption">
          <h3>{currentItem.title}</h3>
          <p>{currentItem.subtitle}</p>
          <span className="lightbox-counter">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      </div>

      <button
        className="lightbox-nav next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next Image"
      >
        <ChevronRight size={32} />
      </button>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 7, 11, 0.95);
          backdrop-filter: blur(12px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }

        .lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-light);
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          z-index: 2001;
        }

        .lightbox-close:hover {
          background: var(--magenta-primary);
          border-color: var(--magenta-primary);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-light);
          color: #ffffff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 2001;
        }

        .lightbox-nav:hover {
          background: var(--cyan-primary);
          color: #050b14;
        }

        .lightbox-nav.prev { left: 1.5rem; }
        .lightbox-nav.next { right: 1.5rem; }

        .lightbox-content {
          max-width: 1000px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg);
        }

        .lightbox-caption {
          margin-top: 1.25rem;
          text-align: center;
        }

        .lightbox-caption h3 {
          font-size: 1.25rem;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .lightbox-caption p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .lightbox-counter {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--cyan-primary);
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .lightbox-nav {
            display: none;
          }
          .lightbox-overlay {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
