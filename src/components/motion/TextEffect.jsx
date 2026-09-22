import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

const presetVariants = {
  fade: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
      exit: {
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
      },
    },
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  'fade-in-blur': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
      exit: {
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 12, filter: 'blur(10px)' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring', damping: 20, stiffness: 180 },
      },
      exit: { opacity: 0, y: -12, filter: 'blur(10px)' },
    },
  },
  'blur-sm': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
      },
      exit: {
        opacity: 0,
        transition: { staggerChildren: 0.04, staggerDirection: -1 },
      },
    },
    item: {
      hidden: { opacity: 0, filter: 'blur(6px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(6px)' },
    },
  },
  scale: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
      exit: {
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
      },
    },
    item: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', damping: 15, stiffness: 200 },
      },
      exit: { opacity: 0, scale: 0.5 },
    },
  },
  slide: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
      },
      exit: {
        opacity: 0,
        transition: { staggerChildren: 0.06, staggerDirection: -1 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', damping: 20, stiffness: 150 },
      },
      exit: { opacity: 0, y: -20 },
    },
  },
};

/**
 * TextEffect component from motion-primitives
 * Animates text per character, word, or line with preset animations or custom variants.
 */
export const TextEffect = ({
  children,
  per = 'word',
  as = 'p',
  variants,
  className = '',
  preset = 'fade-in-blur',
  delay = 0,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName = '',
  style,
  containerTransition,
  segmentTransition,
  speedReveal = 1,
  speedSegment = 1,
}) => {
  const text = typeof children === 'string' ? children : '';
  const Component = motion[as] || motion.p;

  let segments = [];
  if (per === 'char') {
    segments = text.split('');
  } else if (per === 'line') {
    segments = text.split('\n');
  } else {
    segments = text.split(' ');
  }

  const activePreset = presetVariants[preset] || presetVariants['fade-in-blur'];
  const containerVariants = variants?.container || activePreset.container;
  const itemVariants = variants?.item || activePreset.item;

  const adjustedContainer = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...containerVariants.visible?.transition,
        delayChildren: delay,
        staggerChildren:
          (containerVariants.visible?.transition?.staggerChildren || 0.05) / speedReveal,
        ...containerTransition,
      },
    },
  };

  const adjustedItem = {
    ...itemVariants,
    visible: {
      ...itemVariants.visible,
      transition: {
        ...itemVariants.visible?.transition,
        duration: (itemVariants.visible?.transition?.duration || 0.3) / speedSegment,
        ...segmentTransition,
      },
    },
  };

  return (
    <AnimatePresence>
      {trigger && (
        <Component
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={adjustedContainer}
          onAnimationStart={onAnimationStart}
          onAnimationComplete={onAnimationComplete}
          className={cn('inline-flex flex-wrap', className)}
          style={style}
        >
          {segments.map((segment, index) => (
            <motion.span
              key={index}
              variants={adjustedItem}
              className={cn('inline-block whitespace-pre', segmentWrapperClassName)}
            >
              {segment}
              {per === 'word' && index < segments.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </Component>
      )}
    </AnimatePresence>
  );
};
