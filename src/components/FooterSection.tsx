import React, { useState } from 'react';
import { FOOTER_DATA } from '../data/paralifeData';

interface FooterSectionProps {
  onOpenAdmin?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenAdmin }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleCopyrightClick = () => {
    const next = clickCount + 1;
    if (next >= 3) {
      setClickCount(0);
      onOpenAdmin?.();
    } else {
      setClickCount(next);
      // Reset clicks after 2 seconds
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  return (
    <footer
      className="w-full py-12 md:py-16 px-6 md:px-12 bg-[#121316]"
      aria-label="Footer"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Copyright (Click 3x to open admin, or click icon) */}
        <div className="flex items-center space-x-2">
          <p
            onClick={handleCopyrightClick}
            className="text-[13px] tracking-[0.1em] text-[#F2EEE8]/52 uppercase cursor-pointer select-none hover:text-[#F2EEE8]/80 transition-colors"
            title="Click 3x for Analytics Control Center"
          >
            {FOOTER_DATA.copyright}
          </p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-[11px] text-[#F2EEE8]/20 hover:text-[#FF2D85] transition-colors p-1"
            title="Open Analytics Admin Panel"
            aria-label="Open Admin Analytics"
          >
            ●
          </button>
        </div>

        {/* Footer Destination Links */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {FOOTER_DATA.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] tracking-[0.08em] uppercase text-[#F2EEE8]/76 hover:text-[#FF2D85] font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
