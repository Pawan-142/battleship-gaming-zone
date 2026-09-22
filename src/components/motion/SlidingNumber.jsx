import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { cn } from '../../lib/utils';

export const SlidingNumber = ({
  value,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => {
    if (numericValue % 1 !== 0) {
      return current.toFixed(1);
    }
    return Math.floor(current).toLocaleString();
  });

  const [renderedValue, setRenderedValue] = useState(prefix + '0' + suffix);

  useEffect(() => {
    spring.set(numericValue);
  }, [spring, numericValue]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setRenderedValue(`${prefix}${latest}${suffix}`);
    });
  }, [display, prefix, suffix]);

  return <span className={cn('font-mono font-bold tracking-tight', className)}>{renderedValue}</span>;
};
