import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticText from './MagneticText';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("jeetheshwaraalam7@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", // Triggers nicely as the section covers most of the screen
          end: "+=100%",
          toggleActions: "play none none reverse"
        },
        y: "100%",
        skewY: 0,
        opacity: 1,
        filter: "blur(10px)",
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        onComplete: () => {
          gsap.to(".contact-reveal", { filter: "blur(0px)", duration: 0.5 });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={containerRef} className="sticky top-0 min-h-screen bg-black text-white flex flex-col justify-end pb-12 px-4 md:px-8 z-40 overflow-hidden">

      {/* Main Call to Action */}
      <div className="w-full relative z-10 flex-grow flex flex-col justify-center">

        <div className="mb-12 overflow-hidden">
          <button onClick={handleCopy} className="block group text-left w-full outline-none">
            <div className="contact-reveal">
              <span className="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">/// START A PROJECT</span>
            </div>
            <div className="overflow-hidden">
              <MagneticText strength={0.5}>
                <h2 className="contact-reveal text-[14vw] font-bungee font-bold leading-[0.8] tracking-tighter text-gray-300 group-hover:text-white transition-colors duration-500 uppercase whitespace-nowrap pl-[2vw] mix-blend-difference origin-left">
                  {copied ? (
                    <span className="text-purple-400 block animate-pulse">COPIED!</span>
                  ) : (
                    "SAY HELLO"
                  )}
                </h2>
              </MagneticText>
            </div>
          </button>
        </div>

        <div className="w-full grid md:grid-cols-2 gap-12 border-t border-white/20 pt-12">
          <div className="contact-reveal">
            <h3 className="text-2xl font-bold mb-2">Jeetheshwar Aalam</h3>
            <p className="text-gray-500 font-mono text-sm">Machine Learning Engineer<br />Based in India</p>
          </div>
          <div className="contact-reveal flex flex-wrap gap-x-12 gap-y-4">
            {['LinkedIn', 'GitHub', 'Twitter', 'Instagram'].map(social => (
              <a key={social} href="#" className="text-sm font-mono uppercase tracking-widest hover:text-purple-400 transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
      {/* Infinite Marquee Footer */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden whitespace-nowrap py-4 border-t border-white/10 z-0 opacity-50 mix-blend-difference">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 20s linear infinite;
          }
        `}</style>
        <div className="animate-marquee">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <span key={i} className="text-xs font-mono font-bold tracking-[0.5em] uppercase px-8">AVAILABLE FOR WORK — WORLDWIDE — 2025 —</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;