import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticButton = ({ 
  children, 
  className = "", 
  strength = 0.28,
  onClick,
  style = {},
  ...props 
}) => {
  const buttonRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 240, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        display: 'inline-flex',
        ...style
      }}
      className={`magnetic-wrapper ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};
