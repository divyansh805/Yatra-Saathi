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
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Modern Travel-Themed Emblem: Location Pin + Winding Path + Subtle Compass Waypoint */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle Outer Compass Horizon Ring */}
          <circle
            cx="24"
            cy="24"
            r="21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            className={isLight ? 'text-teal-400/40' : 'text-teal-600/40'}
          />

          {/* Background Rounded Shield / Capsule */}
          <rect
            x="6"
            y="6"
            width="36"
            height="36"
            rx="12"
            className={isLight ? 'fill-slate-900/80 stroke-teal-500/30' : 'fill-slate-900 stroke-teal-500/40'}
            strokeWidth="1.5"
          />

          {/* Dynamic Journey Path (S-Curve road) */}
          <path
            d="M13 36C18 36 17 25 24 25C31 25 29 13 35 13"
            stroke="url(#journeyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Journey Waypoint Pulse Line */}
          <path
            d="M16 35L22 26"
            stroke="#14B8A6"
            strokeWidth="1"
            strokeDasharray="1.5 2"
          />

          {/* Central Modern Waypoint Pin */}
          <circle cx="24" cy="24" r="3.5" fill="#0D9488" />
          <circle cx="24" cy="24" r="1.5" fill="#F8FAFC" />

          {/* North Direction Marker (Subtle Compass Arrow) */}
          <path
            d="M33 11L37 15L33 19L34 15L33 11Z"
            fill="#F59E0B"
          />

          <defs>
            <linearGradient id="journeyGradient" x1="13" y1="36" x2="35" y2="13" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="0.5" stopColor="#0D9488" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col justify-center">
        <span
          className={`font-display font-bold tracking-tight ${textSizes[size]} leading-none ${
            isLight ? 'text-white' : 'text-slate-900'
          }`}
        >
          Yatra <span className="text-teal-400 font-extrabold">Saathi</span>
        </span>
        {showTagline && (
          <span className={`text-[10px] tracking-wider uppercase font-medium mt-1 ${isLight ? 'text-slate-300' : 'text-slate-500'}`}>
            Travel Smarter
          </span>
        )}
      </div>
    </div>
  );
};
