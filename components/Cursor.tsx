import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center cursor initially
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseEnterLink = () => {
      gsap.to(cursor, {
        scale: 4,
        backgroundColor: '#FFFFFF',
        mixBlendMode: 'difference', // Ensures visibility on light/dark
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: '#FFFFFF',
        mixBlendMode: 'difference',
        duration: 0.3,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Attach listeners to interactive elements
    // We re-query frequently or use event delegation if elements change, 
    // but for now, global delegation is cleaner.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.magnetic-btn') || target.closest('.cursor-hover')) {
        onMouseEnterLink();
      } else {
        onMouseLeaveLink();
      }
    };

    // Use mouseover/out for delegation
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    />
  );
};

export default Cursor;