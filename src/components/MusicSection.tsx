import React, { useState, useEffect, useRef } from 'react';
import { MUSIC_DATA } from '../data/paralifeData';
import { audioEngine } from '../utils/audioSynth';

export const MusicSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const animationRef = useRef<number | null>(null);
  const platformsRef = useRef<HTMLDivElement>(null);

  // Sync with audio engine
  useEffect(() => {
    return audioEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  // Close platform dropdown on click outside or ESC press
  useEffect(() => {
    if (!showPlatforms) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (platformsRef.current && !platformsRef.current.contains(e.target as Node)) {
        setShowPlatforms(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPlatforms(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPlatforms]);

  const togglePlay = () => {
    audioEngine.toggle();
  };

  // Simulate progress bar movement when playing
  useEffect(() => {
    if (isPlaying) {
      const updateProgress = () => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.12));
        animationRef.current = requestAnimationFrame(updateProgress);
      };
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Format progress into MM:SS
  const totalSeconds = 222; // 3:42
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section
      id="music"
      className="w-full py-28 md:py-40 px-6 md:px-12 bg-[#121316]"
      aria-label="Music Section"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col space-y-12">
        {/* Section Label */}
        <div className="flex flex-col space-y-3">
          <span className="section-label text-[#F2EEE8]/52 hover:text-[#FF2D85] transition-colors duration-200 cursor-default">
            +music
          </span>
        </div>

        {/* Lighter, Frameless Horizontal Audio Player with Organic Neon Soundwave */}
        <div className="w-full flex flex-col space-y-6 pt-2">
          {/* Track Header Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-5">
              {/* Minimal Borderless Play / Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="text-[14px] tracking-[0.1em] text-[#F2EEE8]/80 hover:text-[#FF2D85] transition-colors duration-200 cursor-pointer focus:outline-none flex items-center space-x-2 py-1"
                aria-label={isPlaying ? 'Pause Track' : 'Play Track'}
              >
                {isPlaying ? (
                  <span className="font-semibold">[ II PAUSE ]</span>
                ) : (
                  <span className="font-semibold">[ ▶ PLAY ]</span>
                )}
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-[14px] md:text-[15px] text-[#F2EEE8] tracking-[0.06em] font-medium">
                  {MUSIC_DATA.trackTitle}
                </span>
                <span className="text-[12px] text-[#F2EEE8]/52 tracking-[0.04em] font-mono">
                  {formatTime(currentSeconds)} / {MUSIC_DATA.duration}
                </span>
              </div>
            </div>

            {/* Outbound Link on the Right */}
            <div className="relative" ref={platformsRef}>
              <button
                type="button"
                onClick={() => setShowPlatforms(!showPlatforms)}
                className="text-[13px] tracking-[0.1em] uppercase text-[#F2EEE8]/76 hover:text-[#FF2D85] transition-colors duration-200 py-2 cursor-pointer font-medium flex items-center space-x-2"
                aria-expanded={showPlatforms}
                aria-label="Toggle streaming platforms menu"
              >
                <span>{MUSIC_DATA.streamLinkText}</span>
              </button>

              {/* Quiet Platform Dropdown */}
              {showPlatforms && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-[#121316] border border-[#F2EEE8]/20 shadow-2xl p-4 flex flex-col space-y-3 z-30">
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[#F2EEE8]/52 mb-1">
                    Select Platform
                  </span>
                  {MUSIC_DATA.platforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] tracking-[0.08em] uppercase text-[#F2EEE8]/80 hover:text-[#FF2D85] transition-colors duration-200"
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Organic Neon Pink Soundwave / Pulse Visualizer */}
          <div
            className="relative w-full py-4 cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newProgress = (clickX / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, newProgress)));
            }}
          >
            {/* Central Axis Line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#FF2D85]/20 -translate-y-1/2 pointer-events-none" />

            {/* Expansive, Taller, Symmetrical Neon Pink Soundwave */}
            <div className="w-full flex items-center justify-between h-36 md:h-44 px-0.5 relative z-10">
              {Array.from({ length: 150 }).map((_, i) => {
                // Generate sweeping organic audio envelope
                const normalizedIndex = i / 150;
                const env = Math.sin(normalizedIndex * Math.PI); // Sweeping curve peaking in center
                const wave1 = Math.sin(i * 0.35) * 0.38;
                const wave2 = Math.cos(i * 0.7) * 0.28;
                const wave3 = Math.sin(i * 1.4) * 0.18;
                
                // Real-time subtle signal pulse when playing
                const animPhase = isPlaying ? (Date.now() * 0.005 + i * 0.12) : 0;
                const dynamicPulse = isPlaying ? Math.sin(animPhase) * 0.16 : 0;
                
                const heightPercent = Math.max(4, Math.min(98, (env * (0.35 + wave1 + wave2 + wave3 + dynamicPulse)) * 100));
                
                // Calculate distance to glowing dot cursor for local bloom reaction
                const barPos = (i / 150) * 100;
                const distToDot = Math.abs(barPos - progress);
                const isNearDot = distToDot < 3;
                const isPassed = barPos <= progress;

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center h-full w-[1px]"
                  >
                    <div
                      className={`w-[1px] rounded-full transition-all duration-150 ${
                        isNearDot
                          ? 'bg-[#FF65B2] shadow-[0_0_12px_#FF2D85] opacity-100 scale-y-105'
                          : isPassed
                          ? 'bg-[#FF2D85] shadow-[0_0_8px_#FF2D85] opacity-95'
                          : 'bg-[#FF2D85] opacity-55 shadow-[0_0_4px_rgba(255,45,133,0.35)] group-hover:opacity-80'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}

              {/* Single Glowing Neon Pink Dot Cursor on Center Axis */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FF2D85] shadow-[0_0_10px_#FF2D85,0_0_20px_#FF2D85] pointer-events-none transition-all duration-75 z-20 flex items-center justify-center"
                style={{ left: `${progress}%` }}
              >
                <div className="w-1 h-1 rounded-full bg-white/90 shadow-[0_0_4px_#white]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

