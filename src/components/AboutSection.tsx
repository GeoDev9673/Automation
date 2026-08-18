import React from 'react';
import { ABOUT_DATA } from '../data/paralifeData';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="w-full py-32 md:py-44 px-6 md:px-12 bg-[#121316] flex flex-col items-center text-center"
      aria-label="About PARALIFE"
    >
      <div className="max-w-[820px] mx-auto flex flex-col items-center space-y-8 md:space-y-12">
        {/* Section Label */}
        <span className="section-label">
          {ABOUT_DATA.sectionLabel}
        </span>

        {/* Headline */}
        <h2 className="type-h2 text-[#F2EEE8] font-normal leading-[1.08] max-w-[780px]">
          {ABOUT_DATA.headline}
        </h2>

        {/* Body Text */}
        <p className="type-body-lg text-[#F2EEE8]/76 max-w-[640px] font-normal leading-[1.5]">
          {ABOUT_DATA.body}
        </p>
      </div>
    </section>
  );
};
