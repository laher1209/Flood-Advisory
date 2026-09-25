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
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition-shadow">
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
            <p className="text-[11px] text-slate-400">Available evacuation centers</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Quick shelter item */}
      <div className="space-y-3">
        {shelters.map((shelter) => (
          <div key={shelter.id} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-800">{shelter.name}</h5>
              <p className="text-[11px] text-slate-500">
                {shelter.distance} • Capacity: {shelter.capacity}
              </p>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                {shelter.statusText}
              </span>
            </div>
            <button
              onClick={() => onRouteClick?.(shelter)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors active:scale-95"
            >
              Route
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
