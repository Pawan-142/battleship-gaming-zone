import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Zap, Target, Sparkles, ArrowUpRight } from 'lucide-react';
import { TextEffect } from '../components/motion/TextEffect';


export const AboutPage = () => {
  return (
    <div className="forge-about-root">
      {/* Editorial Luxury Header */}
      <section className="forge-header-section">
        <div className="container">
          <div className="forge-breadcrumbs">
            <Link to="/">BATTLESHIP</Link>
            <span className="sep">/</span>
            <span className="current">FACILITY & MANIFESTO</span>
          </div>

          <div className="forge-pill-tag">
            <span className="pulse-dot"></span>
            <span>05 // THE ATELIER PHILOSOPHY</span>
          </div>

          <h1 className="forge-page-title">
            <TextEffect per="word" preset="fade-in-blur">
              Physical Adrenaline Built On Distinction.
            </TextEffect>
          </h1>

          <p className="forge-page-desc">
            We built Battleship Gaming Zone to rescue human adrenaline from flat glowing screens. An uncompromising commercial battleground engineered for real competition, raw velocity, and shared victory.
          </p>
        </div>
      </section>

      {/* Manifesto & Architecture Split */}
      <section className="forge-split-section">
        <div className="container">
          <div className="forge-about-grid">
            {/* Left Manifesto */}
            <div className="forge-about-col">
              <span className="mono-badge">01 // ORIGIN MANIFESTO</span>
              <h2 className="section-h2">Why Real-World Physical Competition Matters</h2>
              
              <p className="manifesto-p">
                In a digital landscape crowded with solitary feeds and simulated gameplay, genuine adrenaline happens when you look your rival in the eye, dodge an infrared beam behind a tactical wall, and feel the raw kinetic kick of a 48V electric bumper drift pod.
              </p>
              
              <p className="manifesto-p">
                Founded in Hyderabad, Battleship re-engineered the commercial arena from the ground up: replacing aging mechanical carnivals with whisper-quiet high-torque dual-brushless electric motors, tournament-grade UV glow lanes, and military-spec eye-safe tactical laser tags.
              </p>

              <div className="forge-pillars-grid">
                <div className="pillar-card">
                  <ShieldCheck size={20} className="icon-cyan" />
                  <h4>Safety & Precision</h4>
                  <p>Pneumatic buffers, 4-point racing harnesses, and certified marshal surveillance.</p>
                </div>
                <div className="pillar-card">
                  <Users size={20} className="icon-cyan" />
                  <h4>Squads & Championships</h4>
                  <p>Built for 6-year-old birthday celebrations and 300-person corporate championships alike.</p>
                </div>
              </div>
            </div>

            {/* Right Media Frame */}
            <div className="forge-media-col">
              <div className="forge-frame-box">
                <img
                  src="/images/venue-entrance.jpg"
                  alt="Battleship Arena Entrance"
                  className="frame-img"
                />
                <div className="frame-overlay" />
                <div className="frame-hud">
                  <span className="hud-code">BS-FACILITY-V3</span>
                  <div className="hud-stat-big">35,000 SQ.FT</div>
                  <span className="hud-label">PURPOSE-BUILT COMMERCIAL FOOTPRINT ACROSS HYDERABAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Standards Matrix */}
      <section className="forge-standards-section">
        <div className="container">
          <div className="standards-header">
            <span className="mono-badge">02 // HARDWARE SPECIFICATIONS</span>
            <h2>Commercial Engineering Standards</h2>
            <p>Every millimeter of our arena floors is calibrated for acoustic fidelity, instant mechanical response, and player safety.</p>
          </div>

          <div className="standards-grid">
            <div className="standard-card">
              <div className="std-top">
                <span className="std-num">01</span>
                <Zap size={20} className="icon-cyan" />
              </div>
              <h3>Dual-Brushless Electric Powertrains</h3>
              <p>Spark-free, odorless 360-degree rotation bumper pods equipped with smart electronic speed governors and pneumatic buffers.</p>
            </div>

            <div className="standard-card">
              <div className="std-top">
                <span className="std-num">02</span>
                <Target size={20} className="icon-cyan" />
              </div>
              <h3>Tactical Infrared Sensor Arrays</h3>
              <p>Haptic feedback chest and shoulder sensors transmitting real-time match telemetry to spectator HUD monitors with sub-millisecond precision.</p>
            </div>

            <div className="standard-card">
              <div className="std-top">
                <span className="std-num">03</span>
                <Sparkles size={20} className="icon-cyan" />
              </div>
              <h3>UV Sanitization Protocol</h3>
              <p>All VR headsets, laser vests, and bowling performance shoes undergo dedicated medical-grade ultraviolet sanitization between every single user turn.</p>
            </div>
          </div>

          {/* CTA Row */}
          <div className="about-cta-banner">
            <div>
              <h3>Ready to Experience The Arena?</h3>
              <p>Lock your slot online for ₹100 or schedule a private venue walkthrough.</p>
            </div>
            <div className="about-cta-actions">
              <Link to="/booking" className="forge-solid-btn">
                <span>RESERVE PASS</span>
                <ArrowUpRight size={15} />
              </Link>
              <Link to="/contact" className="forge-ghost-btn">
                <span>SPEAK WITH CONCIERGE</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .forge-about-root {
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
        }

        .forge-split-section {
          padding: 4rem 0 5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .forge-about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        .mono-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.75rem;
        }

        .section-h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          color: var(--text-main);
        }

        .manifesto-p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .forge-pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-top: 2rem;
        }

        .pillar-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 1.25rem;
        }

        .pillar-card h4 {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0.5rem 0 0.25rem;
          color: #ffffff;
        }

        .pillar-card p {
          font-size: 0.8rem;
          line-height: 1.4;
          color: var(--text-secondary);
        }

        .forge-frame-box {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          height: 440px;
        }

        .frame-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .frame-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(7, 9, 13, 0.9) 100%);
        }

        .frame-hud {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
        }

        .hud-code {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
          margin-bottom: 0.25rem;
        }

        .hud-stat-big {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .hud-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }

        .forge-standards-section {
          padding: 4.5rem 0 6rem;
        }

        .standards-header {
          margin-bottom: 3rem;
          max-width: 680px;
        }

        .standards-header h2 {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 800;
          margin: 0.5rem 0 0.75rem;
        }

        .standards-header p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .standards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .standard-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 1.75rem;
          transition: all 0.25s ease;
        }

        .standard-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
        }

        .std-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .std-num {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-cyan);
        }

        .standard-card h3 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .standard-card p {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        .about-cta-banner {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 2.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .about-cta-banner h3 {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
        }

        .about-cta-banner p {
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .about-cta-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .forge-solid-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.8rem 1.4rem;
          background: var(--text-main);
          color: var(--bg-deep) !important;
          border-radius: 6px;
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .forge-solid-btn:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .forge-ghost-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.8rem 1.4rem;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-main);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .forge-ghost-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* ==========================================================
           LIGHT MODE OVERRIDES FOR ABOUT PAGE
           ========================================================== */
        [data-theme="light"] .forge-about-root {
          background: #f8fafc;
          color: #0f172a;
        }

        [data-theme="light"] .pillar-card {
          background: #f8fafc;
          border-color: rgba(15, 23, 42, 0.1);
        }

        [data-theme="light"] .pillar-card h4 {
          color: #0f172a;
        }

        [data-theme="light"] .pillar-card p {
          color: #475569;
        }

        [data-theme="light"] .standard-card {
          background: #ffffff !important;
          border: 1px solid rgba(15, 23, 42, 0.12) !important;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
        }

        [data-theme="light"] .standard-card:hover {
          border-color: rgba(15, 23, 42, 0.25) !important;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
        }

        [data-theme="light"] .std-num {
          color: #0f172a;
        }

        [data-theme="light"] .about-cta-banner {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        [data-theme="light"] .about-cta-banner h3 {
          color: #0f172a;
        }

        [data-theme="light"] .about-cta-banner p {
          color: #475569;
        }

        [data-theme="light"] .forge-solid-btn {
          background: #0f172a !important;
          color: #ffffff !important;
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

        @media (max-width: 1024px) {
          .forge-about-grid {
            grid-template-columns: 1fr;
          }
          .standards-grid {
            grid-template-columns: 1fr;
          }
          .about-cta-banner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
