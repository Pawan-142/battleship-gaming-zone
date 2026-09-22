import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  Battery, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  Layers,
  Crosshair,
  Info
} from 'lucide-react';
import { BorderTrail } from '../components/motion/BorderTrail';
import './Scrollytelling.css';

// Color Theme accents for the HUD & glowing telemetry
const THEMES = [
  { id: 'cyan', name: 'Cyber Neon Cyan', hex: '#00f0ff', glow: 'rgba(0, 240, 255, 0.45)' },
  { id: 'crimson', name: 'Porsche Carmine Red', hex: '#ff0055', glow: 'rgba(255, 0, 85, 0.45)' },
  { id: 'gold', name: 'Solar Titanium Gold', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)' },
  { id: 'emerald', name: 'Hyper Racing Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.45)' },
];

// Interactive Technical Hotspots
const HOTSPOTS = [
  {
    id: 'bumper',
    x: '48%',
    y: '78%',
    title: 'Nitrogen Impact Collar',
    subtitle: 'Pressurized elastomer tube absorbing 94% kinetic collision force.',
    spec: '3.2 Bar Dynamic Pressure'
  },
  {
    id: 'cockpit',
    x: '52%',
    y: '46%',
    title: 'Tactical Pilot Pod',
    subtitle: 'Ergonomic bucket seat with dual micro-switch drift joysticks.',
    spec: '5-Point Safety Restraint'
  },
  {
    id: 'motor',
    x: '28%',
    y: '68%',
    title: 'Dual 48V Brushless Motors',
    subtitle: 'Independent rear-wheel torque vectoring with instantaneous response.',
    spec: '8,000 Max RPM / 0.02s'
  },
  {
    id: 'canopy',
    x: '68%',
    y: '32%',
    title: 'Carbon Composite Cowl',
    subtitle: 'Lightweight aerospace shell with low center-of-mass ballast.',
    spec: '0.22 Drag Coeff'
  }
];

