import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrambleText from './ScrambleText';

interface HeroProps {
  isLoaded: boolean;
}

const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isLoaded && containerRef.current) {
      const ctx = gsap.context(() => {

        // 1. Background Content Reveal
        gsap.to(".hero-bg-layer", {
          opacity: 1,
          duration: 2,
          ease: "power2.out"
        });

        // 2. Name Entrance (Bottom Up)
        gsap.to(".hero-name-reveal", {
          y: "0%",
          opacity: 1,
          duration: 1.5,
          ease: "power4.out",
          delay: 0.5
        });

        // 3. Role Reveal (Left - Clip Path)
        gsap.to(".hero-role-reveal", {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          autoAlpha: 1,
          duration: 1.5,
          ease: "power3.inOut",
          delay: 1
        }
        );

        // 4. Tagline Reveal (Right)
        gsap.to(".hero-tagline", {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 1.5
        });

      }, containerRef);

      return () => ctx.revert();
    }
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="fixed top-0 left-0 w-full h-screen z-0 flex flex-col justify-between overflow-hidden bg-black text-white"
    >

      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none hero-bg-layer opacity-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-100"
        >
          <source src="/walking.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>


      {/* --- MIDDLE SECTION --- */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-between px-6 md:px-12 lg:px-20 pointer-events-none select-none">

        {/* LEFT: Role (Machine Learning Engineer) */}
        <div className="max-w-md text-left pointer-events-auto">
          <div className="hero-role-reveal invisible" style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}>
            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white/90">
              Machine Learning <br />
              <span className="text-electric-blue-gradient">Engineer</span>
            </h2>
          </div>
          <div className="h-1 w-12 bg-white/30 mt-4 rounded-full hero-role-reveal invisible" style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}></div>
        </div>

        {/* RIGHT: Tagline */}
        <div className="max-w-xs md:max-w-sm text-right hidden md:block pointer-events-auto hero-tagline opacity-0 translate-x-[20px]">
          <p className="font-body text-sm text-white/70 leading-relaxed font-light">
            <ScrambleText
              text="Building the bridge between abstract data algorithms and tangible digital reality."
              delay={2}
              start={isLoaded}
            />
          </p>
        </div>

      </div>


      {/* --- BOTTOM SECTION --- */}
      <div className="relative z-20 w-full pb-0 flex flex-col items-center justify-end select-none">

        {/* SCROLL INDICATOR REMOVED */}

        {/* NAME: JEETHESHWAR */}
        <div className="w-full overflow-hidden text-center translate-y-[3vh]">
          <h1 className="hero-name-reveal text-[12vw] md:text-[13.5vw] font-black-ops text-orange-blue-gradient leading-[0.8] tracking-tighter transition-colors duration-500 uppercase opacity-0 translate-y-full">
            JEETHESHWAR
          </h1>
        </div>
      </div>

    </section>
  );
};

export default Hero;