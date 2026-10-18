import React from 'react';
import { ShelterData } from '../../types';

interface NearestSheltersProps {
  shelters: ShelterData[];
  onViewAll?: () => void;
  onRouteClick?: (shelter: ShelterData) => void;
}

export const NearestShelters: React.FC<NearestSheltersProps> = ({
  shelters,
  onViewAll,
  onRouteClick
}) => {
  const topShelters = shelters.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 leading-tight">Nearest Shelters</h4>
              <p className="text-[11px] text-slate-400">Available evacuation centers nearby</p>
            </div>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            View All ({shelters.length})
          </button>
        </div>

        {/* Quick shelter items */}
        <div className="space-y-2.5">
          {topShelters.map((shelter) => {
            const available = shelter.availableBeds ?? (shelter.capacity - (shelter.occupied ?? 0));
            return (
              <div
                key={shelter.id}
                className="bg-slate-50 hover:bg-blue-50/50 p-3 rounded-xl flex items-center justify-between gap-2 transition-colors border border-slate-100"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h5 className="text-xs font-bold text-slate-800 truncate" title={shelter.name}>
                      {shelter.name}
                    </h5>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 font-semibold rounded-full">
                      {shelter.statusText}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    📍 {shelter.distance.split('•')[0]} • <span className="text-emerald-700 font-medium">{available} beds free</span>
                  </p>
                </div>
                <button
                  onClick={() => onRouteClick?.(shelter)}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0 flex items-center gap-1"
                >
                  <span>🧭</span>
                  <span>Route</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Verified by Municipal Authority</span>
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:underline font-semibold"
        >
          Check Facilities →
        </button>
      </div>
    </div>
  );
};
