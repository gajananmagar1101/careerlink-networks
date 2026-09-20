import React from 'react';

/**
 * CareerJourney visual component recreating the public hero career trajectory
 * exactly matching the design reference using real frontend code (React + SVG + CSS).
 *
 * It features:
 * - Seamless photography backdrop of the traveler looking toward the city sunrise
 * - Smooth upward-curving SVG trajectory path with circular nodes
 * - Three floating frosted-glass capsule pills:
 *   1. Better Jobs (Briefcase icon)
 *   2. Great Companies (Team icon)
 *   3. Career Growth (Trending bar chart icon)
 * - Pure code-based implementation, fully responsive, and editable.
 */
export const CareerJourney: React.FC = () => {
  return (
    <div className="relative w-full select-none">
      {/* Clean Visual Container without background image */}
      <div className="relative mx-auto min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] w-full max-w-[520px] aspect-[1.25/1] sm:aspect-[1.3/1]">

        {/* SVG Trajectory Layer - viewBox 0 0 100 100 */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="careerCurveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ea488" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#238668" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#156e54" stopOpacity="0.95" />
            </linearGradient>
            <filter id="nodeShadowFilter" x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="0.8" stdDeviation="1" floodColor="#156e54" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Smooth upward S-curve passing EXACTLY through Node 1 (38, 74) and Node 2 (64, 48) */}
          <path
            d="M 20 96 C 26 88, 31 81, 38 74 C 47 65, 56 56, 64 48 C 70 41, 73 34, 75 26"
            stroke="url(#careerCurveGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Natural milestone growth accents along curve */}
          <path
            d="M 31 83 L 33 79"
            stroke="#238668"
            strokeWidth="1.3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 50 62 L 53 59"
            stroke="#238668"
            strokeWidth="1.3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 70 40 L 73 37"
            stroke="#238668"
            strokeWidth="1.3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Node 1: Circular node sitting at (38, 74) with glowing pulse */}
          <g transform="translate(38, 74)" filter="url(#nodeShadowFilter)">
            <circle cx="0" cy="0" r="3.2" fill="#d7f0e7" opacity="0.6" className="animate-node-pulse" />
            <circle cx="0" cy="0" r="2.2" fill="#edf8f4" />
            <circle cx="0" cy="0" r="1.3" fill="#156e54" />
          </g>

          {/* Node 2: Circular node sitting at (64, 48) with glowing pulse */}
          <g transform="translate(64, 48)" filter="url(#nodeShadowFilter)">
            <circle cx="0" cy="0" r="3.2" fill="#d7f0e7" opacity="0.6" className="animate-node-pulse" />
            <circle cx="0" cy="0" r="2.2" fill="#edf8f4" />
            <circle cx="0" cy="0" r="1.3" fill="#156e54" />
          </g>
        </svg>

        {/* --- PILL 1: BETTER JOBS --- */}
        {/* Anchored horizontally right next to Node 1 (38%) and vertically centered at 74% */}
        <div
          className="absolute z-20 animate-pill-pop-1"
          style={{
            right: 'calc(100% - 38% + 14px)',
            top: '74%',
            transform: 'translateY(-50%)'
          }}
        >
          <div className="group cursor-pointer flex items-center gap-3 sm:gap-3.5 rounded-full bg-white px-5 py-3 sm:px-6 sm:py-3.5 border border-slate-100 ring-1 ring-black/[0.04] shadow-[0_14px_34px_-6px_rgba(16,91,76,0.18),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_44px_-6px_rgba(16,91,76,0.26),0_8px_16px_rgba(0,0,0,0.06)] hover:scale-105 hover:-translate-y-1.5 transition-all duration-300 ease-out whitespace-nowrap">
            {/* Emerald Briefcase Icon with soft mint badge backing */}
            <div className="shrink-0 text-[#105b4c] p-1.5 rounded-xl bg-brand-50 group-hover:bg-brand-100 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10 3C8.89543 3 8 3.89543 8 5V6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H16V5C16 3.89543 15.1046 3 14 3H10ZM10 5H14V6H10V5ZM4 8H20V11H13V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V11H4V8ZM4 13H11V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V13H20V18H4V13Z" />
              </svg>
            </div>
            {/* 2-line bold text */}
            <div className="text-left leading-[1.15]">
              <span className="block text-sm sm:text-base font-bold text-[#17211f] tracking-tight group-hover:text-brand-700 transition-colors">
                Better
              </span>
              <span className="block text-sm sm:text-base font-bold text-[#17211f] tracking-tight group-hover:text-brand-700 transition-colors">
                Jobs
              </span>
            </div>
          </div>
        </div>

        {/* --- PILL 2: GREAT COMPANIES --- */}
        {/* Anchored horizontally right next to Node 2 (64%) and vertically centered at 48% */}
        <div
          className="absolute z-20 animate-pill-pop-2"
          style={{
            right: 'calc(100% - 64% + 14px)',
            top: '48%',
            transform: 'translateY(-50%)'
          }}
        >
          <div className="group cursor-pointer flex items-center gap-3 sm:gap-3.5 rounded-full bg-white px-5 py-3 sm:px-6 sm:py-3.5 border border-slate-100 ring-1 ring-black/[0.04] shadow-[0_14px_34px_-6px_rgba(16,91,76,0.18),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_44px_-6px_rgba(16,91,76,0.26),0_8px_16px_rgba(0,0,0,0.06)] hover:scale-105 hover:-translate-y-1.5 transition-all duration-300 ease-out whitespace-nowrap">
            {/* Emerald People/Team Icon with soft mint badge backing */}
            <div className="shrink-0 text-[#105b4c] p-1.5 rounded-xl bg-brand-50 group-hover:bg-brand-100 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
              </svg>
            </div>
            {/* 2-line bold text */}
            <div className="text-left leading-[1.15]">
              <span className="block text-sm sm:text-base font-bold text-[#17211f] tracking-tight group-hover:text-brand-700 transition-colors">
                Great
              </span>
              <span className="block text-sm sm:text-base font-bold text-[#17211f] tracking-tight group-hover:text-brand-700 transition-colors">
                Companies
              </span>
            </div>
          </div>
        </div>

        {/* --- PILL 3: CAREER GROWTH --- */}
        {/* Anchored at top right, where the curve terminates */}
        <div
          className="absolute z-20 animate-pill-pop-3"
          style={{
            left: 'calc(75% - 30px)',
            top: '20%',
            transform: 'translateY(-50%)'
          }}
        >
          <div className="group cursor-pointer flex items-center gap-3 sm:gap-3.5 rounded-full bg-white px-5 py-3 sm:px-6 sm:py-3.5 border border-slate-100 ring-1 ring-black/[0.04] shadow-[0_14px_34px_-6px_rgba(16,91,76,0.18),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_44px_-6px_rgba(16,91,76,0.26),0_8px_16px_rgba(0,0,0,0.06)] hover:scale-105 hover:-translate-y-1.5 transition-all duration-300 ease-out whitespace-nowrap">
            {/* Emerald Bar Chart + Upward Trend Icon with soft mint badge backing */}
            <div className="shrink-0 text-[#105b4c] p-1.5 rounded-xl bg-brand-50 group-hover:bg-brand-100 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 19H7V13H4V19ZM9.5 19H12.5V9H9.5V19ZM15 19H18V5H15V19ZM2 21H20C20.55 21 21 20.55 21 20C21 19.45 20.55 19 20 19H2V21Z" />
                <path d="M19 3L15.5 6.5L13 4L8 9L9.41 10.41L13 6.83L15.5 9.33L20.41 4.41V7H22V2H17V3.59H19Z" />
              </svg>
            </div>
            {/* 2-line bold text */}
            <div className="text-left leading-[1.15]">
              <span className="block text-sm sm:text-base font-bold text-[#17211f] tracking-tight group-hover:text-brand-700 transition-colors">
                Career
              </span>
              <span className="block text-sm sm:text-base font-bold text-[#17211f] tracking-tight group-hover:text-brand-700 transition-colors">
                Growth
              </span>
            </div>
          </div>
        </div>

        {/* Accessible screen-reader description */}
        <div className="sr-only">
          <ol>
            <li>Better Jobs</li>
            <li>Great Companies</li>
            <li>Career Growth</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
