import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'light', size = 'md', showTagline = false }) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Distinctive Travel Icon: Minimal Waypoint Pin + Continuous Winding Journey Route + Compass Apex */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        >
          {/* Outer Rounded Container with subtle border */}
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="12"
            className={
              isLight
                ? 'fill-slate-900 stroke-teal-500/40'
                : 'fill-white stroke-slate-200 shadow-xs'
            }
            strokeWidth="1.5"
          />

          {/* Continuous Journey Ribbon (S-curve path from bottom-left arching through waypoint to top-right) */}
          <path
            d="M9 33C14 33 16 26 21 24C26 22 28 15 34 11"
            stroke="url(#saathiJourneyPath)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Subtle Waypoint Route Guidance Dash */}
          <path
            d="M13 28L18 20"
            stroke={isLight ? '#5EEAD4' : '#0D9488'}
            strokeWidth="1.2"
            strokeDasharray="2 2"
            strokeOpacity="0.7"
          />

          {/* Minimal Modern Location Pin Silhouette */}
          <path
            d="M26 12C26 8.68629 23.3137 6 20 6C16.6863 6 14 8.68629 14 12C14 16.5 20 22 20 22C20 22 26 16.5 26 12Z"
            fill="url(#pinGradient)"
            className="drop-shadow-xs"
          />

          {/* Location Pin Center Eyelet */}
          <circle cx="20" cy="12" r="2.4" fill={isLight ? '#0F172A' : '#FFFFFF'} />

          {/* Forward Compass Direction Arrowhead at journey end */}
          <path
            d="M31 10L35 11L34 15"
            stroke="#F59E0B"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Gradient Definitions */}
          <defs>
            <linearGradient id="saathiJourneyPath" x1="9" y1="33" x2="34" y2="11" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284C7" />
              <stop offset="0.5" stopColor="#0D9488" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="pinGradient" x1="14" y1="6" x2="26" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14B8A6" />
              <stop offset="1" stopColor="#0F766E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-display font-extrabold tracking-tight ${textSizes[size]} leading-none ${
            isLight ? 'text-white' : 'text-slate-900'
          }`}
        >
          Yatra <span className="text-teal-600 font-extrabold">Saathi</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] tracking-wider uppercase font-semibold mt-1 ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Travel Smarter
          </span>
        )}
      </div>
    </div>
  );
};
