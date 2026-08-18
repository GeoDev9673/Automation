import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MusicSection } from './components/MusicSection';
import { MemoryCinemaSection } from './components/MemoryCinemaSection';
import { SubscribeSection } from './components/SubscribeSection';
import { FooterSection } from './components/FooterSection';
import { SiteProtection } from './components/SiteProtection';

export default function App() {
  return (
    <SiteProtection>
      <div className="w-full min-h-screen bg-[#121316] text-[#F2EEE8] selection:bg-[#FF2D85]/30 selection:text-[#F2EEE8]">
        {/* 01 HEADER */}
        <Header />

        {/* MAIN EXPERIENCE CONTAINER */}
        <main className="w-full flex flex-col">
          {/* 02 HERO WITH CINEMATIC SCREEN (Target of +MEMORY) */}
          <HeroSection />

          {/* 03 ABOUT */}
          <AboutSection />

          {/* 04 MUSIC (Target of +MUSIC) */}
          <MusicSection />

          {/* 05 MEMORY CINEMA */}
          <MemoryCinemaSection />

          {/* 06 SUBSCRIBE (Target of +SUBSCRIBE) */}
          <SubscribeSection />
        </main>

        {/* 08 FOOTER */}
        <FooterSection />
      </div>
    </SiteProtection>
  );
}
