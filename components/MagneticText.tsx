import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticTextProps {
  children: React.ReactNode;
  className?: string; // Allow passing standard classes
  strength?: number; // How strong the pull is (default 0.5)
}

const MagneticText: React.FC<MagneticTextProps> = ({ children, className, strength = 0.5 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const container = containerRef.current;
      const text = textRef.current; // The inner text element

      if (!container || !text) return;

      const xTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = container.getBoundingClientRect();

        const x = (clientX - (left + width / 2));
        const y = (clientY - (top + height / 2));

        // Move the text towards the mouse
        xTo(x * strength);
        yTo(y * strength);
      };

      const handleMouseLeave = () => {
        // Snap back to center
        xTo(0);
        yTo(0);
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };

    }, containerRef);

    return () => context.revert();
  }, [strength]);

  return (
    // The container catches the mouse events (larger area usually better)
    // Inline-block to wrap text tightly, but allows transform
    <div ref={containerRef} className={`inline-block ${className || ''}`} style={{ position: 'relative' }}>
      <div ref={textRef} style={{ display: 'inline-block' }}>
        {children}
      </div>
    </div>
  );
};

export default MagneticText;
