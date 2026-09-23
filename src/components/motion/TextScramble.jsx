import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?/';

export const TextScramble = ({
  children,
  duration = 800,
  speed = 40,
  characterSet = CYBER_CHARS,
  className = '',
  as: Component = 'span',
  trigger = true
}) => {
  const text = typeof children === 'string' ? children : '';
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!trigger || !text) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const totalFrames = Math.max(1, Math.floor(duration / speed));

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      const scrambled = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index / text.length < progress) {
            return text[index];
          }
          return characterSet[Math.floor(Math.random() * characterSet.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, duration, speed, characterSet]);

  return <Component className={cn('inline-block font-mono tracking-wider', className)}>{displayText}</Component>;
};
