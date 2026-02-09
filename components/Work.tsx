import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '../types';
import MagneticText from './MagneticText';
import { Sparkles, Crown, Infinity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects: Project[] = [
  {
    id: 1,
    category: "01",
    title: "NEURAL_VISION",
    description: "Real-time surveillance",
    techStack: ["Python", "OpenCV"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop", // Abstract AI Neural Network
    link: "#"
  },
  {
    id: 2,
    category: "02",
    title: "LEXIMIND",
    description: "RAG document analysis",
    techStack: ["LangChain", "React"],
    imageUrl: "https://images.unsplash.com/photo-1639322537228-ad7117a7a435?q=80&w=2070&auto=format&fit=crop", // Abstract Glass/Light
    link: "#"
  },
  {
    id: 3,
    category: "03",
    title: "MARKETPULSE",
    description: "Financial forecasting",
    techStack: ["TensorFlow", "FastAPI"],
    imageUrl: "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2080&auto=format&fit=crop", // Dark abstract data
    link: "#"
  }
];

const Work: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Pin the Title Section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: titleRef.current,
        pinSpacing: false,
        scrub: true
      });

      // Title Mask Reveal
      // Triggers when the section starts to come into view
      gsap.from(".work-title-reveal", {
        y: "100%",
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%", // Triggers as valid section comes into view
          toggleActions: "play none none reverse"
        }
      });

      // Project Card Animations
      gsap.utils.toArray('.project-card').forEach((card: any) => {
        gsap.from(card, {
          y: 100,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // Symbol Rotation
      gsap.to(".work-symbol", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "linear"
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={containerRef} className="relative bg-black text-white min-h-[450vh] w-full z-30">

      {/* PINNED CENTER HEADER - Absolute + GSAP Pin */}
      <div
        ref={titleRef}
        className="absolute top-0 left-0 h-screen w-full flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden text-[#FFB347]"
      >

        {/* Decorative Graphic Layer - Rotating */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-[50vw] h-[50vw] border-[1px] border-dashed border-[#FFB347]/30 rounded-full work-symbol"></div>
        </div>

        <div className="flex flex-col items-center leading-none relative z-10 mix-blend-screen">
          <div className="absolute -top-16 -left-16 opacity-70"><Sparkles className="w-12 h-12 text-[#FFB347] animate-pulse" /></div>

          <MagneticText strength={0.2}>
            {/* Mask Container */}
            <div className="overflow-hidden">
              <h2 className="work-title-reveal text-[15vw] font-emblema font-bold tracking-tight text-fiery-gradient whitespace-nowrap leading-[0.8] select-none block origin-bottom-left">
                Latest
              </h2>
            </div>
          </MagneticText>
          <MagneticText strength={0.2}>
            <div className="overflow-hidden mt-[1vw]">
              <h2 className="work-title-reveal text-[15vw] font-emblema font-bold tracking-tight text-fiery-gradient whitespace-nowrap leading-[0.8] select-none block origin-bottom-left">
                Works
              </h2>
            </div>
          </MagneticText>

          <div className="absolute -bottom-16 -right-16 opacity-70"><Crown className="w-10 h-10 text-[#FFB347]" /></div>
        </div>

        {/* Center Symbol */}
        <div className="mt-12 text-[#FFB347] opacity-60">
          <Infinity className="w-6 h-6" />
        </div>
      </div>

      {/* SCROLLABLE PROJECT FEED - Z-10 */}
      <div className="relative z-10 w-full flex flex-col gap-32 pt-[100vh] pb-64 px-4 md:px-32">
        {projects.map((project, index) => (
          <a
            key={project.id}
            href={project.link}
            className={`project-card group flex flex-col w-full max-w-lg ${index % 2 === 0 ? 'md:self-start' : 'md:self-end'}`}
          >
            {/* 1. Image First - Smaller Container */}
            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg mb-6 border border-white/10 group-hover:border-[#FFB347]/50 transition-colors duration-500 relative">
              <div className="absolute inset-0 bg-[#FFB347]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
              />
            </div>

            {/* 2. Title Second - Smaller Font */}
            <div className="text-left relative pl-2">
              <span className="font-mono text-xs tracking-widest text-[#FFB347] mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.category} — {project.description}
              </span>

              <h3
                className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent transition-all duration-300"
                onMouseMove={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  const rect = target.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  target.style.setProperty('--mouse-x', `${x}px`);
                  target.style.setProperty('--mouse-y', `${y}px`);
                }}
                style={{
                  backgroundImage: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #ff7c5c, #ff3e0f, #ff552c)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%'
                }}
              >
                {project.title}
              </h3>
            </div>
          </a>
        ))}
      </div>

    </section>
  );
};

export default Work;