import React, { useState } from 'react';
import { SHELTERS_LIST } from '../../../data/mockData';

import { ShelterData } from '../../../types';

interface MapPageProps {
  onNotify?: (msg: string) => void;
  shelters?: ShelterData[];
  userLocationName?: string;
}

export const MapPage: React.FC<MapPageProps> = ({
  onNotify,
  shelters = SHELTERS_LIST,
  userLocationName = 'Current Location'
}) => {
  const [mode, setMode] = useState<'map' | 'satellite' | 'terrain'>('map');
  const [activeLayer, setActiveLayer] = useState<string>('flood');

  return (
    <div className="space-y-4 fade-in pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Map View</h2>
        <p className="text-xs text-slate-500 mt-0.5">Live flood mapping — Hydrological Inundation Layers</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '480px' }}>
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['map', 'satellite', 'terrain'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 text-xs font-medium rounded capitalize transition-all ${
                  mode === m ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['flood', 'rescue', 'shelters', 'roads'].map((l) => (
              <button
                key={l}
                onClick={() => {
                  setActiveLayer(l);
                  onNotify?.(`Layer enabled: ${l.toUpperCase()}`);
                }}
                className={`px-3 py-1 text-[11px] rounded-full border font-medium capitalize transition-all ${
                  activeLayer === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {l}
              </button>
            ))}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-600 border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              Live IMD Radar Feed
            </span>
          </div>
        </div>

        <div className={`relative map-canvas-bg overflow-hidden ${mode === 'satellite' ? 'brightness-75 contrast-125' : ''}`} style={{ height: 'calc(100% - 58px)' }}>
          <div className="river-path"></div>
          <div className="absolute text-[11px] font-bold tracking-widest text-blue-900/60 rotate-45 select-none" style={{ top: '40%', right: '20%' }}>
            MAIN RIVER BASIN
          </div>

          {/* Severe Heatmap Simulation */}
          <div className="heatmap-severe absolute w-80 h-80 rounded-full bg-red-500/20 blur-2xl" style={{ top: '100px', left: '200px' }}></div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 80 300 Q 160 260 260 280 T 480 220" fill="none" stroke="#2563eb" strokeDasharray="8,5" strokeLinecap="round" strokeWidth="4" />
            <circle cx="80" cy="300" fill="#2563eb" r="7" />
            <circle cx="80" cy="300" fill="#2563eb" fillOpacity="0.3" r="14" />
            <circle cx="480" cy="220" fill="#10b981" r="7" />
            <circle cx="480" cy="220" fill="#10b981" fillOpacity="0.3" r="14" />
          </svg>

          {/* Shelters Pins */}
          {shelters.slice(0, 5).map((s, i) => {
            const positions = [
              { top: '25%', left: '22%' },
              { top: '35%', left: '68%' },
              { top: '65%', left: '78%' },
              { top: '72%', left: '28%' },
              { top: '18%', left: '50%' }
            ];
            const pos = positions[i % positions.length];

            return (
              <div
                key={s.id}
                onClick={() => onNotify?.(`Evacuation Shelter: ${s.name} (${s.distance}) • Safe High Ground`)}
                className="absolute flex flex-col items-center cursor-pointer group z-20"
                style={{ top: pos.top, left: pos.left }}
              >
                <span className="bg-white/95 text-[10px] font-semibold px-2 py-0.5 rounded shadow mb-1 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-400 transition-all max-w-[140px] truncate">
                  {s.name}
                </span>
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white text-sm bg-emerald-600 group-hover:scale-110 group-hover:bg-blue-600 transition-all">
                  🏠
                </div>
                <span className="text-[9px] font-bold text-slate-700 bg-white/90 px-1 rounded mt-0.5 shadow-sm">
                  {s.distance.split('•')[0]}
                </span>
              </div>
            );
          })}

          {/* Risk Level Legend */}
          <div className="absolute bottom-5 left-5 bg-white/95 p-3 rounded-xl border border-slate-200 shadow-md w-44 z-10">
            <span className="text-[10px] font-bold text-slate-700 uppercase block mb-2">Flood Inundation Level</span>
            {[
              ['bg-emerald-500', 'Low (Normal)'],
              ['bg-amber-400', 'Moderate (Runoff)'],
              ['bg-orange-500', 'High (Waterlogged)'],
              ['bg-red-600', 'Severe (Flooded)']
            ].map(([bg, l]) => (
              <div key={l} className="flex items-center gap-2 mb-1 text-[11px] text-slate-600">
                <span className={`w-2.5 h-2.5 rounded-full ${bg}`}></span>
                {l}
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute right-4 bottom-4 flex flex-col bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden divide-y divide-slate-100 z-10">
            {['+', '−', '📍'].map((c, i) => (
              <button
                key={i}
                onClick={() => onNotify?.(c === '📍' ? 'Reset to your GPS location' : `Zoom ${c}`)}
                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-sm font-bold"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
