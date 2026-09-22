import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const BorderTrail = ({
  className = '',
  size = 60,
  duration = 5,
  color = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)'
}) => {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]', className)}>
      <motion.div
        className="absolute aspect-square"
        style={{
          width: size,
          background: color,
          filter: 'blur(4px)',
          offsetPath: `rect(0 auto auto 0 round var(--radius-xs, 4px))`
        }}
        animate={{
          offsetDistance: ['0%', '100%']
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};
