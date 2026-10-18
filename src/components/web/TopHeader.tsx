import React, { useState } from 'react';

interface TopHeaderProps {
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onDetectLocation?: () => void;
  userName?: string;
  userInitials?: string;
  locationName?: string;
  locationTemp?: string;
  weatherCondition?: string;
  weatherEmoji?: string;
  stationName?: string;
  isDetectingLocation?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearch,
  onNotificationClick,
  onDetectLocation,
  userName = 'Adeel Khan',
  userInitials = 'AK',
  locationName = 'Detecting Location...',
  locationTemp = '--°C',
  weatherCondition = 'Updating...',
  weatherEmoji = '⛅',
  stationName = 'IMD Network',
  isDetectingLocation = false
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [notificationCount, setNotificationCount] = useState(1);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchVal.trim()) {
      onSearch(searchVal.trim());
    }
  };

  const handleBellClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      setShowNotificationAlert((prev) => !prev);
    }
  };

  return (
    <header
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30"
      data-purpose="top-navigation-bar"
    >
      {/* Search & Location Bar */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Search city (e.g. Mumbai, Delhi, Ludhiana)..."
            type="text"
          />
        </form>

        {/* GPS Location Auto-Detect Button */}
        <button
          onClick={onDetectLocation}
          disabled={isDetectingLocation}
          title="Detect my current location via GPS"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-colors disabled:opacity-60"
        >
          <svg className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M8.343 15.657l-1.414 1.414m11.314 0l-1.414-1.414M8.343 8.343L6.929 6.929M12 16a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          <span className="hidden md:inline">{isDetectingLocation ? 'Locating...' : 'Auto-Detect'}</span>
        </button>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-5">
        {/* Weather & IMD Station Mini Widget */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-base flex items-center justify-center shadow-inner">
            {weatherEmoji}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>{locationTemp}</span>
              <span className="text-[10px] text-slate-500 font-normal">({locationName})</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>{weatherCondition}</span>
              <span>•</span>
              <span className="text-blue-600 font-medium truncate max-w-[110px]" title={stationName}>
                IMD: {stationName}
              </span>
            </div>
          </div>
        </div>

        {/* Notification Bell Icon */}
        <div className="relative">
          <button
            onClick={handleBellClick}
            aria-label="Notifications"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative block"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotificationAlert && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Hydrological Alerts</span>
                <button
                  onClick={() => {
                    setNotificationCount(0);
                    setShowNotificationAlert(false);
                  }}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  Mark read
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                <p className="font-semibold text-amber-600">Active Station Watch</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Live IMD &amp; Open-Meteo feeds active for {locationName}.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/20">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};
