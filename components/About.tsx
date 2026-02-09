import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Asterisk, Code, Zap, Globe, Cpu } from 'lucide-react'; // Import Symbols
import MagneticText from './MagneticText';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Horizontal Drift for massive text - HEAVY SCRUB
      gsap.to(textRef.current, {
        x: "-20%",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5 // Heavy inertia
        }
      });

      // Main Headers Reveal (Masking Effect + Unblur)
      gsap.from(".about-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", // Triggers when top of section hits 60% of viewport
        },
        y: "100%", // Slide up from fully masked
        filter: "blur(10px)", // Start blurred
        rotate: 2, // Slight rotation for premium feel
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        onComplete: () => {
          gsap.to(".about-reveal", { filter: "blur(0px)", duration: 0.5 }); // Ensure clear finish
        }
      });



      // Bio Letter-by-Letter Scrub
      // We animate ALL chars from index 0 to end as we scroll through the pinned container
      const chars = document.querySelectorAll(".bio-char");
      gsap.fromTo(chars,
        {
          opacity: 0.1,
          filter: "blur(8px)"
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.1,
          ease: "none", // Linear scrub
          scrollTrigger: {
            trigger: ".bio-pin-trigger",
            start: "top top", // Pin when top hits top
            end: "bottom bottom", // Unpin when bottom hits bottom
            scrub: 1,
            pin: ".bio-sticky-content", // Pin the inner content
            anticipatePin: 1
          }
        }
      );

      // Scatter Elements Reveal (Stats)
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: ".stat-container",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.5,
        ease: "power4.out"
      });

      // Counting Animation for Stats
      const statObj = { value: 0 };
      const statElement = document.querySelector(".stat-number");
      if (statElement) {
        gsap.to(statObj, {
          value: 120,
          duration: 3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stat-container",
            start: "top 80%",
          },
          onUpdate: () => {
            statElement.textContent = Math.floor(statObj.value) + "+";
          }
        });
      }

      // Symbol Float Animation (simple continuous rotation/float)
      gsap.to(".symbol-float", {
        y: -20,
        rotation: 360,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="sticky top-0 w-full bg-black text-white py-20 overflow-hidden z-20 min-h-screen flex flex-col justify-center">

      {/* Floating Symbols Contextual Placement */}
      <div className="absolute top-20 right-20 text-[#E4E5F2] opacity-80 symbol-float">
        <Asterisk className="w-12 h-12" />
      </div>
      <div className="absolute bottom-40 left-10 text-[#E4E5F2] opacity-60 symbol-float" style={{ animationDelay: '1s' }}>
        <Globe className="w-16 h-16 opacity-50" strokeWidth={1} />
      </div>
      <div className="absolute top-1/3 left-1/4 text-[#E4E5F2] opacity-40 symbol-float blur-[1px]">
        <Code className="w-8 h-8" />
      </div>

      {/* Floating Headers */}
      <div className="absolute top-12 left-12 z-10 pointer-events-none">
        <span className="block font-mono text-xs font-bold uppercase tracking-widest text-white/50">OUR MISSION</span>
      </div>
      <div className="absolute top-12 right-12 z-10 pointer-events-none">
        <span className="block font-mono text-xs font-bold uppercase tracking-widest text-white/50">(02)</span>
      </div>

      {/* Massive Typographic Block */}
      <div className="w-full relative flex flex-col justify-center min-h-[50vh] mb-20">

        {/* DESIGN */}
        <div className="w-full overflow-hidden relative">
          <MagneticText strength={0.3} className="origin-top">
            <h2 className="about-reveal text-[12.5vw] font-monoton leading-[0.8] tracking-tighter uppercase whitespace-nowrap pl-[5vw] select-none text-electric-blue-gradient">
              DESIGN
            </h2>
          </MagneticText>
          <Zap className="absolute top-0 right-[20vw] w-12 h-12 text-[#E4E5F2] symbol-float" />
        </div>

        {/* INTELLIGENCE - Moved to Right */}
        <div className="w-full flex justify-end overflow-hidden relative">
          <div ref={textRef} className="about-reveal -mr-[8vw]">
            <MagneticText strength={0.3}>
              {/* Stroke Logic: Since background is black, stroke needs to be visible or filled. 
                  User asked for the gradient on text. Let's make this one outlined with gradient? 
                  Or just solid gradient. Solid gradient fits "Award Winning" better than stroke usually.
                  Let's try Solid Gradient for maximum impact.
              */}
              <h2 className="about-reveal text-[12.5vw] font-monoton leading-[0.8] tracking-tighter uppercase whitespace-nowrap text-electric-blue-gradient select-none">
                INTELLIGENCE
              </h2>
            </MagneticText>
          </div>
        </div>

        {/* BEYOND */}
        <div className="w-full overflow-hidden flex justify-end relative">
          <MagneticText strength={0.3} className="origin-top">
            <h2 className="about-reveal text-[12.5vw] font-monoton leading-[0.8] tracking-tighter uppercase whitespace-nowrap pr-[5vw] select-none text-electric-blue-gradient">
              BEYOND
            </h2>
          </MagneticText>
          <Cpu className="absolute bottom-4 left-[10vw] w-8 h-8 text-[#E4E5F2] symbol-float opacity-70" />
        </div>
      </div>

      {/* ISOLATED Bio Statement ("Only one on screen") */}
      {/* Wrapped in a tall container for pinning duration */}
      <div className="bio-pin-trigger w-full min-h-[150vh] relative z-30 bg-black">
        <div className="bio-sticky-content sticky top-0 h-screen w-full flex items-center justify-center px-6">
          <div className="max-w-4xl text-center relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[#E4E5F2] opacity-50"><Asterisk className="w-6 h-6 animate-spin-slow" /></span>

            <span className="block font-mono text-sm font-bold mb-8 text-[#E4E5F2] opacity-50">(001)</span>
            <p className="text-4xl md:text-6xl font-medium leading-[1.2] tracking-tight text-white flex flex-wrap justify-center gap-x-[0.2em] gap-y-1">
              {"I build systems that perceive, learn, and adapt. Bridging the gap between raw data and human experience.".split(" ").map((word, wIndex) => (
                <span key={wIndex} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, cIndex) => (
                    <span key={cIndex} className="bio-char inline-block opacity-10 blur-sm transform-gpu will-change-[opacity,filter]">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* Stats - Separated below */}
      <div className="stat-container w-full py-32 flex justify-center md:justify-end px-6 md:px-24 bg-black">
        <div className="stat-item flex flex-col md:items-end text-center md:text-right">
          <span className="stat-number block text-9xl md:text-[15rem] font-bold tracking-tighter leading-[0.8] mb-4 text-white">0+</span>
          <span className="block font-mono text-sm uppercase tracking-widest bg-white text-black px-4 py-2 inline-block">Models Trained</span>
        </div>
      </div>

    </section>
  );
};


export default About;