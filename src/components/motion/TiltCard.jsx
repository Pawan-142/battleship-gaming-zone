import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export const TiltCard = ({ 
  children, 
  className = "", 
  tiltDegree = 10, 
  glare = true,
  scale = 1.02,
  onClick 
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 280, mass: 0.4 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltDegree, -tiltDegree]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltDegree, tiltDegree]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  const glareBackground = useMotionTemplate`radial-gradient(circle 320px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 40%, rgba(255, 255, 255, 0) 80%)`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}
    >
      <motion.div
        className="tilt-card-inner"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
        whileHover={{ scale }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        {children}
        {glare && (
          <motion.div
            className="tilt-card-glare"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 'inherit',
              background: glareBackground,
              zIndex: 15,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
