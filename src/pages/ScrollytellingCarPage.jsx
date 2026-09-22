import React from 'react';
import { Link } from 'react-router-dom';
import { BumperCarCinematic } from '../components/battleship/BumperCarCinematic';
import { ArrowLeft, Calendar, ShieldCheck, Zap } from 'lucide-react';
import '../components/battleship/Battleship.css';

export const ScrollytellingCarPage = () => {
  return (
    <div className="battleship-page" style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000000' }}>
      {/* Floating Top Nav */}
      <header className="scrolly-floating-header" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
        backdropFilter: 'blur(10px)',
      }}>
        <Link 
          to="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            color: '#EEEEEE',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowLeft size={14} />
          <span>BACK TO ARENA</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ 
            fontFamily: 'Cinzel, serif', 
            fontWeight: 700, 
            fontSize: '0.95rem', 
            letterSpacing: '0.2em', 
            color: '#EEEEEE' 
          }}>
            HYPERDRIVE ATELIER
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(203, 41, 87, 0.2)',
            border: '1px solid #CB2957',
            color: '#EEEEEE',
            letterSpacing: '0.1em'
          }}>
            3D SCROLLYTELLING
          </span>
        </div>

        <Link 
          to="/booking?game=bumper-cars" 
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            fontWeight: 700,
            padding: '8px 20px',
            background: '#CB2957',
            color: '#EEEEEE',
            borderRadius: '9999px',
            textDecoration: 'none',
            boxShadow: '0 0 15px rgba(203, 41, 87, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          RESERVE PASS (₹100)
        </Link>
      </header>

      {/* Full Real-time 3D Three.js WebGL Multi-Stage Car Cinematic */}
      <BumperCarCinematic 
        onBookClick={() => {
          window.location.href = '/booking?game=bumper-cars';
        }}
        onExploreClick={() => {
          window.location.href = '/games/bumper-cars';
        }}
      />
    </div>
  );
};
