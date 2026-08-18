import React from 'react';
import { MEMORY_CINEMA_DATA } from '../data/paralifeData';

export const MemoryCinemaSection: React.FC = () => {
  return (
    <section
      id="memory-cinema"
      className="w-full py-28 md:py-40 px-6 md:px-12 bg-[#121316]"
      aria-label="Memory Cinema"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label */}
        <div className="mb-12 md:mb-16">
          <span className="section-label text-[#F2EEE8]/52 hover:text-[#FF2D85] transition-colors duration-200 cursor-default">
            MEMORY CINEMA
          </span>
        </div>

        {/* Editorial Layout: Image and Text in refined spatial harmony */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Dominant Cinematic Image (8 columns on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 w-full overflow-hidden">
            <img
              src={MEMORY_CINEMA_DATA.image}
              alt={MEMORY_CINEMA_DATA.altText}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover grayscale brightness-90 contrast-105 hover:brightness-95 transition-all duration-700"
            />
          </div>

          {/* Supporting Text Block (5 columns on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-8 lg:pt-8">
            {/* Headline */}
            <h3 className="type-h2 text-[#F2EEE8] font-normal leading-[1.08]">
              {MEMORY_CINEMA_DATA.headline}
            </h3>

            {/* Quote */}
            <blockquote className="text-[17px] md:text-[18px] italic text-[#F2EEE8]/85 border-l border-[#F2EEE8]/30 pl-6 py-1 font-serif">
              {MEMORY_CINEMA_DATA.quote}
            </blockquote>

            {/* Body */}
            <p className="type-body text-[#F2EEE8]/76 font-normal leading-[1.6]">
              {MEMORY_CINEMA_DATA.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
