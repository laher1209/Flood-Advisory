import React from 'react';

export type MobileNavTab = 'home' | 'map' | 'shelters' | 'alerts' | 'more';

interface MobileBottomNavProps {
  activeTab: MobileNavTab;
  onSelectTab: (tab: MobileNavTab) => void;
  alertBadge?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  alertBadge = true
}) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 px-4 py-2 flex justify-between items-center z-30 select-none">
      {/* Nav Item 1: Home */}
      <button
        onClick={() => onSelectTab('home')}
        aria-label="Home"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <svg className="w-5 h-5 stroke-current" fill={activeTab === 'home' ? 'currentColor' : 'none'} viewBox="0 0 24 24">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className="text-[10px] font-bold mt-1 tracking-tight">Home</span>
      </button>

      {/* Nav Item 2: Map */}
      <button
        onClick={() => onSelectTab('map')}
        aria-label="Map"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'map' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" x2="8" y1="2" y2="18" />
          <line x1="16" x2="16" y1="6" y2="22" />
        </svg>
        <span className="text-[10px] font-semibold mt-1 tracking-tight">Map</span>
      </button>

      {/* Nav Item 3: Shelters */}
      <button
        onClick={() => onSelectTab('shelters')}
        aria-label="Shelters"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'shelters' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] font-semibold mt-1 tracking-tight">Shelters</span>
      </button>

      {/* Nav Item 4: Alerts */}
      <button
        onClick={() => onSelectTab('alerts')}
        aria-label="Alerts"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'alerts' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
          {alertBadge && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-1 tracking-tight">Alerts</span>
      </button>

      {/* Nav Item 5: More */}
      <button
        onClick={() => onSelectTab('more')}
        aria-label="More"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'more' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
        <span className="text-[10px] font-semibold mt-1 tracking-tight">More</span>
      </button>
    </nav>
  );
};
