import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, PARALIFE_META } from '../data/paralifeData';
import logoImg from '../assets/images/logo.png';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pressing Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-6 px-6 md:px-12 ${
        scrolled ? 'bg-[#121316]/90 backdrop-blur-sm' : 'bg-transparent'
      }`}
      aria-label="Primary navigation"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* PARALIFE Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src={logoImg}
            alt={PARALIFE_META.brandName}
            className="h-8 md:h-10 w-auto object-contain max-w-[160px] md:max-w-[200px]"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10" aria-label="Main menu">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-[13px] tracking-[0.08em] uppercase text-[#F2EEE8]/76 hover:text-[#FF2D85] transition-colors duration-200 font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[13px] tracking-[0.08em] uppercase text-[#F2EEE8]/76 hover:text-[#F2EEE8] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="md:hidden absolute top-full left-0 right-0 bg-[#1a1b20] px-6 py-8 flex flex-col space-y-6 shadow-2xl"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-[14px] tracking-[0.08em] uppercase text-[#F2EEE8]/90 hover:text-[#FF2D85] transition-colors duration-200 py-2"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

