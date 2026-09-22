import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const GlowEffect = ({
  className = '',
  colors = ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)', 'transparent'],
  mode = 'rotate',
  blur = 'soft',
  scale = 1
}) => {
  const blurMap = {
    soft: 'blur(20px)',
    medium: 'blur(32px)',
    hard: 'blur(48px)'
  };

  return (
    <div
      className={cn(
        'pointer-events-none absolute -inset-1 rounded-[inherit] opacity-75 transition-opacity duration-300',
        className
      )}
      style={{
        filter: blurMap[blur] || blurMap.soft,
        transform: `scale(${scale})`,
        zIndex: 0
      }}
    >
      <motion.div
        className="h-full w-full rounded-[inherit]"
        style={{
          background: `radial-gradient(circle, ${colors.join(', ')})`
        }}
        animate={
          mode === 'rotate'
            ? { rotate: [0, 360] }
            : { opacity: [0.5, 0.9, 0.5] }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};
