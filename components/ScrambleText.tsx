import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  start?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 1.5,
  start = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Keep track of the animation progress
  const progressRef = useRef(0);

  useEffect(() => {
    if (!start) {
      setDisplayText('');
      return;
    }

    const length = text.length;

    // Initial state: empty or random chars
    setDisplayText('');

    const ctx = gsap.context(() => {
      // Main animation tween
      gsap.to(progressRef, {
        current: 1,
        duration: duration,
        delay: delay,
        ease: 'power2.inOut',
        onStart: () => {
          setIsRevealed(true);
        },
        onUpdate: () => {
          const progress = progressRef.current;
          let result = '';

          for (let i = 0; i < length; i++) {
            // Determine if this character should be revealed based on progress
            // We stagger the reveal so it goes left-to-right but with some randomness
            const charProgress = i / length;
            // The "window" of scrambling moves across the string
            const revealThreshold = progress * 1.5; // Multiplier to ensure it finishes

            if (revealThreshold > charProgress + 0.2) {
              // Fully revealed
              result += text[i];
            } else if (revealThreshold > charProgress) {
              // Currently scrambling (in the "decoding" window)
              result += CHARS[Math.floor(Math.random() * CHARS.length)];
            } else {
              // Not yet reached (optional: hide or show random)
              // Showing random looks cooler for "matrix" style
              // result += CHARS[Math.floor(Math.random() * CHARS.length)];
              // But for cleaner look, let's keep it empty or space until the "wave" hits
              result += ' '; // or nothing
            }
          }
          setDisplayText(result);
        },
        onComplete: () => {
          setDisplayText(text); // Ensure final state is perfect
        }
      });
    }, elementRef);

    return () => ctx.revert();
  }, [text, delay, duration, start]);

  return (
    <span ref={elementRef} className={`${className} inline-block font-mono`}>
      {displayText}
    </span>
  );
};

export default ScrambleText;
