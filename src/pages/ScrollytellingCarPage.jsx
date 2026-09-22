import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
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
  Maximize2,
  Sparkles,
  Layers,
  Crosshair
} from 'lucide-react';
import { BorderTrail } from '../components/motion/BorderTrail';
import './Scrollytelling.css';

// High-Definition Cinematic Automotive Racing Video Sources
const VIDEO_SOURCES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
];

// Color Theme accents for the HUD & glowing telemetry
const THEMES = [
  { id: 'cyan', name: 'Cyber Neon Cyan', hex: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
  { id: 'crimson', name: 'Porsche Carmine Red', hex: '#ff0055', glow: 'rgba(255, 0, 85, 0.4)' },
  { id: 'gold', name: 'Solar Titanium Gold', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'emerald', name: 'Hyper Racing Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
];

export const ScrollytellingCarPage = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [videoDuration, setVideoDuration] = useState(15);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Audio Synth references
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Scroll Progress Tracking across 450vh scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3
  });

  // Calculate live telemetry numbers
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    rpm: 1200,
    power: 100,
    gforce: "0.2G",
    progressPercent: 0
  });

  // Handle Video Metadata Loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 15);
      setIsVideoLoaded(true);
    }
  };

  // Synchronize video time with scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (p) => {
      const clampedP = Math.max(0, Math.min(1, p));
      
      // Update video time
      if (videoRef.current && videoRef.current.duration && !isAutoPlaying) {
        const targetTime = clampedP * videoRef.current.duration;
        if (Math.abs(videoRef.current.currentTime - targetTime) > 0.04) {
          videoRef.current.currentTime = targetTime;
        }
      }

      // Update Chapter index
      if (clampedP < 0.25) setActiveChapter(1);
      else if (clampedP < 0.50) setActiveChapter(2);
      else if (clampedP < 0.75) setActiveChapter(3);
      else setActiveChapter(4);

      // Update Telemetry metrics
      setTelemetry({
        speed: Math.round(clampedP * 58),
        rpm: Math.round(1200 + clampedP * 6800),
        power: Math.round(100 - clampedP * 12),
        gforce: `${(0.2 + Math.sin(clampedP * Math.PI) * 1.8).toFixed(1)}G`,
        progressPercent: Math.round(clampedP * 100)
      });

      // Update Audio frequency with speed
      if (isAudioActive && oscRef.current && audioCtxRef.current) {
        const freq = 55 + clampedP * 130;
        oscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.08);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, isAutoPlaying, isAudioActive]);

  // Auto-Play Feature
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
        try { oscRef.current.stop(); oscRef.current.disconnect(); } catch(e) {}
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
        setIsAudioActive(true);
      } catch (err) {
        console.warn('Audio not supported:', err);
      }
    }
  };

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
        backgroundColor: '#000000',
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
          <span className="scrolly-edition-chip">4K SCROLLYTELLING</span>
        </div>

        <div className="scrolly-nav-actions">
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
          { num: 2, label: "02 // 360° DRIFT APEX", frac: 0.35 },
          { num: 3, label: "03 // PILOT TELEMETRY", frac: 0.65 },
          { num: 4, label: "04 // THE GRID COMMENCE", frac: 0.95 },
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

      {/* 4. Main 450vh Scroll Track */}
      <div className="scrolly-stage-track" style={{ height: '460vh' }}>
        {/* The 100vh Sticky Viewport */}
        <div className="scrolly-sticky-stage" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          
          {/* Fullscreen Video Scrubbing Canvas */}
          <div className="scrolly-video-wrapper" style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundColor: '#000000',
          }}>
            <video
              ref={videoRef}
              src="/images/arcade-pass.jpg" // High-res poster fallback
              poster="/images/bumper-cars.jpg"
              preload="auto"
              muted
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.92,
                filter: 'contrast(1.1) brightness(0.95)',
              }}
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
            </video>

            {/* Cinematic Gradient Vignettes */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 90%)',
              pointerEvents: 'none',
              zIndex: 2,
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
              zIndex: 3,
            }} />
          </div>

          {/* ================================================================= */}
          {/* STORY CARDS (APPLE / PORSCHE EDITORIAL TYPOGRAPHY) */}
          {/* ================================================================= */}

          {/* Chapter 1: The Genesis */}
          <motion.div
            className="scrolly-story-card pos-left"
            style={{
              zIndex: 20,
              opacity: useTransform(smoothProgress, [0, 0.05, 0.20, 0.25], [1, 1, 1, 0]),
              x: useTransform(smoothProgress, [0, 0.05, 0.20, 0.25], [0, 0, 0, -40]),
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
              opacity: useTransform(smoothProgress, [0.26, 0.30, 0.45, 0.50], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.26, 0.30, 0.45, 0.50], [40, 0, 0, 40]),
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
              opacity: useTransform(smoothProgress, [0.52, 0.56, 0.70, 0.75], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.52, 0.56, 0.70, 0.75], [-40, 0, 0, -40]),
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
              opacity: useTransform(smoothProgress, [0.80, 0.85, 1], [0, 1, 1]),
              y: useTransform(smoothProgress, [0.80, 0.85, 1], [30, 0, 0]),
            }}
          >
            <BorderTrail size={50} duration={3} />
            <div style={{ textAlign: 'center' }}>
              <span className="story-eyebrow">CHAPTER 04 // ENTER THE BATTLEGROUND</span>
              <h2 className="story-title">READY TO TAKE THE WHEEL?</h2>
              <p className="story-desc" style={{ maxWidth: '520px', margin: '0 auto 1.5rem' }}>
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
              opacity: useTransform(smoothProgress, [0, 0.10], [1, 0])
            }}
          >
            <div className="mouse-scroll-icon" />
            <span>SCROLL TO SCRUB 4K CINEMATIC</span>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
