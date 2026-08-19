import React from 'react';
import { FOOTER_DATA } from '../data/paralifeData';

export const FooterSection: React.FC = () => {
  return (
    <footer
      className="w-full py-10 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12 bg-[#121316] border-t border-[#F2EEE8]/8"
      aria-label="Footer"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-center md:text-left">
        {/* Copyright */}
        <p className="text-[12px] sm:text-[13px] tracking-[0.1em] text-[#F2EEE8]/52 uppercase order-2 md:order-1">
          {FOOTER_DATA.copyright}
        </p>

        {/* Footer Destination Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 order-1 md:order-2">
          {FOOTER_DATA.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] sm:text-[13px] tracking-[0.08em] uppercase text-[#F2EEE8]/76 hover:text-[#FF2D85] active:text-[#FF2D85] font-medium transition-colors duration-150 py-2 min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
