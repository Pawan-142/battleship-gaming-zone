import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gamesData, getGameBySlug } from '../data/gamesData';
import { useLocation } from '../context/LocationContext';
import { getBranchById } from '../data/branchesData';
import { formatCurrency } from '../utils/formatters';
import { 
  Zap, 
  Clock, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Star, 
  CheckCircle2, 
  HelpCircle, 
  Calendar,
  ArrowRight
} from 'lucide-react';

export const GameDetailPage = () => {
  const { slug } = useParams();
  const { currentBranch, selectBranch } = useLocation();
  const game = getGameBySlug(slug);

  const [activeTab, setActiveTab] = useState("overview");

  if (!game) {
    return (
      <div className="container section-padding text-center">
        <h2>Experience not found</h2>
        <Link to="/games" className="btn btn-primary mt-4">Browse All Games</Link>
      </div>
    );
  }

  const availableBranches = game.branchesAvailable.map(id => getBranchById(id));
  const otherGames = gamesData.filter(g => g.id !== game.id).slice(0, 3);

  return (
    <div className="game-detail-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <Link to="/games">GAMES</Link> <span>/</span> <span className="curr">{game.name.toUpperCase()}</span>
          </div>
          <span className="section-tag">{game.category}</span>
          <h1 className="page-hero-title">{game.name}</h1>
          <p className="page-hero-desc">{game.tagline}</p>
        </div>
      </section>

      {/* Main Split Body */}
      <section className="section-padding">
        <div className="container">
          <div className="detail-split-grid">
            {/* Left Content */}
            <div className="detail-left-flow">
              {/* Feature Hero Image with Floating Price */}
              <div className="detail-feature-media">
                <img src={game.heroImage} alt={game.name} className="feature-img-main" />
                <div className="media-price-overlay">
                  <span className="rate-lbl">EXPERIENCE PASS</span>
                  <strong className="rate-val">{formatCurrency(game.pricePerPerson)}</strong>
                  <span className="rate-sub">/ player (only ~₹100 advance online)</span>
                </div>
                <div className="media-badge-tag">
                  <span className="badge badge-magenta">{game.badge}</span>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="detail-specs-bar">
                <div className="d-spec-box">
                  <Clock size={16} className="icon-cyan" />
                  <div>
                    <span className="k">DURATION</span>
                    <strong className="v">{game.durationDisplay}</strong>
                  </div>
                </div>
                <div className="d-spec-box">
                  <Users size={16} className="icon-amber" />
                  <div>
                    <span className="k">CAPACITY</span>
                    <strong className="v">{game.playersDisplay}</strong>
                  </div>
                </div>
                <div className="d-spec-box">
                  <ShieldCheck size={16} className="icon-emerald" />
                  <div>
                    <span className="k">AGE / HEIGHT</span>
                    <strong className="v">{game.ageRequirement} ({game.heightRequirement})</strong>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="detail-tabs-selector">
                <button
                  className={`d-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview & Flow
                </button>
                <button
                  className={`d-tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
                  onClick={() => setActiveTab('safety')}
                >
                  Safety & Gear
                </button>
                <button
                  className={`d-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('faqs')}
                >
                  Rules & FAQs
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="tab-body-pane animate-fade">
                  <div className="glass-card mb-4">
                    <h3 className="pane-heading">Arena Briefing</h3>
                    <p className="pane-p">{game.overview}</p>
                  </div>

                  <div className="glass-card mb-4">
                    <h3 className="pane-heading">Step-by-Step Experience Flow</h3>
                    <div className="steps-timeline">
                      {game.howItWorks.map((step, idx) => (
                        <div key={idx} className="timeline-item">
                          <span className="step-num-badge">{step.step}</span>
                          <div>
                            <h4>{step.title}</h4>
                            <p>{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {game.gallery && game.gallery.length > 0 && (
                    <div className="glass-card">
                      <h3 className="pane-heading">Arena Photos</h3>
                      <div className="gallery-mini-row">
                        {game.gallery.map((imgUrl, i) => (
                          <img key={i} src={imgUrl} alt={`${game.name} photo`} className="mini-photo" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Safety */}
              {activeTab === 'safety' && (
                <div className="tab-body-pane animate-fade">
                  <div className="glass-card mb-4">
                    <div className="safety-highlight-row">
                      <ShieldCheck size={28} className="icon-cyan" />
                      <div>
                        <h4>Certified Safety Equipment Provided</h4>
                        <p>{game.safetyGear}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card">
                    <h3 className="pane-heading">Mandatory Arena Rules</h3>
                    <div className="rules-bullet-list">
                      {game.safetyRules.map((rule, idx) => (
                        <div key={idx} className="r-item">
                          <CheckCircle2 size={16} className="icon-emerald flex-shrink-0" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: FAQs */}
              {activeTab === 'faqs' && (
                <div className="tab-body-pane animate-fade">
                  <div className="glass-card">
                    <h3 className="pane-heading">Experience FAQs</h3>
                    <div className="faq-questions-list">
                      {game.faqs.map((faq, idx) => (
                        <div key={idx} className="faq-q-block">
                          <h4 className="q-title">
                            <HelpCircle size={15} className="icon-amber" /> {faq.q}
                          </h4>
                          <p className="a-desc">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sticky Sidebar */}
            <div className="detail-right-sidebar">
              <div className="glass-card sticky-sidebar sidebar-booking-box">
                <span className="section-tag">RESERVATION DESK</span>
                <h3 className="sidebar-game-title">{game.name}</h3>

                <div className="sidebar-branch-select">
                  <label className="sidebar-lbl">Select Arena Branch:</label>
                  <div className="branch-pills-stack">
                    {availableBranches.map(b => (
                      <div
                        key={b.id}
                        className={`b-pill-item ${b.id === currentBranch.id ? 'active' : ''}`}
                        onClick={() => selectBranch(b.id)}
                      >
                        <MapPin size={15} className="icon-cyan" />
                        <div>
                          <strong>{b.shortName}</strong>
                          <span className="timing">{b.openingHours}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sidebar-fare-breakdown">
                  <div className="fare-r">
                    <span>Single Player Fare:</span>
                    <strong>{formatCurrency(game.pricePerPerson)}</strong>
                  </div>
                  <div className="fare-r text-cyan">
                    <span>Pay Online (Advance Hold):</span>
                    <strong>₹100 / player</strong>
                  </div>
                  <div className="fare-r">
                    <span>Balance at Arena Desk:</span>
                    <span>{formatCurrency(game.pricePerPerson - 100)}</span>
                  </div>
                </div>

                <Link
                  to={`/booking?game=${game.slug}&branch=${currentBranch.id}`}
                  className="btn btn-primary btn-lg btn-full"
                >
                  <Calendar size={18} />
                  <span>SELECT DATE & TIME SLOT</span>
                </Link>

                <span className="guarantee-text">
                  <ShieldCheck size={13} className="icon-emerald inline-icon" /> 100% full refund if cancelled &gt;24 hours prior.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .detail-split-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 3.5rem;
          align-items: flex-start;
        }

        .detail-feature-media {
          position: relative;
          height: 380px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          border: 1px solid var(--border-strong);
        }

        .feature-img-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-price-overlay {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          background: rgba(5, 7, 10, 0.94);
          border: 1px solid var(--border-cyan);
          border-radius: var(--radius-xs);
          padding: 0.6rem 1.1rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .rate-lbl {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .rate-val {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--cyan-primary);
          line-height: 1;
        }

        .rate-sub {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .media-badge-tag {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
        }

        .detail-specs-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xs);
          padding: 1.25rem;
          margin: 1.5rem 0 2rem;
        }

        .d-spec-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .d-spec-box .k {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .d-spec-box .v {
          font-size: 0.88rem;
          color: #ffffff;
        }

        .detail-tabs-selector {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 1.75rem;
        }

        .d-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.75rem 1.25rem;
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          transition: color 0.15s ease;
        }

        .d-tab-btn:hover {
          color: #ffffff;
        }

        .d-tab-btn.active {
          color: var(--cyan-primary);
        }

        .d-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--cyan-primary);
          box-shadow: 0 0 10px var(--cyan-primary);
        }

        .pane-heading {
          font-size: 1.25rem;
          margin-bottom: 0.85rem;
        }

        .pane-p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #cbd5e1;
        }

        .steps-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .step-num-badge {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-xs);
          background: var(--cyan-dim);
          border: 1px solid var(--border-cyan);
          color: var(--cyan-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 800;
          flex-shrink: 0;
        }

        .timeline-item h4 {
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
        }

        .timeline-item p {
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .gallery-mini-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .mini-photo {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: var(--radius-xs);
        }

        .safety-highlight-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .rules-bullet-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .r-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: #cbd5e1;
        }

        .faq-questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .faq-q-block {
          background: var(--bg-deep);
          border: 1px solid var(--border-subtle);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-xs);
        }

        .q-title {
          font-size: 0.98rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          margin-bottom: 0.4rem;
        }

        .a-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .sidebar-booking-box {
          padding: 2rem;
        }

        .sidebar-game-title {
          font-size: 1.3rem;
          margin: 0.5rem 0 1.25rem;
        }

        .sidebar-lbl {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .branch-pills-stack {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .b-pill-item {
          background: var(--bg-deep);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xs);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        .b-pill-item.active {
          border-color: var(--cyan-primary);
          background: var(--cyan-dim);
        }

        .b-pill-item .timing {
          display: block;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .sidebar-fare-breakdown {
          background: var(--bg-deep);
          border-radius: var(--radius-xs);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }

        .fare-r {
          display: flex;
          justify-content: space-between;
        }

        .guarantee-text {
          display: block;
          text-align: center;
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 1rem;
        }

        @media (max-width: 1024px) {
          .detail-split-grid { grid-template-columns: 1fr; }
          .detail-specs-bar { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
