import React, { useState } from 'react';

interface RoutePlannerProps {
  currentLocation?: string;
  targetShelter?: string;
  estimatedTime?: string;
  onStartNavigation?: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  currentLocation = 'Sector 4, Model Town',
  targetShelter = 'Govt High School (1.2 km)',
  estimatedTime = '6 min',
  onStartNavigation
}) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleToggleNavigation = () => {
    setIsNavigating((prev) => !prev);
    onStartNavigation?.();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">Best Route Guidance</h4>
            <p className="text-[11px] text-slate-400">Avoid flooded paths in real-time</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
          Live Navigation
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="font-medium">Current Location:</span>
          <span className="text-slate-800 font-semibold ml-auto truncate">{currentLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium">Target Shelter:</span>
          <span className="text-slate-800 font-semibold ml-auto truncate">{targetShelter}</span>
        </div>

        <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-bold text-blue-900">Recommended Route: High Ground</div>
            <div className="text-[11px] text-blue-600 mt-0.5">Avoids Riverside bypass flood hazard</div>
          </div>
          <span className="font-bold text-blue-800 text-sm">{estimatedTime}</span>
        </div>

        <button
          onClick={handleToggleNavigation}
          className={`w-full mt-2 py-2 text-white rounded-lg font-semibold text-xs transition-all shadow-sm ${
            isNavigating
              ? 'bg-emerald-600 hover:bg-emerald-700 animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
          }`}
        >
          {isNavigating ? '🧭 Navigation Active - Turn-by-Turn Enabled' : 'Start Safe Navigation'}
        </button>
      </div>
    </div>
  );
};
