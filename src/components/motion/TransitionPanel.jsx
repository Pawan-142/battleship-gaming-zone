import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

const defaultVariants = {
  enter: { opacity: 0, y: -20, filter: 'blur(4px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: 20, filter: 'blur(4px)' },
};

const defaultTransition = {
  duration: 0.25,
  ease: 'easeInOut',
};

/**
 * TransitionPanel component from motion-primitives
 * Animates switching between panels/tabs with customizable enter/center/exit variants
 */
export const TransitionPanel = ({
  activeIndex,
  children,
  className = '',
  transition = defaultTransition,
  variants = defaultVariants,
  mode = 'popLayout',
  ...props
}) => {
  const childArray = React.Children.toArray(children);
  const activeChild = childArray[activeIndex];

  return (
    <div className={cn('relative w-full overflow-hidden', className)} {...props}>
      <AnimatePresence mode={mode} initial={false}>
        {activeChild && (
          <motion.div
            key={activeChild.key || activeIndex}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={transition}
            className="w-full"
          >
            {activeChild}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