export const ScrollytellingCarPage = () => {
  const containerRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [blueprintMode, setBlueprintMode] = useState(false);

  // Web Audio Synth references
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  // Scroll Progress Tracking across 450vh scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 28,
    mass: 0.25
  });

  // Dynamic 3D cinematic camera transforms driven by scroll progress
  const cameraRotateY = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, 3, -3, 2, 0]);
  const cameraRotateX = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, -2, 2.5, -1.5, 0]);
  const cameraPerspective = useTransform(smoothProgress, [0, 0.5, 1], [1200, 1000, 1200]);

  // Top-level transform hooks for 4 photorealistic stages
  // Stage 1: Hero reveal
  const stage1Opacity = useTransform(smoothProgress, [0, 0.22, 0.28], [1, 1, 0]);
  const stage1Scale = useTransform(smoothProgress, [0, 0.28], [1, 1.14]);
  const card1Opacity = useTransform(smoothProgress, [0, 0.05, 0.20, 0.25], [1, 1, 1, 0]);
  const card1X = useTransform(smoothProgress, [0, 0.05, 0.20, 0.25], [0, 0, 0, -60]);

  // Stage 2: Drift Apex & Collision
  const stage2Opacity = useTransform(smoothProgress, [0.24, 0.29, 0.48, 0.53], [0, 1, 1, 0]);
  const stage2Scale = useTransform(smoothProgress, [0.24, 0.53], [1.18, 1]);
  const stage2Rotate = useTransform(smoothProgress, [0.25, 0.38, 0.50], [-1.5, 1.5, -0.5]);
  const card2Opacity = useTransform(smoothProgress, [0.27, 0.32, 0.45, 0.50], [0, 1, 1, 0]);
  const card2X = useTransform(smoothProgress, [0.27, 0.32, 0.45, 0.50], [60, 0, 0, 60]);

  // Stage 3: Cockpit Interior Detail
  const stage3Opacity = useTransform(smoothProgress, [0.49, 0.54, 0.73, 0.78], [0, 1, 1, 0]);
  const stage3Scale = useTransform(smoothProgress, [0.49, 0.78], [1.02, 1.18]);
  const card3Opacity = useTransform(smoothProgress, [0.52, 0.57, 0.70, 0.75], [0, 1, 1, 0]);
  const card3X = useTransform(smoothProgress, [0.52, 0.57, 0.70, 0.75], [-60, 0, 0, -60]);

  // Stage 4: Grand Arena Celebration & Booking CTA
  const stage4Opacity = useTransform(smoothProgress, [0.74, 0.79, 1], [0, 1, 1]);
  const stage4Scale = useTransform(smoothProgress, [0.74, 1], [1.10, 1]);
  const card4Opacity = useTransform(smoothProgress, [0.78, 0.84, 1], [0, 1, 1]);
  const card4Y = useTransform(smoothProgress, [0.78, 0.84, 1], [50, 0, 0]);

  // Indicator fade out
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  // Hotspots visibility during Stage 1
  const hotspotsOpacity = useTransform(smoothProgress, [0, 0.18, 0.24], [1, 1, 0]);

  // Dynamic Telemetry metrics
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    rpm: 1200,
    power: 100,
    gforce: "0.2G",
    progressPercent: 0
  });

  // Track scroll change for telemetry and audio modulation
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (p) => {
      const clampedP = Math.max(0, Math.min(1, p));

      // Update active chapter index
      if (clampedP < 0.26) setActiveChapter(1);
      else if (clampedP < 0.51) setActiveChapter(2);
      else if (clampedP < 0.76) setActiveChapter(3);
      else setActiveChapter(4);

      // Update Telemetry metrics
      setTelemetry({
        speed: Math.round(clampedP * 58),
        rpm: Math.round(1200 + clampedP * 6800),
        power: Math.round(100 - clampedP * 12),
        gforce: `${(0.2 + Math.sin(clampedP * Math.PI) * 1.8).toFixed(1)}G`,
        progressPercent: Math.round(clampedP * 100)
      });

      // Modulate audio synth
      if (isAudioActive && oscRef.current && audioCtxRef.current) {
        const freq = 60 + clampedP * 140;
        oscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.06);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, isAudioActive]);

  // Auto-Scrub Playback
  useEffect(() => {
    if (!isAutoPlaying || !containerRef.current) return;
    let curr = smoothProgress.get();
    const interval = setInterval(() => {
      curr += 0.0035;
      if (curr > 1) curr = 0;
      const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: containerRef.current.offsetTop + totalHeight * curr,
        behavior: 'auto'
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoPlaying, smoothProgress]);

  // Audio Engine Toggle
  const toggleAudio = () => {
    if (isAudioActive) {
      if (oscRef.current) {
        try { 
          oscRef.current.stop(); 
          oscRef.current.disconnect(); 
        } catch(e) {}
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
        setIsAudioActive(true);
      } catch (err) {
        console.warn('Audio synthesis not supported:', err);
      }
    }
  };

  // Jump to specific story chapter
  const jumpToChapter = (frac) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: containerRef.current.offsetTop + totalHeight * frac,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className="scrolly-root" 
      ref={containerRef}
      style={{
        '--active-accent': activeTheme.hex,
        '--active-glow': activeTheme.glow,
        backgroundColor: '#030508',
        minHeight: '100vh',
      }}
    >
      {/* 1. Sleek Floating Header */}
      <header className="scrolly-nav-bar">
        <Link to="/" className="scrolly-back-link">
          <ArrowLeft size={14} />
          <span>ARENA HOME</span>
        </Link>

        <div className="scrolly-nav-center">
          <span className="scrolly-brand-badge">HYPERDRIVE ATELIER</span>
          <span className="scrolly-edition-chip">4K SCROLLYTELLING SHOWCASE</span>
        </div>

        <div className="scrolly-nav-actions">
          {/* Blueprint Wireframe Switcher */}
          <button
            type="button"
            className={`scrolly-sound-btn ${blueprintMode ? 'active' : ''}`}
            onClick={() => setBlueprintMode(!blueprintMode)}
            title="Toggle Technical Wireframe Blueprint"
            style={{ fontSize: '0.75rem', gap: '5px', padding: '0 10px', width: 'auto' }}
          >
            <Layers size={14} />
            <span style={{ display: 'inline', fontSize: '0.72rem' }}>
              {blueprintMode ? 'PHOTO' : 'BLUEPRINT'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button 
            type="button" 
            className={`scrolly-sound-btn ${isAudioActive ? 'active' : ''}`}
            onClick={toggleAudio}
            title={isAudioActive ? "Mute Cyber Drone" : "Enable Spatial Sound"}
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <Link to="/booking?game=bumper-cars" className="scrolly-reserve-btn">
            RESERVE PASS
          </Link>
        </div>
      </header>

      {/* 2. Chapter Scrub Nav (Right Side) */}
      <nav className="scrolly-chapter-tracker" aria-label="Story Chapters">
        {[
          { num: 1, label: "01 // THE GENESIS", frac: 0.05 },
          { num: 2, label: "02 // DRIFT APEX", frac: 0.35 },
          { num: 3, label: "03 // PILOT COCKPIT", frac: 0.65 },
          { num: 4, label: "04 // LAUNCH GRID", frac: 0.95 },
        ].map((c) => (
          <button
            key={c.num}
            type="button"
            className={`chapter-dot-item ${activeChapter === c.num ? 'active' : ''}`}
            onClick={() => jumpToChapter(c.frac)}
          >
            <span className="chapter-indicator-pip" />
            <span className="chapter-label-pill">{c.label}</span>
          </button>
        ))}
      </nav>

      {/* 3. Color Theme Customizer (Left Side) */}
      <div className="scrolly-color-picker">
        <span className="picker-title">HUD AURA</span>
        <div className="picker-swatches">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`swatch-btn ${activeTheme.id === theme.id ? 'active' : ''}`}
              style={{ backgroundColor: theme.hex, color: theme.hex }}
              onClick={() => setActiveTheme(theme)}
              title={theme.name}
            />
          ))}
        </div>
      </div>

      {/* 4. Main 460vh Scroll Track */}
      <div className="scrolly-stage-track" style={{ height: '460vh' }}>
        {/* The 100vh Sticky Viewport */}
        <div className="scrolly-sticky-stage" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          
          {/* ================================================================= */}
          {/* PHOTOREALISTIC MULTI-STAGE CROSSFADE CANVAS WITH 3D PERSPECTIVE */}
          {/* ================================================================= */}
          <motion.div 
            className="scrolly-visual-stage" 
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              backgroundColor: '#020305',
              overflow: 'hidden',
              perspective: '1200px',
              rotateX: cameraRotateX,
              rotateY: cameraRotateY,
              transformStyle: 'preserve-3d',
            }}
          >

            {/* STAGE 1: Hero Beauty Pose */}
            <motion.div style={{
              position: 'absolute',
              inset: 0,
              opacity: blueprintMode ? 0.15 : stage1Opacity,
              scale: stage1Scale,
              transformOrigin: 'center center',
              zIndex: 2,
            }}>
              <img 
                src="/images/battleship/battleship_bumper_hero_1790012986302.jpg" 
                alt="HyperDrive Electric Bumper Car Hero Reveal"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.1) brightness(0.95)',
                }}
              />
            </motion.div>

            {/* STAGE 2: High-Speed Collision & Drift Apex */}
            <motion.div style={{
              position: 'absolute',
              inset: 0,
              opacity: blueprintMode ? 0.15 : stage2Opacity,
              scale: stage2Scale,
              rotate: stage2Rotate,
              transformOrigin: 'center center',
              zIndex: 3,
            }}>
              <img 
                src="/images/battleship/battleship_bump_action_1790013025764.jpg" 
                alt="360 Rotation Drift Collision Action"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.15) brightness(0.92)',
                }}
              />
            </motion.div>

            {/* STAGE 3: Macro Cockpit Steering & Telemetry */}
            <motion.div style={{
              position: 'absolute',
              inset: 0,
              opacity: blueprintMode ? 0.15 : stage3Opacity,
              scale: stage3Scale,
              transformOrigin: 'center center',
              zIndex: 4,
            }}>
              <img 
                src="/images/battleship/battleship_cockpit_detail_1790013007746.jpg" 
                alt="Tactical Cockpit Joystick Steering Wheel"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.12) brightness(0.95)',
                }}
              />
            </motion.div>

            {/* STAGE 4: Grand Arena Lights & Podium Celebration */}
            <motion.div style={{
              position: 'absolute',
              inset: 0,
              opacity: blueprintMode ? 0.15 : stage4Opacity,
              scale: stage4Scale,
              transformOrigin: 'center center',
              zIndex: 5,
            }}>
              <img 
                src="/images/battleship/battleship_repeat_friends_1790013048961.jpg" 
                alt="HyperDrive Arena Electric Grid Celebration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.1) brightness(0.95)',
                }}
              />
            </motion.div>

            {/* OPTIONAL BLUEPRINT TECHNICAL OVERLAY */}
            <AnimatePresence>
              {blueprintMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(2, 6, 15, 0.88)',
                    backdropFilter: 'blur(12px)',
                    padding: '2rem'
                  }}
                >
                  <img
                    src="/images/battleship/dodgem_full_technical_chart.png"
                    alt="Technical Blueprint Specifications"
                    style={{
                      maxHeight: '75vh',
                      maxWidth: '90vw',
                      objectFit: 'contain',
                      filter: `drop-shadow(0 0 30px ${activeTheme.glow})`
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* INTERACTIVE HOTSPOT PINS (Stage 1) WITH SONAR RADAR RIPPLES */}
            {!blueprintMode && (
              <motion.div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 15,
                  pointerEvents: 'none',
                  opacity: hotspotsOpacity,
                }}
              >
                {HOTSPOTS.map((spot) => (
                  <div
                    key={spot.id}
                    style={{
                      position: 'absolute',
                      left: spot.x,
                      top: spot.y,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'auto',
                    }}
                  >
                    {/* Pulsing Sonar Ripple Ring */}
                    <div style={{ position: 'relative' }}>
                      <div 
                        className="hotspot-sonar-ping" 
                        style={{
                          position: 'absolute',
                          inset: '-10px',
                          borderRadius: '50%',
                          border: `1.5px solid ${activeTheme.hex}`,
                          opacity: 0.6,
                          pointerEvents: 'none',
                        }} 
                      />

                      <button
                        type="button"
                        onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'rgba(8, 12, 22, 0.9)',
                          border: `2px solid ${activeTheme.hex}`,
                          color: activeTheme.hex,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: `0 0 18px ${activeTheme.glow}`,
                          transition: 'all 0.25s ease',
                          position: 'relative',
                          zIndex: 2,
                        }}
                        title={spot.title}
                      >
                        <Crosshair size={16} />
                      </button>
                    </div>

                    {/* Hotspot Card Tooltip */}
                    <AnimatePresence>
                      {activeHotspot === spot.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          style={{
                            position: 'absolute',
                            bottom: '42px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '240px',
                            background: 'rgba(8, 12, 22, 0.95)',
                            border: `1px solid ${activeTheme.hex}`,
                            borderRadius: '12px',
                            padding: '12px 14px',
                            backdropFilter: 'blur(16px)',
                            boxShadow: `0 12px 30px rgba(0,0,0,0.8), 0 0 20px ${activeTheme.glow}`,
                            zIndex: 40,
                            pointerEvents: 'auto',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: activeTheme.hex, letterSpacing: '0.08em' }}>
                              SYSTEM SPEC
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                              {spot.spec}
                            </span>
                          </div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '0.88rem', color: '#ffffff', fontWeight: 700 }}>
                            {spot.title}
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                            {spot.subtitle}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Cinematic Gradient Vignettes */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(2,4,8,0.85) 90%)',
              pointerEvents: 'none',
              zIndex: 8,
            }} />

            {/* Subtle Neon Underglow Floor Reflex */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35vh',
              background: `radial-gradient(ellipse 70% 40% at 50% 100%, ${activeTheme.glow} 0%, rgba(0,0,0,0) 80%)`,
              pointerEvents: 'none',
              zIndex: 9,
            }} />
          </motion.div>

          {/* ================================================================= */}
          {/* STORY CARDS (APPLE / PORSCHE EDITORIAL TYPOGRAPHY) */}
          {/* ================================================================= */}

          {/* Chapter 1: The Genesis */}
          <motion.div
            className="scrolly-story-card pos-left"
            style={{
              zIndex: 20,
              opacity: card1Opacity,
              x: card1X,
            }}
          >
            <span className="story-eyebrow">CHAPTER 01 // ARCHITECTURAL REVEAL</span>
            <h2 className="story-title">BORN FOR PURE VELOCITY.</h2>
            <p className="story-desc">
              Aerospace carbon composite bodywork bonded with a pressurized nitrogen bumper collar. Engineered for 360° rotational drift with zero chassis deformation.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val" style={{ color: activeTheme.hex }}>360°</span>
                <span className="metric-lbl">Omni-Drift Axis</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val" style={{ color: activeTheme.hex }}>48V</span>
                <span className="metric-lbl">Dual Brushless Motors</span>
              </div>
            </div>
          </motion.div>

          {/* Chapter 2: Drift Apex */}
          <motion.div
            className="scrolly-story-card pos-right"
            style={{
              zIndex: 20,
              opacity: card2Opacity,
              x: card2X,
            }}
          >
            <span className="story-eyebrow">CHAPTER 02 // DUAL TORQUE VECTORING</span>
            <h2 className="story-title">INSTANT TORQUE. ZERO LAG.</h2>
            <p className="story-desc">
              Independent wheel drive induction delivers blistering 0.02s throttle response. Execute high-speed pendulum slides and pirouettes across the slick arena floor.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val" style={{ color: activeTheme.hex }}>0.02s</span>
                <span className="metric-lbl">Throttle Response</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val" style={{ color: activeTheme.hex }}>1.8G</span>
                <span className="metric-lbl">Lateral Acceleration</span>
              </div>
            </div>
          </motion.div>

          {/* Chapter 3: Cockpit Telemetry */}
          <motion.div
            className="scrolly-story-card pos-left"
            style={{
              zIndex: 20,
              opacity: card3Opacity,
              x: card3X,
            }}
          >
            <span className="story-eyebrow">CHAPTER 03 // TACTICAL PILOT COCKPIT</span>
            <h2 className="story-title">TOTAL CONTROL. UNRIVALED SAFETY.</h2>
            <p className="story-desc">
              Ergonomic bucket seats with 5-point harness restraint system, dual precision micro-switch joysticks, and sub-chassis lithium power cell vault.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val" style={{ color: activeTheme.hex }}>94%</span>
                <span className="metric-lbl">Kinetic Dissipation</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val" style={{ color: activeTheme.hex }}>5-Point</span>
                <span className="metric-lbl">Safety Harness Lock</span>
              </div>
            </div>
          </motion.div>

          {/* Chapter 4: Launch Grid CTA */}
          <motion.div
            className="scrolly-story-card pos-bottom"
            style={{
              zIndex: 20,
              opacity: card4Opacity,
              y: card4Y,
            }}
          >
            <BorderTrail size={50} duration={3} />
            <div style={{ textAlign: 'center' }}>
              <span className="story-eyebrow">CHAPTER 04 // ENTER THE BATTLEGROUND</span>
              <h2 className="story-title">READY TO TAKE THE WHEEL?</h2>
              <p className="story-desc" style={{ maxWidth: '540px', margin: '0 auto 1.5rem' }}>
                Hyderabad’s premier commercial arena with 8 active electric pods at Inorbit Mall & Sarath City Mall. Lock your session for just ₹100 deposit.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/booking?game=bumper-cars" className="btn btn-cyber btn-cyber-primary btn-lg">
                  <Calendar size={18} />
                  <span>RESERVE SESSION PASS (FROM ₹100)</span>
                </Link>
                <Link to="/games" className="btn btn-cyber btn-cyber-outline btn-lg">
                  <span>ALL 6 ATTRACTIONS</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 5. Live Telemetry HUD Dock (Bottom Left) */}
          <div className="scrolly-hud-dock">
            <div className="hud-pill-item">
              <span className="hud-pulse-dot" />
              <span>4K ENGINE: <strong>60 FPS</strong></span>
            </div>
            <div className="hud-pill-item">
              <Gauge size={13} style={{ color: activeTheme.hex }} />
              <span>VELOCITY: <strong>{telemetry.speed} KM/H</strong></span>
            </div>
            <div className="hud-pill-item">
              <Zap size={13} style={{ color: activeTheme.hex }} />
              <span>RPM: <strong>{telemetry.rpm}</strong></span>
            </div>
            <div className="hud-pill-item">
              <Battery size={13} style={{ color: '#10b981' }} />
              <span>POWER: <strong>{telemetry.power}%</strong></span>
            </div>
            <div className="hud-pill-item">
              <Compass size={13} style={{ color: activeTheme.hex }} />
              <span>G-FORCE: <strong>{telemetry.gforce}</strong></span>
            </div>
          </div>

          {/* 6. Playback Scrubber & Auto-Play Dock (Bottom Right) */}
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '2rem',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(10, 15, 25, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '6px 16px',
            borderRadius: '9999px',
            backdropFilter: 'blur(16px)',
          }}>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              style={{
                background: 'none',
                border: 'none',
                color: '#EEEEEE',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
              }}
            >
              {isAutoPlaying ? <Pause size={13} color={activeTheme.hex} /> : <Play size={13} color={activeTheme.hex} />}
              <span>{isAutoPlaying ? "PAUSE" : "AUTO SCRUB"}</span>
            </button>

            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>

            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#94a3b8' }}>
              DEPTH: <strong style={{ color: '#ffffff' }}>{telemetry.progressPercent}%</strong>
            </span>
          </div>

          {/* 7. Scroll Indicator Cue */}
          <motion.div 
            className="scrolly-scroll-indicator"
            style={{
              opacity: scrollIndicatorOpacity
            }}
          >
            <div className="mouse-scroll-icon" />
            <span>SCROLL DOWN TO ACCELERATE & DRIFT</span>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
