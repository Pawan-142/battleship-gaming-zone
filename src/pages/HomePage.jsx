import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';
import { gamesData } from '../data/gamesData';
import { packagesData } from '../data/packagesData';


import { formatCurrency } from '../utils/formatters';

import { InView, AnimatedGroup, TransitionPanel, TiltCard, MagneticButton } from '../components/motion';
import { Zap, MapPin, Calendar, ArrowRight, ShieldCheck, Users, Clock, Star, ExternalLink, CheckCircle2 } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { currentBranch, branches, setIsLocationModalOpen } = useLocation();
  const { isDark } = useTheme();
  const [activeExpTab, setActiveExpTab] = useState(gamesData[0].id);
  const [isCtaSwiping, setIsCtaSwiping] = useState(false);

  const handleCtaClick = (e) => {
    e.preventDefault();
    if (isCtaSwiping) return;
    setIsCtaSwiping(true);
    setTimeout(() => {
      navigate('/games');
    }, 420);
  };

  // Quick Booking Dock Form State
  const [dockGame, setDockGame] = useState(gamesData[0].slug);
  const [dockDate, setDockDate] = useState(new Date().toISOString().split('T')[0]);
  const [dockPlayers, setDockPlayers] = useState(4);

  const selectedGame = gamesData.find(g => g.id === activeExpTab) || gamesData[0];

  // Smooth Staggered Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: custom,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.94, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: 0.15,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const cardSlideIn = {
    hidden: { opacity: 0, x: 30 },
    visible: (custom = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.75,
        delay: custom,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div className="home-page-root">
      {/* =========================================================================
          BATTLESHIP NEXT-GEN PHYSICAL GAMING HERO STAGE (SMOOTH CINEMATIC)
          ========================================================================= */}
      <section className="anorent-hero-stage battleship-exact-hero">
        {/* Full-bleed Dual-Layer Arena Backdrop with Smooth Cross-Fade Transition */}
        <div className="anorent-chrome-backdrop battleship-arena-backdrop">
          <div className="hero-arena-bg-layer">
            <img 
              src="/images/hero_battleship_arena_bg.jpg" 
              alt="Battleship Dark Physical Gaming Arena" 
              className={`hero-arena-bg-img hero-bg-dark ${isDark ? 'active-layer' : 'inactive-layer'}`}
            />
            <img 
              src="/images/hero_battleship_arena_bg_light_v3.jpg" 
              alt="Battleship Light Physical Gaming Arena" 
              className={`hero-arena-bg-img hero-bg-light ${!isDark ? 'active-layer' : 'inactive-layer'}`}
            />
            <div className="hero-arena-vignette-overlay" />
          </div>
        </div>

        <div className="container anorent-hero-container">
          
          {/* Main 2-Column Split matching the exact visual reference */}
          <div className="anorent-hero-grid battleship-hero-grid">
            
            {/* Left Column: Hero Title, Subtitle, CTA & Coordinates */}
            <div className="anorent-left-content battleship-left-content">
              
              {/* Top Cyber Bullet / Eyebrow */}
              <motion.div 
                className="anorent-eyebrow-row battleship-eyebrow-row"
                initial="hidden"
                animate="visible"
                custom={0.05}
                variants={fadeInUp}
              >
                <span className="eyebrow-dash">——</span>
                <span className="anorent-eyebrow-text">PHYSICAL GAMING & ENTERTAINMENT ARENA</span>
                <span className="eyebrow-dash">——</span>
              </motion.div>

              {/* Exact 3D Metallic Chrome Logo with Steering Helm & Anchor Crest */}
              <motion.div 
                className="battleship-brand-logo-hero"
                initial="hidden"
                animate="visible"
                variants={fadeInScale}
              >
                <img 
                  src={isDark ? "/images/battleship_chrome_cutout.png" : "/images/battleship_titan_black_cutout.png"} 
                  alt="BATTLESHIP®" 
                  className="battleship-chrome-logo-img" 
                />
              </motion.div>

              {/* Punchy 2-Line Display Headline */}
              <motion.h2 
                className="battleship-main-headline"
                initial="hidden"
                animate="visible"
                custom={0.25}
                variants={fadeInUp}
              >
                ENTER THE BATTLE.<br />
                LIVE THE EXPERIENCE.
              </motion.h2>

              {/* Subtext description */}
              <motion.p 
                className="battleship-sub-desc"
                initial="hidden"
                animate="visible"
                custom={0.35}
                variants={fadeInUp}
              >
                Hyderabad's next-generation physical gaming arena.
              </motion.p>

              {/* Action Button */}
              <motion.div 
                className="anorent-action-block battleship-action-block"
                initial="hidden"
                animate="visible"
                custom={0.45}
                variants={fadeInUp}
              >
                <button 
                  onClick={handleCtaClick} 
                  className={`battleship-cta-pill ${isCtaSwiping ? 'is-swiping' : ''}`}
                  type="button"
                  aria-label="View Attractions"
                >
                  <div className="cta-circle-arrow">
                    <ArrowRight size={16} />
                  </div>
                  <span className="cta-pill-text">VIEW ATTRACTIONS</span>
                  <div className="cta-swipe-trail" />
                </button>
              </motion.div>

              {/* Coordinates & Arena System Spec */}
              <motion.div 
                className="battleship-coords-row"
                initial="hidden"
                animate="visible"
                custom={0.55}
                variants={fadeInUp}
              >
                <MapPin size={22} className="coords-icon" />
                <div className="coords-text-col">
                  <span className="coord-val">17.4483° N, 78.3915° E</span>
                  <span className="sys-val">SYS-ARENA // REV-04</span>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Attraction Showcase Cards matching reference */}
            <div className="anorent-right-showcase battleship-right-showcase">
              
              {/* Vertical Stack of 3 High-Resolution Cyber Glass Cards */}
              <div className="battleship-cards-stack">
                
                {/* 01: Laser Combat */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={0.3}
                  variants={cardSlideIn}
                >
                  <Link to="/games/laser-blast" className="battleship-preview-card" title="Laser Combat">
                    <img src="/images/laser-blast.jpg" alt="Laser Combat" className="card-bg-full-img" />
                    <div className="card-overlay-gradient" />
                    <div className="card-content-inner">
                      <div className="card-text-wrap">
                        <strong className="card-title">LASER COMBAT</strong>
                        <span className="card-sub">TEAM UP. TAKE DOWN.</span>
                      </div>
                      <div className="card-arrow-circle">
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* 02: Electric Drift */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={0.45}
                  variants={cardSlideIn}
                >
                  <Link to="/games/bumper-cars" className="battleship-preview-card" title="Electric Drift">
                    <img src="/images/bumper-cars.jpg" alt="Electric Drift" className="card-bg-full-img" />
                    <div className="card-overlay-gradient" />
                    <div className="card-content-inner">
                      <div className="card-text-wrap">
                        <strong className="card-title">ELECTRIC DRIFT</strong>
                        <span className="card-sub">CRASH. LAUGH. REPEAT.</span>
                      </div>
                      <div className="card-arrow-circle">
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* 03: Glow Bowling */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  custom={0.6}
                  variants={cardSlideIn}
                >
                  <Link to="/games/hyper-bowling" className="battleship-preview-card" title="Glow Bowling">
                    <img src="/images/hyper-bowling.jpg" alt="Glow Bowling" className="card-bg-full-img" />
                    <div className="card-overlay-gradient" />
                    <div className="card-content-inner">
                      <div className="card-text-wrap">
                        <strong className="card-title">GLOW BOWLING</strong>
                        <span className="card-sub">STRIKE IN STYLE.</span>
                      </div>
                      <div className="card-arrow-circle">
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </Link>
                </motion.div>

              </div>

            </div>

          </div>

          {/* Bottom Category Pill & Next Level Fun Bar */}
          <div className="battleship-hero-bottom-bar">
            <div className="bottom-categories-capsule">
              <span className="cat-chip">ELECTRIC DRIFT</span>
              <span className="cat-sep">✦</span>
              <span className="cat-chip">LASER COMBAT</span>
              <span className="cat-sep">✦</span>
              <span className="cat-chip">GLOW BOWLING</span>
              <span className="cat-sep">✦</span>
              <span className="cat-chip">VR</span>
              <span className="cat-sep">✦</span>
              <span className="cat-chip">ARCADE</span>
              <span className="cat-sep">✦</span>
              <span className="cat-chip">SIM RACING</span>
            </div>

            <div className="bottom-barcode-tag">
              <div className="mini-barcode">
                <span className="bar b1" /><span className="bar b2" /><span className="bar b3" /><span className="bar b1" /><span className="bar b4" /><span className="bar b2" /><span className="bar b1" />
              </div>
              <span className="barcode-tag-text">NEXT LEVEL FUN</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          QUICK BOOKING FLOATING DOCK BAR
          ========================================================================= */}
      <section className="booking-dock-section">
        <div className="container">
          <div className="quick-booking-dock glass-card">
            <div className="dock-item">
              <span className="dock-lbl">1. SELECT ARENA</span>
              <button 
                type="button" 
                className="dock-select-btn" 
                onClick={() => setIsLocationModalOpen(true)}
              >
                <MapPin size={15} className="icon-mono" />
                <span>{currentBranch.shortName}</span>
              </button>
            </div>

            <div className="dock-item">
              <span className="dock-lbl">2. ATTRACTION</span>
              <select 
                className="dock-select-input" 
                value={dockGame} 
                onChange={(e) => setDockGame(e.target.value)}
              >
                {gamesData.map((g) => (
                  <option key={g.id} value={g.slug}>
                    {g.name.split(':')[0]} ({formatCurrency(g.pricePerPerson)})
                  </option>
                ))}
              </select>
            </div>

            <div className="dock-item">
              <span className="dock-lbl">3. VISIT DATE</span>
              <input 
                type="date" 
                className="dock-date-input" 
                value={dockDate} 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDockDate(e.target.value)}
              />
            </div>

            <div className="dock-item">
              <span className="dock-lbl">4. SQUAD SIZE</span>
              <div className="dock-counter-row">
                <button 
                  type="button" 
                  className="dock-cnt-btn" 
                  onClick={() => setDockPlayers(Math.max(1, dockPlayers - 1))}
                >-</button>
                <span className="dock-cnt-val">{dockPlayers} Players</span>
                <button 
                  type="button" 
                  className="dock-cnt-btn" 
                  onClick={() => setDockPlayers(Math.min(20, dockPlayers + 1))}
                >+</button>
              </div>
            </div>

            <div className="dock-action-item">
              <MagneticButton strength={0.2} style={{ width: '100%' }}>
                <Link
                  to={`/booking?game=${dockGame}&date=${dockDate}&players=${dockPlayers}&branch=${currentBranch.id}`}
                  className="btn btn-cyber btn-cyber-primary btn-block"
                >
                  <Calendar size={16} />
                  <span>INSTANT PASS (FROM ₹100)</span>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE ATTRACTIONS SHOWCASE (POWERED BY MOTION TRANSITIONPANEL)
          ========================================================================= */}
      <section className="section-padding interactive-showcase-section">
        <div className="container">
          <InView className="section-header">
            <span className="section-tag">PHYSICAL ATTRACTIONS</span>
            <h2 className="section-title">CHOOSE YOUR BATTLEGROUND</h2>
            <p className="section-desc">
              Six signature commercial attractions engineered for high-energy friends competitions, family bonding, and company tournaments.
            </p>
          </InView>

          {/* Attraction Tab Switcher with Motion Layout Indicator */}
          <div className="attraction-nav-bar">
            {gamesData.map((game) => {
              const isActive = activeExpTab === game.id;
              return (
                <button
                  key={game.id}
                  className={`attraction-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveExpTab(game.id)}
                  style={{ position: 'relative' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAttractionTab"
                      className="active-tab-glow"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        zIndex: 0,
                      }}
                    />
                  )}
                  <span className="tab-cat-mini" style={{ position: 'relative', zIndex: 1 }}>{game.category}</span>
                  <span className="tab-game-title" style={{ position: 'relative', zIndex: 1 }}>{game.name.split(':')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Attraction Interactive Display Stage with Motion TransitionPanel */}
          <TransitionPanel
            activeIndex={gamesData.findIndex(g => g.id === activeExpTab) >= 0 ? gamesData.findIndex(g => g.id === activeExpTab) : 0}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            variants={{
              enter: { opacity: 0, y: 24, filter: 'blur(8px)' },
              center: { opacity: 1, y: 0, filter: 'blur(0px)' },
              exit: { opacity: 0, y: -24, filter: 'blur(8px)' },
            }}
          >
            {gamesData.map((game) => (
              <div key={game.id} className="attraction-stage-card glass-card">
                <div className="stage-split-grid">
                  {/* Media Col */}
                  <div className="stage-media-wrap">
                    <img src={game.heroImage} alt={game.name} className="stage-img" />
                    <div className="stage-floating-price">
                      <span className="from-txt">Pass from</span>
                      <strong className="price-bold">{formatCurrency(game.pricePerPerson)}</strong>
                      <span className="per-head">/ player</span>
                    </div>
                    <div className="stage-tag-badge">
                      <span className="badge badge-atelier">{game.badge}</span>
                    </div>
                  </div>

                  {/* Specs & Action Col */}
                  <div className="stage-content-wrap">
                    <div className="stage-rating-row">
                      <div className="star-stack">
                        <Star size={15} fill="#ffffff" color="#ffffff" />
                        <span>{game.rating}</span>
                        <span className="rev-num">({game.reviewsCount} verified player ratings)</span>
                      </div>
                      <span className="stage-category-label">{game.category}</span>
                    </div>

                    <h3 className="stage-game-name">{game.name}</h3>
                    <p className="stage-tagline">{game.tagline}</p>
                    <p className="stage-desc">{game.overview}</p>

                    {/* Technical Specifications Matrix */}
                    <div className="stage-tech-specs-table">
                      <div className="tech-spec-row">
                        <span className="tech-k"><Clock size={15} /> Duration / Session:</span>
                        <strong className="tech-v">{game.durationDisplay}</strong>
                      </div>
                      <div className="tech-spec-row">
                        <span className="tech-k"><Users size={15} /> Arena Capacity:</span>
                        <strong className="tech-v">{game.playersDisplay}</strong>
                      </div>
                      <div className="tech-spec-row">
                        <span className="tech-k"><ShieldCheck size={15} /> Safety Requirement:</span>
                        <strong className="tech-v">{game.ageRequirement} ({game.heightRequirement})</strong>
                      </div>
                      <div className="tech-spec-row">
                        <span className="tech-k"><Zap size={15} /> Hardware / Gear:</span>
                        <strong className="tech-v">{game.safetyGear}</strong>
                      </div>
                    </div>

                    <div className="stage-action-row">
                      <MagneticButton strength={0.2} style={{ flex: 1 }}>
                        <Link
                          to={`/booking?game=${game.slug}&branch=${currentBranch.id}`}
                          className="btn btn-cyber btn-cyber-primary btn-lg w-full"
                        >
                          <Calendar size={18} />
                          <span>BOOK {game.name.split(':')[0].toUpperCase()}</span>
                        </Link>
                      </MagneticButton>
                      <MagneticButton strength={0.15}>
                        <Link
                          to={`/games/${game.slug}`}
                          className="btn btn-cyber btn-cyber-outline btn-lg"
                        >
                          <span>FULL SPECS & RULES</span>
                          <ArrowRight size={16} />
                        </Link>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TransitionPanel>
        </div>
      </section>

      {/* =========================================================================
          PHYSICAL ARENA FLOORPLAN & ZONES (ANIMATEDGROUP 3D FLIP)
          ========================================================================= */}
      <section className="section-padding arena-floorplan-section">
        <div className="container">
          <InView className="section-header center">
            <span className="section-tag">ARENA ARCHITECTURE</span>
            <h2 className="section-title">35,000 SQ.FT PURPOSE-BUILT PLAYGROUND</h2>
            <p className="section-desc">
              Explore how our physical arena is mapped at Inorbit Mall Hitech City & Sarath City Mall Kondapur.
            </p>
          </InView>

          <AnimatedGroup 
            className="floorplan-display-grid"
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  filter: 'blur(12px)',
                  y: 40,
                  rotateX: 45,
                },
                visible: {
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  rotateX: 0,
                  transition: {
                    type: 'spring',
                    bounce: 0.3,
                    duration: 0.9,
                  },
                },
              },
            }}
          >
            <TiltCard tiltDegree={8} scale={1.03} glare={true} className="zone-card glass-card">
              <span className="zone-num">ZONE A</span>
              <h4>⚡ Electric Bumper Drift Arena</h4>
              <p>Reinforced pneumatic shock track with 8 high-torque 360° spin vehicles and floor-induction charging.</p>
            </TiltCard>

            <TiltCard tiltDegree={8} scale={1.03} glare={true} className="zone-card glass-card">
              <span className="zone-num">ZONE B</span>
              <h4>🎯 2-Tier Laser Combat Maze</h4>
              <p>Elevated sniper bridges, fog-filled corridors, and glowing team bases with sub-millisecond haptic scoring.</p>
            </TiltCard>

            <TiltCard tiltDegree={8} scale={1.03} glare={true} className="zone-card glass-card">
              <span className="zone-num">ZONE C</span>
              <h4>🎳 UV Glow Bowling Lanes</h4>
              <p>Polished synthetic tournament lanes with projection scoring animations and dedicated leather lounge seating.</p>
            </TiltCard>

            <TiltCard tiltDegree={8} scale={1.03} glare={true} className="zone-card glass-card">
              <span className="zone-num">ZONE D</span>
              <h4>🥽 9D VR Motion Pod Bay</h4>
              <p>Multi-axis hydraulic motion eggs with synchronized wind, rumble, and 4K stereoscopic headsets.</p>
            </TiltCard>

            <TiltCard tiltDegree={8} scale={1.03} glare={true} className="zone-card glass-card">
              <span className="zone-num">ZONE E</span>
              <h4>🕹 Smart-Tap Arcade Alley</h4>
              <p>Over 60+ ticket redemption machines, superbike racers, and prize redemption boutique.</p>
            </TiltCard>

            <TiltCard tiltDegree={8} scale={1.03} glare={true} className="zone-card glass-card">
              <span className="zone-num">ZONE F</span>
              <h4>🍔 Fuel Diner & Party Suites</h4>
              <p>Artisan pizzas, loaded nachos, mocktail bar, and soundproof private suites for birthdays & town halls.</p>
            </TiltCard>
          </AnimatedGroup>
        </div>
      </section>

      {/* =========================================================================
          POPULAR SQUAD & PARTY PACKAGES
          ========================================================================= */}
      <section className="section-padding packages-commercial-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-tag">VALUE PASSES</span>
              <h2 className="section-title">POPULAR COMBO PACKAGES</h2>
              <p className="section-desc">Bundle multiple attractions for maximum savings and zero waiting times.</p>
            </div>
            <Link to="/packages" className="btn btn-cyber btn-cyber-outline">
              <span>VIEW ALL PASSES</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="packages-commercial-grid">
            {packagesData.slice(0, 3).map((pkg) => (
              <TiltCard key={pkg.id} tiltDegree={6} scale={1.02} glare={true} className="glass-card commercial-pkg-card">
                <div className="pkg-card-top-media">
                  <img src={pkg.image} alt={pkg.name} className="pkg-card-img" />
                  <span className="badge badge-atelier pkg-badge-corner">{pkg.badge}</span>
                </div>
                <div className="pkg-card-body">
                  <div className="pkg-price-row">
                    <div>
                      <span className="pkg-cat-lbl">{pkg.category}</span>
                      <h3 className="pkg-title">{pkg.name}</h3>
                    </div>
                    <div className="pkg-price-box">
                      <span className="orig-price">{formatCurrency(pkg.originalPricePerPerson)}</span>
                      <strong className="deal-price">{formatCurrency(pkg.pricePerPerson)}</strong>
                      <span className="per-person-txt">/ player</span>
                    </div>
                  </div>

                  <p className="pkg-tagline-text">{pkg.tagline}</p>

                  <div className="pkg-inclusions-list">
                    <span className="inc-heading">INCLUDES:</span>
                    {pkg.includedExperiences.map((inc, i) => (
                      <div key={i} className="inc-bullet">
                        <CheckCircle2 size={14} />
                        <span><strong>{inc.name}</strong> ({inc.qty})</span>
                      </div>
                    ))}
                  </div>

                  <div className="pkg-card-actions">
                    <MagneticButton strength={0.2} style={{ width: '100%' }}>
                      <Link
                        to={`/booking?package=${pkg.id}&branch=${currentBranch.id}`}
                        className="btn btn-cyber btn-cyber-primary btn-block"
                      >
                        <Calendar size={15} />
                        <span>BOOK THIS PASS</span>
                      </Link>
                    </MagneticButton>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          VENUE LOCATIONS & CONTACT
          ========================================================================= */}
      <section className="section-padding branch-selector-commercial-section">
        <div className="container">
          <InView className="section-header center">
            <span className="section-tag">2 FLAGSHIP ARENAS</span>
            <h2 className="section-title">VISIT BATTLESHIP ARENAS HYDERABAD</h2>
            <p className="section-desc">
              Situated inside Hyderabad's premier entertainment malls with ample basement parking, metro connectivity, and 100% air-conditioned physical arenas.
            </p>
          </InView>

          <div className="branch-cards-grid">
            {branches.map((branch) => (
              <motion.div 
                key={branch.id} 
                className="glass-card branch-commercial-card"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="branch-card-header">
                  <div className="b-flag-icon">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="b-name">{branch.name}</h3>
                    <span className="b-landmark">{branch.landmark}</span>
                  </div>
                  {currentBranch.id === branch.id && (
                    <span className="badge badge-atelier b-active-badge">SELECTED ARENA</span>
                  )}
                </div>

                <div className="branch-specs-table">
                  <div className="b-spec-row">
                    <Clock size={15} />
                    <span><strong>Arena Hours:</strong> {branch.openingHours}</span>
                  </div>
                  <div className="b-spec-row">
                    <Users size={15} />
                    <span><strong>Phone Support:</strong> {branch.phone}</span>
                  </div>
                  <div className="b-spec-row">
                    <ShieldCheck size={15} />
                    <span><strong>Facilities:</strong> Valet Parking, Diner, Wheelchair Accessible</span>
                  </div>
                </div>

                <div className="branch-card-actions">
                  <MagneticButton strength={0.2} style={{ flex: 1 }}>
                    <Link
                      to={`/booking?branch=${branch.id}`}
                      className="btn btn-cyber btn-cyber-primary w-full"
                    >
                      <Calendar size={15} />
                      <span>BOOK AT THIS ARENA</span>
                    </Link>
                  </MagneticButton>
                  <MagneticButton strength={0.15}>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-cyber btn-cyber-outline"
                    >
                      <span>DIRECTIONS</span>
                      <ExternalLink size={14} />
                    </a>
                  </MagneticButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ==========================================================================
           SECTION HEADERS - LIGHTWEIGHT EDITORIAL
           ========================================================================== */
        .section-header {
          margin-bottom: 2.5rem;
        }

        .section-header.center {
          text-align: center;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 3rem;
        }

        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-size: clamp(1.6rem, 2.8vw, 2.2rem);
          font-weight: 300;
          letter-spacing: 0.02em;
          color: var(--text-pure);
          line-height: 1.2;
          margin-bottom: 0.6rem;
        }

        .section-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.65;
          max-width: 650px;
          font-weight: 300;
        }

        /* ==========================================================================
           ATTRACTION BATTLEGROUND SHOWCASE & TABS
           ========================================================================== */
        .interactive-showcase-section {
          position: relative;
        }

        .attraction-nav-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          margin-bottom: 1.75rem;
          scrollbar-width: none;
        }

        .attraction-nav-bar::-webkit-scrollbar {
          display: none;
        }

        .attraction-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.65rem 1.15rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-pill);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          outline: none;
        }

        [data-theme="light"] .attraction-tab-btn {
          background: #f8fafc;
          border-color: rgba(0, 0, 0, 0.08);
        }

        .attraction-tab-btn:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .attraction-tab-btn.active {
          background: #ffffff;
          border-color: #ffffff;
        }

        [data-theme="light"] .attraction-tab-btn.active {
          background: #000000;
          border-color: #000000;
        }

        .tab-cat-mini {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--text-muted);
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: 0.1em;
        }

        .attraction-tab-btn.active .tab-cat-mini {
          color: #71717a;
        }

        [data-theme="light"] .attraction-tab-btn.active .tab-cat-mini {
          color: #a1a1aa;
        }

        .tab-game-title {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-top: 2px;
          letter-spacing: 0.04em;
        }

        .attraction-tab-btn.active .tab-game-title {
          color: #000000;
        }

        [data-theme="light"] .attraction-tab-btn.active .tab-game-title {
          color: #ffffff;
        }

        /* Active Attraction Stage Card */
        .attraction-stage-card {
          padding: 1.75rem;
          border-radius: var(--radius-sm);
        }

        .stage-split-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2.5rem;
          align-items: center;
        }

        @media (max-width: 960px) {
          .stage-split-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .stage-media-wrap {
          position: relative;
          height: 380px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          background: #000000;
          border: 1px solid var(--border-subtle);
        }

        .stage-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .stage-media-wrap:hover .stage-img {
          transform: scale(1.04);
        }

        .stage-floating-price {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .from-txt, .per-head {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .price-bold {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 500;
          color: #ffffff;
        }

        .stage-tag-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
        }

        /* Stage Content Column */
        .stage-content-wrap {
          display: flex;
          flex-direction: column;
        }

        .stage-rating-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .star-stack {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 400;
          color: #ffffff;
        }

        [data-theme="light"] .star-stack {
          color: #000000;
        }

        .rev-num {
          color: var(--text-muted);
          font-weight: 300;
          font-size: 0.75rem;
        }

        .stage-category-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .stage-game-name {
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 300;
          color: var(--text-pure);
          line-height: 1.2;
          margin-bottom: 0.35rem;
          letter-spacing: -0.01em;
        }

        .stage-tagline {
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--text-secondary);
          margin-bottom: 0.6rem;
        }

        .stage-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1.4rem;
          font-weight: 300;
        }

        /* Technical Specs Matrix */
        .stage-tech-specs-table {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
          padding: 1.1rem;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          margin-bottom: 1.5rem;
        }

        [data-theme="light"] .stage-tech-specs-table {
          background: #f8fafc;
          border-color: rgba(0, 0, 0, 0.06);
        }

        @media (max-width: 640px) {
          .stage-tech-specs-table {
            grid-template-columns: 1fr;
          }
        }

        .tech-spec-row {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .tech-k {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .tech-v {
          font-size: 0.82rem;
          font-weight: 400;
          color: var(--text-primary);
        }

        .stage-action-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        @media (max-width: 640px) {
          .stage-action-row {
            flex-direction: column;
          }
          .stage-action-row a {
            width: 100%;
          }
        }

        /* ==========================================================================
           FLOORPLAN DISPLAY GRID
           ========================================================================== */
        .floorplan-display-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .floorplan-display-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .floorplan-display-grid {
            grid-template-columns: 1fr;
          }
        }

        .zone-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .zone-num {
          align-self: flex-start;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          padding: 0.2rem 0.55rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-pill);
          color: var(--text-muted);
        }

        [data-theme="light"] .zone-num {
          background: #e4e4e7;
          color: #09090b;
        }

        .zone-card h4 {
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-pure);
          line-height: 1.3;
        }

        .zone-card p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-weight: 300;
        }

        /* ==========================================================================
           PACKAGES COMMERCIAL GRID
           ========================================================================== */
        .packages-commercial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .packages-commercial-grid {
            grid-template-columns: 1fr;
          }
        }

        .commercial-pkg-card {
          overflow: hidden;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .pkg-card-top-media {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #000;
        }

        .pkg-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .commercial-pkg-card:hover .pkg-card-img {
          transform: scale(1.05);
        }

        .pkg-badge-corner {
          position: absolute;
          top: 1rem;
          left: 1rem;
        }

        .pkg-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pkg-price-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.6rem;
        }

        .pkg-cat-lbl {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .pkg-title {
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--text-pure);
          margin-top: 2px;
        }

        .pkg-price-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .orig-price {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .deal-price {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--text-pure);
          line-height: 1;
        }

        .per-person-txt {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        .pkg-tagline-text {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 1.1rem;
          font-weight: 300;
        }

        .pkg-inclusions-list {
          padding: 0.9rem;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        [data-theme="light"] .pkg-inclusions-list {
          background: #f8fafc;
        }

        .inc-heading {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .inc-bullet {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 300;
        }

        .pkg-card-actions {
          margin-top: auto;
        }

        /* ==========================================================================
           BRANCH CARDS GRID
           ========================================================================== */
        .branch-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .branch-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .branch-commercial-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .branch-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .b-flag-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-pure);
          flex-shrink: 0;
        }

        [data-theme="light"] .b-flag-icon {
          background: #f1f5f9;
        }

        .b-name {
          font-size: 1.15rem;
          font-weight: 400;
          color: var(--text-pure);
        }

        .b-landmark {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        .b-active-badge {
          margin-left: auto;
        }

        .branch-specs-table {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1.1rem;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
        }

        [data-theme="light"] .branch-specs-table {
          background: #f8fafc;
        }

        .b-spec-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
          font-weight: 300;
        }

        .branch-card-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};

