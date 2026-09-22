import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '../../lib/utils';

export const InView = ({
  children,
  className = '',
  variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
  },
  transition = { type: 'spring', damping: 25, stiffness: 120 },
  viewOptions = { once: true, margin: '-50px' },
  as = 'div'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);
  const Component = motion[as] || motion.div;

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </Component>
  );
};
