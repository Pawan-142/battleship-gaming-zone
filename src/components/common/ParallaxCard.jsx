import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Forge Automotive Style - Silky Smooth 3D Physics Parallax Card
 * Powered by motion springs for zero-jitter, fluid cursor tracking and specular glare.
 */
export const ParallaxCard = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.015,
  glow = true,
  glowColor = 'rgba(255, 255, 255, 0.08)',
  onClick
}) => {
  const cardRef = useRef(null);

  // Raw cursor motion values normalized between -0.5 and 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  // Butter-smooth spring damping physics (60fps / 120fps interpolated)
  const springConfig = { stiffness: 180, damping: 22, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const smoothHover = useSpring(isHovered, { stiffness: 240, damping: 24 });

  // 3D rotation and scale transforms
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const cardScale = useTransform(smoothHover, [0, 1], [1, scale]);

  // Dynamic glare coordinates (percentage 0% to 100%)
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [10, 90]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [10, 90]);
  const glareOpacity = useTransform(smoothHover, [0, 1], [0, 1]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    isHovered.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`parallax-tilt-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1200,
        rotateX,
        rotateY,
        scale: cardScale,
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {children}
      {glow && (
        <motion.div
          className="parallax-glare-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            zIndex: 10,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, ${glowColor} 0%, transparent 65%)`
            ),
            opacity: glareOpacity
          }}
        />
      )}
    </motion.div>
  );
};
