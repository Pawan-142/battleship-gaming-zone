import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Battery, 
  Gauge, 
  RotateCw, 
  Sparkles,
  Layers,
  ChevronRight,
  Crosshair,
  Calendar
} from 'lucide-react';
import { BorderTrail } from '../components/motion/BorderTrail';
import { SlidingNumber } from '../components/motion/SlidingNumber';
import './Scrollytelling.css';

// Color themes for car underglow and accents
const COLOR_THEMES = [
  { id: 'cyan', name: 'Cyber Neon Cyan', hex: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
  { id: 'violet', name: 'Ultraviolet Phantom', hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  { id: 'amber', name: 'Solar Flare Amber', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'emerald', name: 'Hyper Green Laser', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'crimson', name: 'Obsidian Crimson', hex: '#ff0055', glow: 'rgba(255, 0, 85, 0.4)' },
];

export const ScrollytellingCarPage = () => {
  const containerRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(COLOR_THEMES[0]);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioContextRef = useRef(null);
  const oscRef = useRef(null);

  // Track scroll progression across 480vh track (0.0 to 1.0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring smoothed scroll value for buttery 60fps interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.5
  });

  // ---------------------------------------------------------------------------
  // VEHICLE TRANSFORMATION TIMELINES
  // ---------------------------------------------------------------------------

  // Chapter 1: Side Profile Scale & Position (0.00 -> 0.22)
  const sideViewOpacity = useTransform(smoothProgress, [0, 0.18, 0.25], [1, 1, 0]);
  const sideViewScale = useTransform(smoothProgress, [0, 0.20], [0.95, 1.05]);
  const sideViewX = useTransform(smoothProgress, [0, 0.20], [0, -30]);

  // Chapter 2: Isometric 3/4 Dynamic Angle (0.20 -> 0.45)
  const isoViewOpacity = useTransform(smoothProgress, [0.20, 0.26, 0.42, 0.48], [0, 1, 1, 0]);
  const isoViewScale = useTransform(smoothProgress, [0.20, 0.35], [0.9, 1.08]);
  const isoViewRotateY = useTransform(smoothProgress, [0.20, 0.45], [15, -5]);

  // Chapter 3: Exploded Architecture X-Ray (0.44 -> 0.70)
  const explodedViewOpacity = useTransform(smoothProgress, [0.44, 0.50, 0.66, 0.72], [0, 1, 1, 0]);
  const explodedScale = useTransform(smoothProgress, [0.44, 0.58], [0.85, 1.15]);
  const chassisExplodeOffset = useTransform(smoothProgress, [0.50, 0.65], [0, 40]);

  // Chapter 4: Cockpit Combat Detail (0.68 -> 0.88)
  const cockpitViewOpacity = useTransform(smoothProgress, [0.68, 0.74, 0.85, 0.90], [0, 1, 1, 0]);
  const cockpitScale = useTransform(smoothProgress, [0.68, 0.80], [0.8, 1.25]);

  // Chapter 5: Battle Stance & Full Launch Grid (0.86 -> 1.0)
  const heroActionOpacity = useTransform(smoothProgress, [0.86, 0.92, 1.0], [0, 1, 1]);
  const heroActionScale = useTransform(smoothProgress, [0.86, 1.0], [0.95, 1.05]);

  // Dynamic Telemetry HUD Values calculated from scroll speed & progress
  const speedDisplay = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, 24, 38, 48, 52]);
  const batteryDisplay = useTransform(smoothProgress, [0, 1], [100, 92]);
  const gForceDisplay = useTransform(smoothProgress, [0, 0.35, 0.65, 1], ["0.2G", "1.4G", "0.8G", "1.8G"]);

  // Track active chapter index (1 to 5)
  const [currentChapter, setCurrentChapter] = useState(1);

  useEffect(() => {
    return smoothProgress.onChange((v) => {
      if (v < 0.20) setCurrentChapter(1);
      else if (v < 0.44) setCurrentChapter(2);
      else if (v < 0.68) setCurrentChapter(3);
      else if (v < 0.86) setCurrentChapter(4);
      else setCurrentChapter(5);
    });
  }, [smoothProgress]);

  // Web Audio Synth for subtle futuristic engine drone
  const toggleAudio = () => {
    if (isAudioActive) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        
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

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  const scrollToChapter = (fraction) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: containerRef.current.offsetTop + totalHeight * fraction,
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
      }}
    >
      {/* Floating Minimal Navigation Bar */}
      <header className="scrolly-nav-bar">
        <Link to="/" className="scrolly-back-link">
          <ArrowLeft size={14} />
          <span>BACK TO ARENA</span>
        </Link>

        <div className="scrolly-nav-center">
          <span className="scrolly-brand-badge">HYPERDRIVE ATELIER</span>
          <span className="scrolly-edition-chip">BATTLESHIP MK-IV</span>
        </div>

        <div className="scrolly-nav-actions">
          <button 
            type="button" 
            className={`scrolly-sound-btn ${isAudioActive ? 'active' : ''}`}
            onClick={toggleAudio}
            title={isAudioActive ? "Mute Cyber Drone" : "Enable Spatial Audio"}
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <Link to="/booking?game=bumper-cars" className="scrolly-reserve-btn">
            RESERVE PASS
          </Link>
        </div>
      </header>

      {/* Right Side Chapter Navigation Pip Indicators */}
      <nav className="scrolly-chapter-tracker" aria-label="Story Chapters">
        {[
          { num: 1, label: "01 // DESIGN GENESIS", frac: 0.05 },
          { num: 2, label: "02 // 360° DRIFT VECTORING", frac: 0.30 },
          { num: 3, label: "03 // EXPLODED CHASSIS X-RAY", frac: 0.55 },
          { num: 4, label: "04 // COCKPIT TELEMETRY", frac: 0.77 },
          { num: 5, label: "05 // LAUNCH GRID STANCE", frac: 0.95 },
        ].map((c) => (
          <button
            key={c.num}
            type="button"
            className={`chapter-dot-item ${currentChapter === c.num ? 'active' : ''}`}
            onClick={() => scrollToChapter(c.frac)}
          >
            <span className="chapter-indicator-pip" />
            <span className="chapter-label-pill">{c.label}</span>
          </button>
        ))}
      </nav>

      {/* Left Color Swatch Customizer */}
      <div className="scrolly-color-picker">
        <span className="picker-title">AURA ACCENT</span>
        <div className="picker-swatches">
          {COLOR_THEMES.map((theme) => (
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

      {/* Main 480vh Scroll Canvas Track */}
      <div className="scrolly-stage-track">
        {/* Sticky 100vh Viewport Stage */}
        <div className="scrolly-sticky-stage">
          {/* Ambient Background Grid & Radial Lighting */}
          <div className="scrolly-bg-ambient" />

          {/* Center Stage Vehicle Platform */}
          <div className="scrolly-vehicle-platform">
            {/* Floor Ambient Reflection Pedestal */}
            <div className="scrolly-floor-pedestal" />

            <div className="scrolly-car-media-box">
              {/* Layer 1: Chapter 1 Side Profile View */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: sideViewOpacity,
                  scale: sideViewScale,
                  x: sideViewX,
                }}
              >
                <img 
                  src="/images/battleship/dodgem_side_view.png" 
                  alt="Battleship Bumper Car Side Profile" 
                  className="scrolly-car-img" 
                />

                {/* Hotspot 1: Aerodynamic Carbon Shell */}
                <div 
                  className="scrolly-hotspot" 
                  style={{ top: '35%', left: '42%' }}
                  onMouseEnter={() => setActiveHotspot('shell')}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className="hotspot-beacon" />
                  {activeHotspot === 'shell' && (
                    <div className="hotspot-popover animate-fade-in">
                      <strong>AERO-KINETIC CANOPY</strong>
                      <p>Ultra-dense polycarbonate composite shell engineered for zero deformation upon multi-directional impacts.</p>
                    </div>
                  )}
                </div>

                {/* Hotspot 2: Pneumatic Bumper Ring */}
                <div 
                  className="scrolly-hotspot" 
                  style={{ top: '65%', left: '20%' }}
                  onMouseEnter={() => setActiveHotspot('bumper')}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className="hotspot-beacon" />
                  {activeHotspot === 'bumper' && (
                    <div className="hotspot-popover animate-fade-in">
                      <strong>360° PNEUMATIC COLLAR</strong>
                      <p>Pressurized nitrogen bumper ring absorbs 94% of kinetic shock for smooth elastic rebounds.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Layer 2: Chapter 2 Isometric 3/4 Dynamic Drift Angle */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isoViewOpacity,
                  scale: isoViewScale,
                  rotateY: isoViewRotateY,
                }}
              >
                <img 
                  src="/images/battleship/dodgem_isometric_view.png" 
                  alt="Battleship Bumper Car 3D Isometric View" 
                  className="scrolly-car-img" 
                />

                {/* Hotspot 3: Dual Brushless Motor */}
                <div 
                  className="scrolly-hotspot" 
                  style={{ top: '60%', left: '55%' }}
                  onMouseEnter={() => setActiveHotspot('motor')}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className="hotspot-beacon" />
                  {activeHotspot === 'motor' && (
                    <div className="hotspot-popover animate-fade-in">
                      <strong>DUAL BRUSHLESS MOTORS</strong>
                      <p>48V high-torque dual motors deliver instant 360° spin authority and frictionless drifts.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Layer 3: Chapter 3 Exploded Chassis X-Ray Architecture */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: explodedViewOpacity,
                  scale: explodedScale,
                }}
              >
                <img 
                  src="/images/battleship/dodgem_exploded_view.png" 
                  alt="Battleship Bumper Car Exploded Architecture" 
                  className="scrolly-car-img" 
                />

                {/* Hotspot 4: Lithium Battery Pack */}
                <div 
                  className="scrolly-hotspot" 
                  style={{ top: '45%', left: '50%' }}
                  onMouseEnter={() => setActiveHotspot('battery')}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className="hotspot-beacon" />
                  {activeHotspot === 'battery' && (
                    <div className="hotspot-popover animate-fade-in">
                      <strong>1.2 kWh LiFePO4 POWER CELL</strong>
                      <p>Sub-floor mounted battery pack lowers center of gravity by 40% to eliminate any rollover risk.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Layer 4: Chapter 4 Cockpit Detail */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cockpitViewOpacity,
                  scale: cockpitScale,
                }}
              >
                <img 
                  src="/images/battleship/battleship_cockpit_detail_1790013007746.jpg" 
                  alt="Battleship Cockpit Detail" 
                  className="scrolly-car-img"
                  style={{ borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                />
              </motion.div>

              {/* Layer 5: Chapter 5 Battle Stance & Full Launch */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: heroActionOpacity,
                  scale: heroActionScale,
                }}
              >
                <img 
                  src="/images/battleship/battleship_bumper_hero_1790012986302.jpg" 
                  alt="Battleship Bumper Car Ready for Arena" 
                  className="scrolly-car-img"
                  style={{ borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                />
              </motion.div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* STORY CARDS (SYNCHRONIZED WITH CHAPTER TIMELINE) */}
          {/* ================================================================= */}

          {/* Story Card 1: The Reveal */}
          <motion.div
            className="scrolly-story-card pos-left"
            style={{
              opacity: useTransform(smoothProgress, [0, 0.05, 0.18, 0.22], [1, 1, 1, 0]),
              x: useTransform(smoothProgress, [0, 0.05, 0.18, 0.22], [0, 0, 0, -40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 01 // ARCHITECTURAL REVEAL</span>
            <h2 className="story-title">BORN FOR DRIFT. SCALED FOR IMPACT.</h2>
            <p className="story-desc">
              Witness the commercial dodgem pod reimagined from the ground up. Aerospace-grade lightweight alloys, low center of gravity, and 360° omnidirectional maneuverability.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">360°</span>
                <span className="metric-lbl">Omni-Drift Axis</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">Electric High-Torque</span>
              </div>
            </div>
          </motion.div>

          {/* Story Card 2: 360 Powertrain */}
          <motion.div
            className="scrolly-story-card pos-right"
            style={{
              opacity: useTransform(smoothProgress, [0.22, 0.26, 0.40, 0.44], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.22, 0.26, 0.40, 0.44], [40, 0, 0, 40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 02 // DUAL-MOTOR TORQUE</span>
            <h2 className="story-title">ZERO LATENCY. INSTANT TRACTION.</h2>
            <p className="story-desc">
              Dual 48V brushless induction motors allow independent wheel drive vectoring. Execute instant pirouettes, pendulum drifts, and tactical avoidance maneuver with zero input lag.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">48V</span>
                <span className="metric-lbl">Brushless Drive</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">0.02s</span>
                <span className="metric-lbl">Response Delay</span>
              </div>
            </div>
          </motion.div>

          {/* Story Card 3: Exploded Chassis X-Ray */}
          <motion.div
            className="scrolly-story-card pos-left"
            style={{
              opacity: useTransform(smoothProgress, [0.46, 0.50, 0.64, 0.68], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.46, 0.50, 0.64, 0.68], [-40, 0, 0, -40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 03 // STRUCTURAL INTEGRITY</span>
            <h2 className="story-title">PNEUMATIC ARMOR. UNCOMPROMISED SAFETY.</h2>
            <p className="story-desc">
              The internal roll-cage is seamlessly bonded with high-density nitrogen cushion collars and an insulated sub-chassis battery vault for maximum rider peace of mind.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">94%</span>
                <span className="metric-lbl">Kinetic Dissipation</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">IP67</span>
                <span className="metric-lbl">Chassis Ingress Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Story Card 4: Cockpit */}
          <motion.div
            className="scrolly-story-card pos-right"
            style={{
              opacity: useTransform(smoothProgress, [0.70, 0.74, 0.84, 0.88], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.70, 0.74, 0.84, 0.88], [40, 0, 0, 40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 04 // TACTICAL PILOT COCKPIT</span>
            <h2 className="story-title">DUAL JOYSTICKS. INTUITIVE MASTERY.</h2>
            <p className="story-desc">
              Ergonomic bucket seat with 5-point harness safety locks, dual precision micro-switch flight sticks, and ambient digital HUD telemetry display.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">5-Point</span>
                <span className="metric-lbl">Safety Harness</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">Dual-Stick</span>
                <span className="metric-lbl">Tactical Control</span>
              </div>
            </div>
          </motion.div>

          {/* Story Card 5: Final CTA */}
          <motion.div
            className="scrolly-story-card pos-bottom"
            style={{
              opacity: useTransform(smoothProgress, [0.90, 0.94, 1], [0, 1, 1]),
              y: useTransform(smoothProgress, [0.90, 0.94, 1], [30, 0, 0]),
            }}
          >
            <BorderTrail size={50} duration={3} />
            <div style={{ textAlign: 'center' }}>
              <span className="story-eyebrow">CHAPTER 05 // ARENA COMMISSION</span>
              <h2 className="story-title">READY TO TAKE THE PILOT'S SEAT?</h2>
              <p className="story-desc" style={{ maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                Join the live bumper car battles at Hyderabad’s flagship Inorbit Mall or Sarath City Capital arena. Lock your session pass for only ₹100 deposit.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/booking?game=bumper-cars" className="btn btn-cyber btn-cyber-primary btn-lg">
                  <Calendar size={18} />
                  <span>RESERVE ATTRACTION PASS (FROM ₹100)</span>
                </Link>
                <Link to="/games" className="btn btn-cyber btn-cyber-outline btn-lg">
                  <span>EXPLORE ALL 6 ARENA GAMES</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Live Telemetry HUD Bottom Bar */}
          <div className="scrolly-hud-dock">
            <div className="hud-pill-item">
              <span className="hud-pulse-dot" />
              <span>TELEMETRY: <strong>LIVE</strong></span>
            </div>
            <div className="hud-pill-item">
              <Gauge size={13} style={{ color: activeTheme.hex }} />
              <span>DRIFT SPEED: <strong>{Math.round(speedDisplay.get())} KM/H</strong></span>
            </div>
            <div className="hud-pill-item">
              <Battery size={13} style={{ color: '#10b981' }} />
              <span>POWER: <strong>{Math.round(batteryDisplay.get())}%</strong></span>
            </div>
            <div className="hud-pill-item">
              <Compass size={13} style={{ color: activeTheme.hex }} />
              <span>G-FORCE: <strong>{gForceDisplay.get()}</strong></span>
            </div>
          </div>

          {/* Scroll Prompt Indicator */}
          <motion.div 
            className="scrolly-scroll-indicator"
            style={{
              opacity: useTransform(smoothProgress, [0, 0.12], [1, 0])
            }}
          >
            <div className="mouse-scroll-icon" />
            <span>SCROLL TO EXPLORE</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
