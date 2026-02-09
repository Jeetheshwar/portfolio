import React, { useState, useEffect } from 'react';
import Lenis from 'lenis'; // Import Lenis
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import About from './components/About';
import Work from './components/Work';
import Contact from './components/Contact';
import Cursor from './components/Cursor';
import CurveTransition from './components/CurveTransition';
import GrainOverlay from './components/GrainOverlay';
import GridBackground from './components/GridBackground';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetSection, setTargetSection] = useState<string | null>(null);

  // Initialize smooth scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // smoothTouch: false, // Deprecated in v3+, touch is handled differently or naturally
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    // We need to tell ScrollTrigger to use Lenis's scroll position
    // BUT for basic usage without explicit pin-spacer conflicts, just rAF is often enough.
    // Ideally:
    // lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handlePreloaderComplete = () => {
    setLoading(false);
  };

  const handleNavClick = (targetId: string) => {
    if (isTransitioning) return;
    setTargetSection(targetId);
    setIsTransitioning(true);
  };

  const handleTransitionCovered = () => {
    if (targetSection) {
      const element = document.getElementById(targetSection.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'auto' }); // Instant jump while hidden
      }
    }
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setTargetSection(null);
  };

  return (
    <>
      <Cursor />

      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      {isTransitioning && (
        <CurveTransition
          onCovered={handleTransitionCovered}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* Global Design Elements */}
      <GrainOverlay />
      <GridBackground />

      <Navbar onNavClick={handleNavClick} />

      <main className="relative">
        <Hero isLoaded={!loading} />
        <div className="relative z-10 bg-[#050505] shadow-2xl shadow-black mt-[100vh]">

          <About />
          <Work />
          <Contact />
        </div>
      </main>
    </>
  );
};

export default App;