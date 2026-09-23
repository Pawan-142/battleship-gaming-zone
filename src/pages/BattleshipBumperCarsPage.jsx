import { useState, useEffect, useRef } from 'react';
import { BattleshipHeader } from '../components/battleship/BattleshipHeader';
import { BumperCarCinematic } from '../components/battleship/BumperCarCinematic';
import { BattleshipBookingPanel } from '../components/battleship/BattleshipBookingPanel';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import '../components/battleship/Battleship.css';

export const BattleshipBumperCarsPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const expSectionRef = useRef(null);
  const specsRef = useRef(null);
  const galleryRef = useRef(null);

  // High-performance scroll parallax tracker
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToExperiences = () => {
    const el = document.getElementById('experiences');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to calculate parallax offset relative to a section
  const getParallaxOffset = (elementRef, speed = 0.15) => {
    if (!elementRef.current) return 0;
    const rect = elementRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementMiddle = rect.top + rect.height / 2;
    const screenMiddle = windowHeight / 2;
    return (screenMiddle - elementMiddle) * speed;
  };

  const expParallax = getParallaxOffset(expSectionRef, 0.14);
  const watermarkParallax = getParallaxOffset(expSectionRef, 0.28);
  const galleryParallax = getParallaxOffset(galleryRef, 0.18);

  return (
    <div className="battleship-page">
      {/* 1. Header Navigation */}
      <BattleshipHeader onBookClick={scrollToBooking} />

      {/* 2. Scroll-Driven Cinematic Hero (Featuring the 3D Dodgem matching your blueprint) */}
      <BumperCarCinematic onBookClick={scrollToBooking} onExploreClick={scrollToExperiences} />

      {/* 3. EXPERIENCE METHOD: 01 RIDE, 02 BUMP, 03 REPEAT with Parallax */}
      <section id="experiences" ref={expSectionRef} className="bs-section">
        
        {/* Floating Parallax Watermark Text */}
        <div
          className="bs-watermark"
          style={{
            top: '15%',
            right: '-5%',
            transform: `translate3d(0, ${watermarkParallax * 1.2}px, 0)`,
          }}
        >
          BATTLESHIP
        </div>

        <div className="bs-container">
          
          {/* Section Header */}
          <div className="bs-section-header">
            <div>
              <span className="bs-section-tag">
                The Battleship Method
              </span>
              <h2 className="bs-section-title">
                The Experience
              </h2>
            </div>
            <p className="bs-section-desc">
              No virtual headsets. No simulated vibration. Real physical collisions, instant electric torque, and unfiltered kinetic adrenaline.
            </p>
          </div>

          {/* 3 Large Editorial Experience Blocks with Parallax Imagery */}
          <div className="bs-grid-3">
            
            {/* Block 01: RIDE */}
            <div className="bs-card-exp">
              <div className="bs-card-img-wrap">
                <img
                  src="/images/battleship/battleship_cockpit_detail_1790013007746.jpg"
                  alt="Battleship Bumper Car Cockpit & Steering"
                  className="bs-card-img-parallax"
                  style={{
                    transform: `translate3d(0, ${expParallax * 0.85}px, 0) scale(1.15)`,
                  }}
                />
                <div className="bs-card-phase-badge">
                  Phase 01
                </div>
              </div>

              <div className="bs-card-body">
                <div>
                  <span className="bs-card-num">01 / 03</span>
                  <h3 className="bs-card-title">
                    Ride
                  </h3>
                  <p className="bs-card-text">
                    Step into custom-molded metallic wine fiberglass cockpits with 45° steering and 48V instantaneous electric torque delivery.
                  </p>
                </div>
                <div className="bs-card-footer">
                  <span>PRE-GRID BRIEFING</span>
                  <span>PIT LANE 1</span>
                </div>
              </div>
            </div>

            {/* Block 02: BUMP */}
            <div className="bs-card-exp" style={{ transform: `translate3d(0, ${expParallax * -0.2}px, 0)` }}>
              <div className="bs-card-img-wrap">
                <img
                  src="/images/battleship/battleship_bump_action_1790013025764.jpg"
                  alt="Battleship Bumper Cars Colliding in Arena"
                  className="bs-card-img-parallax"
                  style={{
                    transform: `translate3d(0, ${expParallax * 1.05}px, 0) scale(1.15)`,
                  }}
                />
                <div className="bs-card-phase-badge">
                  Phase 02
                </div>
              </div>

              <div className="bs-card-body">
                <div>
                  <span className="bs-card-num">02 / 03</span>
                  <h3 className="bs-card-title">
                    Bump
                  </h3>
                  <p className="bs-card-text">
                    Challenge your friends and collide. Heavy pneumatic polyurethane surrounds dissipate impact energy while delivering the satisfying crunch of direct contact.
                  </p>
                </div>
                <div className="bs-card-footer">
                  <span>KINETIC IMPACT</span>
                  <span>100% REBOUND</span>
                </div>
              </div>
            </div>

            {/* Block 03: REPEAT */}
            <div className="bs-card-exp">
              <div className="bs-card-img-wrap">
                <img
                  src="/images/battleship/battleship_repeat_friends_1790013048961.jpg"
                  alt="Friends Celebrating at Battleship Hyderabad"
                  className="bs-card-img-parallax"
                  style={{
                    transform: `translate3d(0, ${expParallax * 0.9}px, 0) scale(1.15)`,
                  }}
                />
                <div className="bs-card-phase-badge">
                  Phase 03
                </div>
              </div>

              <div className="bs-card-body">
                <div>
                  <span className="bs-card-num">03 / 03</span>
                  <h3 className="bs-card-title">
                    Repeat
                  </h3>
                  <p className="bs-card-text">
                    Keep the adrenaline flowing. Regroup at the mezzanine lounge, check lap collision stats on the leaderboard, and queue up for back-to-back heats.
                  </p>
                </div>
                <div className="bs-card-footer">
                  <span>UNLIMITED HEATS</span>
                  <span>LOUNGE ACCESS</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Engineering & Physical Arena Specs Matrix */}
      <section id="specs" ref={specsRef} className="bs-section" style={{ backgroundColor: 'var(--bs-bg-1)', borderTop: 'var(--border-subtle)', borderBottom: 'var(--border-subtle)' }}>
        
        {/* Background Specs Watermark */}
        <div
          className="bs-watermark"
          style={{
            bottom: '5%',
            left: '-2%',
            transform: `translate3d(0, ${getParallaxOffset(specsRef, 0.22)}px, 0)`,
          }}
        >
          12,000 SQFT
        </div>

        <div className="bs-container">
          
          <div style={{ maxWidth: '800px', marginBottom: '72px' }}>
            <span className="bs-section-tag">
              Engineering & Architecture
            </span>
            <h2 className="bs-section-title">
              Engineered to collide.
            </h2>
            <p className="bs-section-desc" style={{ marginTop: '16px', maxWidth: '600px' }}>
              Designed from the ground up to offer the most responsive, safe, and exhilarating bumper car arena in India.
            </p>
          </div>

          <div className="bs-grid-4">
            
            <div className="bs-spec-card">
              <div className="bs-spec-num">
                12k<span className="bs-spec-unit">SQFT</span>
              </div>
              <div>
                <h4 className="bs-spec-title">Mirror Epoxy Deck</h4>
                <p className="bs-spec-desc">
                  High-friction polished epoxy flooring engineered specifically for controlled drifts, slides, and instantaneous 360-degree pivots.
                </p>
              </div>
            </div>

            <div className="bs-spec-card">
              <div className="bs-spec-num">
                48<span className="bs-spec-unit">VOLT</span>
              </div>
              <div>
                <h4 className="bs-spec-title">Dual Electric Motors</h4>
                <p className="bs-spec-desc">
                  Brushless dual-motor propulsion offering instant torque response with zero indoor fumes, minimal noise, and maximum acceleration.
                </p>
              </div>
            </div>

            <div className="bs-spec-card">
              <div className="bs-spec-num">
                360<span className="bs-spec-unit">&deg;</span>
              </div>
              <div>
                <h4 className="bs-spec-title">Twin Joystick Control</h4>
                <p className="bs-spec-desc">
                  True omnidirectional agility. Spin in place, drift sideways, or charge directly with responsive tactile joystick feedback.
                </p>
              </div>
            </div>

            <div className="bs-spec-card">
              <div className="bs-spec-num">
                94<span className="bs-spec-unit">%</span>
              </div>
              <div>
                <h4 className="bs-spec-title">Kinetic Absorption</h4>
                <p className="bs-spec-desc">
                  High-density vulcanized rubber pneumatic collars provide maximum impact cushioning, certified for all driver age brackets.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Venue Photography Showcase / Gallery with Deep Parallax */}
      <section id="gallery" ref={galleryRef} className="bs-section">
        <div className="bs-container">
          
          <div className="bs-section-header">
            <div>
              <span className="bs-section-tag">
                Atmosphere &bull; Jubilee Hills
              </span>
              <h2 className="bs-section-title">
                Inside Battleship
              </h2>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--bs-gray-mute)' }}>
              ROAD NO. 36 &bull; HYDERABAD
            </span>
          </div>

          {/* Luxury Large Visual Frame with Parallax Image Depth */}
          <div className="bs-gallery-frame">
            <img
              src="/images/battleship/battleship_bumper_hero_1790012986302.jpg"
              alt="Battleship Hyderabad Bumper Car Arena Main Floor"
              className="bs-gallery-img-parallax"
              style={{
                transform: `translate3d(0, ${galleryParallax}px, 0) scale(1.16)`,
              }}
            />
            <div className="bs-gallery-overlay">
              <div>
                <span className="bs-section-tag" style={{ marginBottom: '6px' }}>
                  The Main Arena Deck
                </span>
                <p style={{ color: 'var(--bs-gray)', fontSize: '14px', margin: 0, maxWidth: '520px', lineHeight: 1.6 }}>
                  Full view of the active track with overhead industrial lighting and mezzanine viewing lounge.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Booking Panel Section */}
      <BattleshipBookingPanel />

      {/* 7. Physical Venue Location & Hours */}
      <section id="location" className="bs-section" style={{ backgroundColor: 'var(--bs-bg-1)', borderTop: 'var(--border-subtle)' }}>
        <div className="bs-container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <span className="bs-section-tag">Venue & Logistics</span>
                <h2 className="bs-section-title" style={{ fontSize: ' clamp(36px, 4.5vw, 56px)', marginTop: '8px' }}>
                  Visit Battleship
                </h2>
                <p className="bs-section-desc" style={{ marginTop: '14px' }}>
                  Located in the heart of Jubilee Hills with dedicated valet parking, elevated spectator lounges, and private party mezzanine suites.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingTop: '20px', borderTop: 'var(--border-subtle)' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <MapPin size={18} color="var(--bs-crimson)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <h5 style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--bs-white)', margin: 0 }}>
                      Physical Address
                    </h5>
                    <p style={{ color: 'var(--bs-gray)', fontSize: '13px', margin: '4px 0 0', lineHeight: 1.6 }}>
                      Battleship Entertainment Arena, Plot 492, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
                    </p>
                    <span style={{ fontSize: '10px', color: 'var(--bs-gray-mute)', fontFamily: 'var(--font-mono)', display: 'block', marginTop: '2px' }}>
                      (Opposite Peddamma Temple Metro Station &bull; Pillar 1680)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Clock size={18} color="var(--bs-crimson)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <h5 style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--bs-white)', margin: 0 }}>
                      Operational Hours
                    </h5>
                    <p style={{ color: 'var(--bs-gray)', fontSize: '13px', margin: '4px 0 0' }}>
                      Monday &ndash; Friday: 1:00 PM &ndash; 12:00 Midnight
                    </p>
                    <p style={{ color: 'var(--bs-gray)', fontSize: '13px', margin: '2px 0 0' }}>
                      Saturday &ndash; Sunday: 11:00 AM &ndash; 1:00 AM
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Phone size={18} color="var(--bs-gray)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <h5 style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--bs-white)', margin: 0 }}>
                      Concierge & Inquiries
                    </h5>
                    <p style={{ color: 'var(--bs-gray)', fontSize: '13px', margin: '4px 0 0', fontFamily: 'var(--font-mono)' }}>
                      +91 40 6828 9900 &bull; reservations@battleshiparena.in
                    </p>
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bs-btn-forge-crimson"
                >
                  <Navigation size={13} />
                  <span>Open in Google Maps</span>
                </a>
                <button
                  onClick={scrollToBooking}
                  className="bs-btn-forge"
                >
                  Reserve Track Slot
                </button>
              </div>

            </div>

            {/* Right Deck Info Card */}
            <div style={{ backgroundColor: 'var(--bs-bg-card)', border: 'var(--border-card)', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--border-subtle)', paddingBottom: '18px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bs-gray-mute)' }}>
                  Arena Deck Status
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--bs-crimson)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="bs-live-dot"></span>
                  Optimal Deck Grip
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <div style={{ backgroundColor: 'var(--bs-black)', padding: '18px', border: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--bs-gray-mute)', display: 'block', fontSize: '9px', letterSpacing: '0.15em' }}>TRACK CAPACITY</span>
                  <span style={{ color: 'var(--bs-white)', fontWeight: 600, fontSize: '13px', marginTop: '4px', display: 'block' }}>12 Active Cars</span>
                </div>
                <div style={{ backgroundColor: 'var(--bs-black)', padding: '18px', border: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--bs-gray-mute)', display: 'block', fontSize: '9px', letterSpacing: '0.15em' }}>HEAT CADENCE</span>
                  <span style={{ color: 'var(--bs-white)', fontWeight: 600, fontSize: '13px', marginTop: '4px', display: 'block' }}>Every 15 Mins</span>
                </div>
                <div style={{ backgroundColor: 'var(--bs-black)', padding: '18px', border: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--bs-gray-mute)', display: 'block', fontSize: '9px', letterSpacing: '0.15em' }}>VALET PARKING</span>
                  <span style={{ color: 'var(--bs-white)', fontWeight: 600, fontSize: '13px', marginTop: '4px', display: 'block' }}>Available (Free)</span>
                </div>
                <div style={{ backgroundColor: 'var(--bs-black)', padding: '18px', border: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--bs-gray-mute)', display: 'block', fontSize: '9px', letterSpacing: '0.15em' }}>F&B LOUNGE</span>
                  <span style={{ color: 'var(--bs-white)', fontWeight: 600, fontSize: '13px', marginTop: '4px', display: 'block' }}>Craft Kitchen Open</span>
                </div>
              </div>

              <div style={{ padding: '18px', backgroundColor: 'rgba(203, 41, 87, 0.08)', border: '1px solid rgba(203, 41, 87, 0.25)', fontSize: '12px', color: 'var(--bs-gray)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--bs-white)', display: 'block', marginBottom: '2px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Safety Requirement
                </strong>
                Drivers must be at least 48 inches (122 cm) tall. Seatbelts and pre-grid briefing are mandatory for every heat.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Minimal Luxury Footer */}
      <footer style={{ padding: '56px 0', backgroundColor: 'var(--bs-black)', borderTop: 'var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bs-gray-mute)' }}>
        <div className="bs-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/images/battleship/battleship_logo.jpg" 
              alt="Battleship Gaming Zone" 
              style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                border: '1.5px solid #00f0ff', 
                objectFit: 'cover',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--bs-white)', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '14px' }}>
                  BATTLESHIP GAMING ZONE
                </span>
              </div>
              <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(221,221,221,0.6)', textTransform: 'uppercase' }}>
                Physical Entertainment &bull; Hyderabad, India
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '28px', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            <button onClick={scrollToExperiences} style={{ background: 'transparent', border: 'none', color: 'var(--bs-gray)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '10px' }}>
              Experience
            </button>
            <button onClick={scrollToBooking} style={{ background: 'transparent', border: 'none', color: 'var(--bs-gray)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '10px' }}>
              Reserve
            </button>
            <a href="#location" style={{ color: 'var(--bs-gray)', textDecoration: 'none' }}>
              Location
            </a>
          </div>

          <div style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(221,221,221,0.4)' }}>
            &copy; {new Date().getFullYear()} BATTLESHIP ARENA HYDERABAD. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

    </div>
  );
};
