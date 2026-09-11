import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface NextAnimatedBackgroundProps {
  darkMode: boolean;
}

export const NextAnimatedBackground: React.FC<NextAnimatedBackgroundProps> = ({ darkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const beamsContainerRef = useRef<HTMLDivElement>(null);
  const mouseSpotlightRef = useRef<HTMLDivElement>(null);

  // 1. Anime.js: Smooth Floating Ambient Aurora Orbs
  useEffect(() => {
    if (!orb1Ref.current || !orb2Ref.current || !orb3Ref.current) return;

    // Orb 1: Cyan / Sky floating aura
    const anim1 = animate(orb1Ref.current, {
      translateX: [-40, 60, 0],
      translateY: [30, -50, 0],
      scale: [1.15, 0.9, 1],
      opacity: darkMode ? [0.45, 0.25, 0.4] : [0.35, 0.18, 0.3],
      duration: 12000,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    // Orb 2: Indigo / Violet floating aura
    const anim2 = animate(orb2Ref.current, {
      translateX: [50, -40, 0],
      translateY: [-40, 50, 0],
      scale: [0.9, 1.2, 1],
      opacity: darkMode ? [0.35, 0.55, 0.4] : [0.25, 0.4, 0.3],
      duration: 14000,
      ease: 'inOutQuad',
      loop: true,
      alternate: true,
    });

    // Orb 3: Emerald / Teal floating aura
    const anim3 = animate(orb3Ref.current, {
      translateX: [-30, 40, 0],
      translateY: [40, -30, 0],
      scale: [1.1, 0.95, 1],
      opacity: darkMode ? [0.3, 0.5, 0.35] : [0.2, 0.35, 0.25],
      duration: 13000,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });

    return () => {
      anim1.revert();
      anim2.revert();
      anim3.revert();
    };
  }, [darkMode]);

  // 2. Anime.js: Next.js Laser Beams & Grid Dot Intersections
  useEffect(() => {
    if (!beamsContainerRef.current) return;

    const hBeams = beamsContainerRef.current.querySelectorAll('.horizontal-beam');
    const vBeams = beamsContainerRef.current.querySelectorAll('.vertical-beam');
    const dots = beamsContainerRef.current.querySelectorAll('.grid-dot');

    const hAnim = animate(hBeams, {
      translateX: ['-100%', '300%'],
      opacity: [0, 0.85, 0],
      ease: 'inOutCubic',
      duration: 5000,
      delay: stagger(1800),
      loop: true,
    });

    const vAnim = animate(vBeams, {
      translateY: ['-100%', '300%'],
      opacity: [0, 0.85, 0],
      ease: 'inOutCubic',
      duration: 5500,
      delay: stagger(1500),
      loop: true,
    });

    const dotAnim = animate(dots, {
      opacity: [0.1, 0.9, 0.1],
      scale: [0.8, 1.6, 0.8],
      ease: 'inOutQuad',
      duration: 2500,
      delay: stagger(200, { from: 'center' }),
      loop: true,
    });

    return () => {
      hAnim.revert();
      vAnim.revert();
      dotAnim.revert();
    };
  }, [darkMode]);

  // 3. Mouse Interactive Spotlight (Next.js / Vercel cursor illumination)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseSpotlightRef.current) return;
      const x = e.clientX;
      const y = e.clientY;

      animate(mouseSpotlightRef.current, {
        left: `${x}px`,
        top: `${y}px`,
        duration: 300,
        ease: 'outQuad',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-500"
      aria-hidden="true"
    >
      {/* 1. Next.js Signature Grid Background with Radial Fade Vignette */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          darkMode ? 'opacity-90' : 'opacity-70'
        }`}
        style={{
          backgroundImage: darkMode
            ? `
                linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
              `
            : `
                linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
              `,
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 80% 65% at 50% 25%, black 40%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 65% at 50% 25%, black 40%, transparent 85%)',
        }}
      />

      {/* 2. Interactive Mouse Cursor Spotlight (Signature Vercel / Next.js Glow) */}
      <div
        ref={mouseSpotlightRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] transition-opacity duration-300 opacity-40 dark:opacity-30"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 70%)',
          left: '50%',
          top: '30%',
        }}
      />

      {/* 3. Floating Ambient Aurora Orbs (Anime.js Powered) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top-Center Cyan / Sky Glow */}
        <div
          ref={orb1Ref}
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[350px] sm:w-[750px] sm:h-[450px] rounded-full blur-[110px] transform-gpu"
          style={{
            background: darkMode
              ? 'radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, rgba(56, 189, 248, 0.15) 60%, transparent 70%)'
              : 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(14, 165, 233, 0.12) 60%, transparent 70%)',
          }}
        />

        {/* Top-Right Indigo / Violet Glow */}
        <div
          ref={orb2Ref}
          className="absolute -top-12 right-[10%] w-[420px] h-[380px] sm:w-[600px] sm:h-[450px] rounded-full blur-[120px] transform-gpu"
          style={{
            background: darkMode
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.32) 0%, rgba(139, 92, 246, 0.18) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)',
          }}
        />

        {/* Top-Left Emerald Glow */}
        <div
          ref={orb3Ref}
          className="absolute top-20 left-[8%] w-[400px] h-[350px] sm:w-[500px] sm:h-[400px] rounded-full blur-[115px] transform-gpu"
          style={{
            background: darkMode
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(20, 184, 166, 0.12) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(20, 184, 166, 0.08) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* 4. Next.js Laser Beams & Grid Dot Intersections (Anime.js Powered) */}
      <div ref={beamsContainerRef} className="absolute inset-0">
        {/* Horizontal Laser Beams */}
        <div
          className="horizontal-beam grid-beam absolute left-0 right-0 h-[1.5px] w-48 opacity-0 blur-[0.5px]"
          style={{
            top: '192px',
            background: darkMode
              ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.85), rgba(99, 102, 241, 0.9), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.7), rgba(99, 102, 241, 0.7), transparent)',
          }}
        />
        <div
          className="horizontal-beam grid-beam absolute left-0 right-0 h-[1.5px] w-64 opacity-0 blur-[0.5px]"
          style={{
            top: '336px',
            background: darkMode
              ? 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.85), rgba(56, 189, 248, 0.85), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.65), rgba(14, 165, 233, 0.65), transparent)',
          }}
        />

        {/* Vertical Laser Beams */}
        <div
          className="vertical-beam grid-beam absolute top-0 bottom-0 w-[1.5px] h-48 opacity-0 blur-[0.5px]"
          style={{
            left: '288px',
            background: darkMode
              ? 'linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.9), rgba(56, 189, 248, 0.85), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.7), rgba(14, 165, 233, 0.7), transparent)',
          }}
        />
        <div
          className="vertical-beam grid-beam absolute top-0 bottom-0 w-[1.5px] h-64 opacity-0 blur-[0.5px]"
          style={{
            right: '336px',
            background: darkMode
              ? 'linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.85), rgba(16, 185, 129, 0.85), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(14, 165, 233, 0.65), rgba(16, 185, 129, 0.65), transparent)',
          }}
        />

        {/* Constellation of Grid Intersection Dots */}
        {[
          { x: 192, y: 144 },
          { x: 384, y: 144 },
          { x: 576, y: 144 },
          { x: 768, y: 144 },
          { x: 960, y: 144 },
          { x: 288, y: 288 },
          { x: 480, y: 288 },
          { x: 672, y: 288 },
          { x: 864, y: 288 },
          { x: 1056, y: 288 },
          { x: 192, y: 432 },
          { x: 384, y: 432 },
          { x: 576, y: 432 },
          { x: 768, y: 432 },
          { x: 960, y: 432 },
          { x: 288, y: 576 },
          { x: 480, y: 576 },
          { x: 672, y: 576 },
          { x: 864, y: 576 },
          { x: 1056, y: 576 },
        ].map((pt, idx) => (
          <div
            key={idx}
            className="grid-dot absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${pt.x}px`,
              top: `${pt.y}px`,
              backgroundColor: darkMode ? '#38bdf8' : '#0284c7',
              boxShadow: darkMode
                ? '0 0 8px rgba(56, 189, 248, 0.8), 0 0 16px rgba(99, 102, 241, 0.5)'
                : '0 0 6px rgba(14, 165, 233, 0.6)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
