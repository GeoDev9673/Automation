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

  const toggleSound = (e: React.MouseEvent) => {
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
      className="relative h-[100svh] w-full flex items-end justify-center overflow-hidden bg-[#121316] pb-10 md:pb-14"
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

      {/* Dark Cinematic Vignette & Gradient Overlay for text contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#121316] via-black/20 to-[#121316]/50 pointer-events-none" />

      {/* Inscription 'Less Noise. More Life.' positioned at lower center */}
      <div className="relative z-20 text-center px-6 w-full max-w-[1000px] flex flex-col items-center justify-center">
        <h1 className="text-[16px] sm:text-[22px] md:text-[28px] lg:text-[34px] tracking-[0.24em] uppercase text-[#F2EEE8] font-light leading-tight drop-shadow-2xl">
          {HERO_DATA.tagline}
        </h1>
      </div>

      {/* Sound Toggle Control (+sound / -sound) */}
      <div className="absolute bottom-8 right-6 md:right-10 z-30 flex items-center space-x-4">
        <button
          type="button"
          onClick={toggleSound}
          className="text-[13px] tracking-[0.12em] uppercase text-[#F2EEE8]/80 hover:text-[#FF2D85] font-medium transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 rounded-sm"
          aria-label={isSoundOn ? 'Turn sound off' : 'Turn sound on'}
        >
          {isSoundOn ? '-sound' : '+sound'}
        </button>
      </div>
    </section>
  );
};
