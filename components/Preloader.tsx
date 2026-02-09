import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLHeadingElement>(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Counter Animation
      // We animate a proxy object to allow React state to update via standard GSAP flow
      const progress = { value: 0 };

      gsap.to(progress, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          setCount(Math.round(progress.value));
        },
        onComplete: () => {
          exitAnimation();
        }
      });

    }, containerRef);

    const exitAnimation = () => {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // 2. Text Slide Up / Disappear
      tl.to(counterRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.in"
      })
        // 3. Container Curtain Reveal (Slide Up)
        .to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut"
        }, "-=0.4");
    };

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[10000] flex flex-col justify-end items-end p-4 md:p-10 overflow-hidden cursor-none"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Maximalist Counter */}
        <h1
          ref={counterRef}
          className="font-emblema text-[25vw] leading-none text-white mix-blend-difference select-none"
        >
          {count}%
        </h1>
      </div>
    </div>
  );
};

export default Preloader;