import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  onNavClick: (targetId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");
  const [navColor, setNavColor] = useState("text-white"); // Default color for dark Hero

  // ... (inside useEffect)
  // Replacing lines 17-40 range roughly or just specific lines.
  // Let's do single replace for the state init.
  // Oops, I can't do multiple disparate blocks nicely in one replace_file_content if they are far apart properly without context.
  // But wait, the previous tool call failed because I didn't provide good context.
  // I will just use `write_to_file` for Hero because I am changing a lot (bg, colors).
  // For Navbar, I will use `replace_file_content` carefully.

  // ... (inside useEffect) NOT INCLUDED HERE, just showing logic

  // Using multi-step replacement logic or careful targeting is better.
  // Actually, I will replace the state initialization line.

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Color Change based on Section
  useEffect(() => {
    const ctx = gsap.context(() => {
      // About - Electric Blue
      ScrollTrigger.create({
        trigger: "#about",
        start: "top 10%",
        end: "bottom 10%",
        onEnter: () => setNavColor("text-electric-blue-gradient"),
        onLeaveBack: () => setNavColor("text-white"), // Back to Hero
        onLeave: () => setNavColor("text-fiery-gradient") // Explicitly set next color if needed, but next trigger handles it
      });

      // Work - Fiery Orange
      ScrollTrigger.create({
        trigger: "#work",
        start: "top 10%",
        end: "bottom 10%",
        onEnter: () => setNavColor("text-fiery-gradient"),
        onLeaveBack: () => setNavColor("text-electric-blue-gradient"), // Back to About
      });

      // Contact - White
      ScrollTrigger.create({
        trigger: "#contact",
        start: "top 10%",
        onEnter: () => setNavColor("text-white"),
        onLeaveBack: () => setNavColor("text-fiery-gradient") // Back to Work
      });

    });
    return () => ctx.revert();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    onNavClick(targetId);
    if (isOpen) toggleMenu();
  };

  useEffect(() => {
    // Animate mobile menu
    if (menuRef.current) {
      if (isOpen) {
        gsap.to(menuRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
      } else {
        gsap.to(menuRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Fade in navbar on mount
    if (navRef.current) {
      gsap.to(navRef.current, { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 1 });
    }
  }, []);

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-start pointer-events-none opacity-0">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleLinkClick(e, '#hero')}
          className="pointer-events-auto group magnetic-btn text-2xl font-display font-bold tracking-tighter transition-colors"
        >
          <span className={`mix-blend-difference transition-all duration-500 ${navColor}`}>JA.</span>
        </a>

        {/* Local Time Widget (Swiss Style) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 hidden md:block pointer-events-none">
          <span className={`font-mono text-xs tracking-widest font-bold opacity-80 transition-all duration-500 ${navColor}`}>(IST {time})</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-12">
          {/* Desktop Links */}
          <div className="hidden md:flex gap-10 text-xs font-mono uppercase tracking-widest">
            {['Index', 'About', 'Work', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase() === 'index' ? 'hero' : item.toLowerCase()}`}
                onClick={(e) => handleLinkClick(e, `#${item.toLowerCase() === 'index' ? 'hero' : item.toLowerCase()}`)}
                className={`transition-colors duration-500 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${navColor}`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Hire Me Button */}
          <a href="mailto:jeetheshwaraalam7@gmail.com" className="hidden md:block relative group overflow-hidden rounded-full magnetic-btn">
            <div className={`px-5 py-2 border border-current rounded-full transition-all duration-500 relative z-10 ${navColor}`}>
              <span className="text-xs font-mono uppercase tracking-widest">Hire Me</span>
            </div>
          </a>

          {/* Mobile Menu Trigger */}
          <button onClick={toggleMenu} className="md:hidden pointer-events-auto flex flex-col gap-1.5 group">
            <div className="w-8 h-[1px] bg-current group-hover:w-6 transition-all duration-300"></div>
            <div className="w-8 h-[1px] bg-current"></div>
            <div className="w-8 h-[1px] bg-current group-hover:w-4 transition-all duration-300"></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-dark z-[60] transform translate-x-full flex flex-col justify-center items-center gap-8 md:hidden"
      >
        <button onClick={toggleMenu} className="absolute top-8 right-8 text-white hover:text-accent transition-colors">
          <X className="w-8 h-8" />
        </button>
        {['About', 'Work', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={(e) => handleLinkClick(e, `#${item.toLowerCase()}`)}
            className="text-4xl font-display font-bold text-white hover:text-accent"
          >
            {item}
          </a>
        ))}
      </div>
    </>
  );
};

export default Navbar;