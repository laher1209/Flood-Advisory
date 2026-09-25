import React from 'react';

interface MobileGreetingProps {
  userName?: string;
  locationName?: string;
  onLocationClick?: () => void;
}

export const MobileGreeting: React.FC<MobileGreetingProps> = ({
  userName = 'Adeel',
  locationName = 'Ludhiana, Punjab',
  onLocationClick
}) => {
  return (
    <section data-purpose="user-greeting">
      <div className="flex items-center space-x-1.5">
        <h1 className="text-xl font-bold text-slate-900">Good Morning, {userName}</h1>
        <span className="text-xl animate-bounce">👋</span>
      </div>
      <p className="text-xs text-slate-500 mt-0.5">Here's the latest flood information for your area.</p>

      {/* Location Selection Card / Pill */}
      <div
        onClick={onLocationClick}
        className="mt-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-3.5 shadow-md shadow-blue-500/20 flex items-center justify-between cursor-pointer active:scale-[0.99] transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">Your Location</p>
            <p className="text-sm font-bold leading-tight">{locationName}</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
};
