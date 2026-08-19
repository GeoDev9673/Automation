import React, { useState, useEffect, useRef } from 'react';
import heroVideo from '../assets/videos/hero-section.mp4';
import { HERO_DATA } from '../data/paralifeData';

export const HeroSection: React.FC = () => {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isSoundOn;
    }
  }, [isSoundOn]);

  const toggleSound = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMutedState = !videoRef.current.muted;
      videoRef.current.muted = nextMutedState;
      setIsSoundOn(!nextMutedState);

      if (!nextMutedState) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[520px] w-full flex items-end justify-center overflow-hidden bg-[#121316] pb-10 sm:pb-12 md:pb-16"
      aria-label="Hero"
    >
      {/* Full-screen Background Video */}
      <video
        ref={videoRef}
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controlsList="nodownload no-remote-playback"
        onContextMenu={(e) => e.preventDefault()}
        style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90 contrast-[1.05]"
      />

      {/* Dark Cinematic Vignette & Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#121316] via-black/25 to-[#121316]/50 pointer-events-none" />

      {/* Centered Symmetrical Inscription & Sound Control */}
      <div className="relative z-20 text-center px-4 sm:px-6 w-full max-w-[1000px] flex flex-col items-center justify-center space-y-2 sm:space-y-3">
        <h1 className="text-[14px] sm:text-[18px] md:text-[26px] lg:text-[32px] tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[#F2EEE8] font-light leading-snug drop-shadow-2xl">
          {HERO_DATA.tagline}
        </h1>

        {/* Minimalist Editorial Sound Button */}
        <button
          type="button"
          onClick={toggleSound}
          className="text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#F2EEE8]/65 hover:text-[#FF2D85] active:text-[#FF2D85] font-medium transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer py-1 px-3"
          aria-label={isSoundOn ? 'Turn sound off' : 'Turn sound on'}
        >
          {isSoundOn ? '-sound' : '+sound'}
        </button>
      </div>
    </section>
  );
};
