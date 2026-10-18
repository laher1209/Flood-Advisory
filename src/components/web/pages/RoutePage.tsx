import React, { useState } from 'react';
import { Badge } from './Badge';

import { ShelterData } from '../../../types';

interface RoutePageProps {
  onNotify?: (msg: string) => void;
  currentLocation?: string;
  targetShelter?: ShelterData;
}

export const RoutePage: React.FC<RoutePageProps> = ({
  onNotify,
  currentLocation = 'Your Detected Location',
  targetShelter
}) => {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-4 fade-in pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Safe Evacuation Route Guidance</h2>
        <p className="text-xs text-slate-500 mt-0.5">Real-time dynamic rerouting avoiding inundated and flooded corridors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Route Map Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" style={{ height: '420px' }}>
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Evacuation Pathway Map</span>
            <Badge color="emerald">Live Navigation GPS</Badge>
          </div>

          <div className="relative map-canvas-bg overflow-hidden" style={{ height: 'calc(100% - 45px)' }}>
            <div className="river-path"></div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 60 280 L 100 240 L 160 220 L 220 180 L 290 140 L 360 100" fill="none" stroke="#2563eb" strokeDasharray="10,6" strokeLinecap="round" strokeWidth="5" />
              <path d="M 60 280 L 100 300 L 180 310 L 280 290" fill="none" stroke="#ef4444" strokeDasharray="8,5" strokeLinecap="round" strokeWidth="3" strokeOpacity="0.5" />
              <circle cx="60" cy="280" fill="#2563eb" r="8" />
              <circle cx="60" cy="280" fill="#2563eb" fillOpacity="0.25" r="16" />
              <circle cx="360" cy="100" fill="#10b981" r="8" />
              <circle cx="360" cy="100" fill="#10b981" fillOpacity="0.25" r="16" />
            </svg>

            {/* Inundation Danger Hazard */}
            <div className="heatmap-severe absolute w-48 h-48 rounded-full bg-red-500/25 blur-xl" style={{ top: '160px', left: '200px' }}></div>

            <div className="absolute top-4 left-4 bg-white/95 p-3 rounded-xl border border-slate-200 shadow text-xs z-10 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-1 bg-blue-600 rounded-full"></span>
                <span className="text-slate-700 font-semibold">Safe Route (High Elevation)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-1 bg-red-400 rounded-full"></span>
                <span className="text-slate-500">Submerged Road (Avoid)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Waypoints & Details */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Evacuation Corridor</h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  A
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Current Position</p>
                  <p className="text-[11px] text-slate-500 font-medium">{currentLocation}</p>
                </div>
              </div>

              <div className="w-px h-3 bg-slate-300 ml-6"></div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  B
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {targetShelter?.name || 'Municipal Relief Center'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {targetShelter?.distance || '1.2 km away • Primary Shelter'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
            <h3 className="font-bold text-sm text-slate-800 mb-2">Metrics</h3>
            <div className="grid grid-cols-2 gap-2 text-center mb-3">
              {[
                [
                  targetShelter?.distanceKm ? `${Math.max(4, Math.round(targetShelter.distanceKm * 12))} min` : '6 min',
                  'ETA (Walking)'
                ],
                [
                  targetShelter?.distance ? targetShelter.distance.split('•')[0].trim() : '1.2 km',
                  'Distance'
                ],
                [
                  targetShelter?.elevationMeters ? `+${targetShelter.elevationMeters}m High` : 'Elevated',
                  'Corridor Safety'
                ],
                ['Safe Elevated Ridge', 'Access Road']
              ].map(([v, l]) => (
                <div key={l} className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <div className="font-bold text-blue-700 text-sm">{v}</div>
                  <div className="text-[10px] text-slate-500">{l}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setActive(!active);
                onNotify?.(active ? 'Evacuation navigation stopped' : '🧭 Safe Navigation Initiated — Turn-by-turn guidance active!');
              }}
              className={`w-full py-2.5 text-white rounded-xl font-semibold text-xs shadow-sm transition-all ${
                active ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {active ? 'Navigation Active (Tap to Stop)' : 'Start Safe Evacuation Guidance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
