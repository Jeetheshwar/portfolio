'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SkillsMarquee: React.FC = () => {
  const firstText = useRef<HTMLParagraphElement>(null);
  const secondText = useRef<HTMLParagraphElement>(null);
  const slider = useRef<HTMLDivElement>(null);

  // State refs to modify inside the animation loop without re-renders
  const xPercent = useRef(0);
  const direction = useRef(-1); // -1 = left, 1 = right

  useEffect(() => {
    let requestAnimationId: number;

    const animate = () => {
      if (xPercent.current <= -100) {
        xPercent.current = 0;
      }
      if (xPercent.current > 0) {
        xPercent.current = -100;
      }

      if (firstText.current && secondText.current) {
        gsap.set(firstText.current, { xPercent: xPercent.current });
        gsap.set(secondText.current, { xPercent: xPercent.current });
      }

      // Base speed * direction
      // We can make speed dynamic based on scroll velocity later if needed, 
      // but just reversing direction is already a huge "premium" feel.
      xPercent.current += 0.05 * direction.current;

      requestAnimationId = requestAnimationFrame(animate);
    };

    // Start loop
    requestAnimationId = requestAnimationFrame(animate);

    // ScrollTrigger to detect direction and velocity
    // We bind it to the whole page scrolling
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        // self.direction returns 1 (down) or -1 (up)
        // We want the marquee to move Left (-1) when scrolling Down (1)
        // And Right (1) when scrolling Up (-1)
        // So direction = self.direction * -1
        direction.current = self.direction * -1;

        // Bonus: Velocity multiplier
        // If scrolling fast, boost the xPercent change temporarily? 
        // For now, let's keep it simple with just direction reversal which is silky smooth.
      }
    });

    return () => {
      cancelAnimationFrame(requestAnimationId);
      trigger.kill();
    };
  }, []);

  const text = "Deep Learning — Neural Networks — Computer Vision — NLP — Python — Tensor Flow — PyTorch — Generative AI — Data Science — ";

  return (
    <div className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm relative z-20 rotate-[-2deg] scale-110 my-12 overflow-hidden flex">
      {/* Slider container */}
      <div ref={slider} className="relative whitespace-nowrap flex">
        {/* Text Block 1 */}
        <p ref={firstText} className="relative text-4xl md:text-6xl font-display font-bold uppercase text-transparent outline-text m-0 pr-12">
          {text}
        </p>
        {/* Text Block 2 (Clone for seamless loop) */}
        <p ref={secondText} className="absolute left-full top-0 text-4xl md:text-6xl font-display font-bold uppercase text-transparent outline-text m-0 pr-12">
          {text}
        </p>
      </div>
    </div>
  );
};

export default SkillsMarquee;