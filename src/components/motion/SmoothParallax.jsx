import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Forge Automotive Style - Smooth Scroll Parallax Layer
 * Creates continuous, buttery smooth scroll translation with spring damping.
 */
export const SmoothParallax = ({
  children,
  offset = 50,
  className = '',
  style = {}
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Smooth out scroll progression with spring interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`smooth-parallax-container ${className}`} style={{ position: 'relative', ...style }}>
      <motion.div style={{ y, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Parallax Background Image Wrapper (Forge Automotive Hero Style)
 * Image sits taller than the container and smoothly pans on scroll.
 */
export const ParallaxImage = ({
  src,
  alt = '',
  className = '',
  speed = 0.25,
  containerHeight = '100%'
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20
  });

  const y = useTransform(smoothProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1.15, 1.08, 1.15]);

  return (
    <div
      ref={containerRef}
      className={`parallax-image-overflow ${className}`}
      style={{
        position: 'relative',
        height: containerHeight,
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '140%',
          position: 'absolute',
          top: '-20%',
          left: 0,
          objectFit: 'cover',
          y,
          scale,
          willChange: 'transform'
        }}
      />
    </div>
  );
};
