import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const TiltCard = ({ 
  children, 
  className = "", 
  tiltDegree = 6, 
  glare = false,
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
        position: 'relative',
      }}
    >
      <motion.div
        className="tilt-card-inner"
        style={{
          rotateX,
          rotateY,
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
        whileHover={{ scale }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
