import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

/**
 * AnimatedGroup component from motion-primitives
 * Animates a list or grid of child elements with customizable stagger & item variants
 */
export const AnimatedGroup = ({
  children,
  className = '',
  variants,
  as = 'div',
  asChild = 'div',
  viewport = { once: true, margin: '-40px' },
}) => {
  const containerVariants = variants?.container || defaultContainerVariants;
  const itemVariants = variants?.item || defaultItemVariants;

  const ContainerComponent = motion[as] || motion.div;
  const ItemComponent = motion[asChild] || motion.div;

  return (
    <ContainerComponent
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ItemComponent key={child.key || index} variants={itemVariants}>
            {child}
          </ItemComponent>
        );
      })}
    </ContainerComponent>
  );
};
