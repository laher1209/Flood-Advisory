import React, { useState } from 'react';

interface TopHeaderProps {
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  userName?: string;
  userInitials?: string;
  locationTemp?: string;
  weatherCondition?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearch,
  onNotificationClick,
  userName = 'Adeel Khan',
  userInitials = 'AK',
  locationTemp = '28°C',
  weatherCondition = 'Partly Cloudy'
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [notificationCount, setNotificationCount] = useState(1);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
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
      {/* Search Input Container */}
      <form onSubmit={handleSearchSubmit} className="w-96 relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Search location (city, district, area)..."
          type="text"
        />
      </form>

      {/* Right Header Actions */}
      <div className="flex items-center gap-6">
        {/* Date & Time Info */}
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-slate-700">Mon, 14 Jul 2025</div>
          <div className="text-[11px] text-slate-400">10:24 AM</div>
        </div>

        {/* Weather Widget Mini */}
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <svg className="w-5 h-5 fill-amber-400" viewBox="0 0 24 24">
              <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zm-9-9V2a1 1 0 10-2 0v2a1 1 0 102 0zm0 18v-2a1 1 0 10-2 0v2a1 1 0 102 0zm-6.364-14.364l1.414 1.414a1 1 0 001.414-1.414L6.05 4.636a1 1 0 00-1.414 1.414zm12.728 12.728l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 1.414zM4.636 17.95l1.414-1.414a1 1 0 00-1.414-1.414L3.222 16.536a1 1 0 001.414 1.414zm14.142-14.142a1 1 0 00-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">{locationTemp}</div>
            <div className="text-[10px] text-slate-400">{weatherCondition}</div>
          </div>
        </div>

        {/* Notification Bell Icon with Badge & Dropdown */}
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
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <button
                  onClick={() => {
                    setNotificationCount(0);
                    setShowNotificationAlert(false);
                  }}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                <p className="font-semibold text-red-600">Flash Flood Alert</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Water level rise in Riverside Sector 3. Take necessary precautions.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Component */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/20">
              {userInitials}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              {userName}
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">● Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
