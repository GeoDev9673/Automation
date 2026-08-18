import React from 'react';
import { FOOTER_DATA } from '../data/paralifeData';

export const FooterSection: React.FC = () => {
  return (
    <footer
      className="w-full py-12 md:py-16 px-6 md:px-12 bg-[#121316]"
      aria-label="Footer"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Copyright */}
        <p className="text-[13px] tracking-[0.1em] text-[#F2EEE8]/52 uppercase">
          {FOOTER_DATA.copyright}
        </p>

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
