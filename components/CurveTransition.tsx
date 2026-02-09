import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CurveTransitionProps {
  onCovered: () => void; // Called when screen is fully covered (safe to scroll)
  onComplete: () => void; // Called when animation ends
}

const CurveTransition: React.FC<CurveTransitionProps> = ({ onCovered, onComplete }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    // Initial SVG Path (Flat at bottom)
    const startPath = `M0 ${height} Q${width / 2} ${height} ${width} ${height} L${width} ${height + 100} L0 ${height + 100} Z`;

    // Mid Path (Curved up)
    const midPath = `M0 0 Q${width / 2} -200 ${width} 0 L${width} ${height + 100} L0 ${height + 100} Z`;

    // End Path (Flat at top - fully covered)
    const endPath = `M0 0 Q${width / 2} 0 ${width} 0 L${width} ${height + 100} L0 ${height + 100} Z`;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    if (pathRef.current && containerRef.current) {
      // 1. Curve up to cover
      tl.set(pathRef.current, { attr: { d: startPath } })
        .to(pathRef.current, {
          attr: { d: endPath },
          duration: 0.8,
          ease: "power3.in",
          onComplete: () => {
            onCovered(); // Scroll happens here
          }
        })
        // 2. Uncover (simply fade out or curve down from top? Let's curve down from top)
        // Actually, easier to just lift the whole curtain up or fade it.
        // Let's try lifting the "curtain" up.
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.out"
        });
    }

    return () => {
      tl.kill();
    };
  }, [onCovered, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] pointer-events-none flex flex-col justify-end">
      <svg className="w-full h-[120vh]" preserveAspectRatio="none">
        <path ref={pathRef} fill="#000" />
      </svg>
    </div>
  );
};

export default CurveTransition;
