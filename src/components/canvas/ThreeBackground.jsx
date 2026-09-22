import React from 'react';

/**
 * Architectural Luxury Ambient Backdrop (Forge Automotive Style)
 * Pure, high-performance backdrop with zero wireframe or particle clutter.
 */
export const ThreeBackground = () => {
  return (
    <div
      className="architectural-luxury-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 255, 255, 0.04) 0%, transparent 100%)'
      }}
    />
  );
};
