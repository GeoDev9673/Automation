import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MusicSection } from './components/MusicSection';
import { MemoryCinemaSection } from './components/MemoryCinemaSection';
import { SubscribeSection } from './components/SubscribeSection';
import { FooterSection } from './components/FooterSection';
import { SiteProtection } from './components/SiteProtection';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { trackPageView } from './utils/analytics';

export default function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // 1. Track Visitor Page View on Mount
    trackPageView();

    // 2. Check for #admin or ?admin in URL
    const checkAdminUrl = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#admin' || search.includes('admin=true') || search.includes('admin=1')) {
        const isAuth = localStorage.getItem('paralife_admin_auth') === 'true';
        if (isAuth) {
          setIsAdminOpen(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };
    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);

    // 3. Keyboard Shortcut: Ctrl + Alt + A (or Cmd + Alt + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф')) {
        e.preventDefault();
        const isAuth = localStorage.getItem('paralife_admin_auth') === 'true';
        if (isAuth) {
          setIsAdminOpen(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenAdmin = () => {
    const isAuth = localStorage.getItem('paralife_admin_auth') === 'true';
    if (isAuth) {
      setIsAdminOpen(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

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
        <FooterSection onOpenAdmin={handleOpenAdmin} />

        {/* ADMIN LOGIN GATE MODAL */}
        {showAdminLogin && (
          <AdminLogin
            onSuccess={handleLoginSuccess}
            onCancel={() => setShowAdminLogin(false)}
          />
        )}

        {/* ADMIN ANALYTICS CONTROL CENTER */}
        {isAdminOpen && <AdminPanel onClose={handleCloseAdmin} />}
      </div>
    </SiteProtection>
  );
}
