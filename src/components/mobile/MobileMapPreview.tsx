import React from 'react';

interface MobileMapPreviewProps {
  onExploreMap?: () => void;
  shelterName?: string;
}

export const MobileMapPreview: React.FC<MobileMapPreviewProps> = ({
  onExploreMap,
  shelterName = 'Govt High School (1.2 km)'
}) => {
  return (
    <section className="pt-2" data-purpose="evacuation-preview">
      <div className="flex justify-between items-center mb-2.5">
        <h2 className="text-sm font-bold text-slate-800">Flood Risk &amp; Route</h2>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Safe Route Active
        </span>
      </div>

      {/* Interactive Map Preview Styled Card */}
      <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200">
        {/* Stylized Map Vector Pattern Representing City & Danger Zones */}
        <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 400 160">
          {/* Background land/grid */}
          <rect fill="#f1f5f9" height="160" width="400" />
          <path d="M-10,40 Q60,35 120,60 T250,50 T410,70" fill="none" stroke="#cbd5e1" strokeWidth="8" />
          <path d="M80,-10 Q110,60 140,110 T180,180" fill="none" stroke="#cbd5e1" strokeWidth="6" />
          <path d="M220,-10 Q240,60 270,100 T310,180" fill="none" stroke="#cbd5e1" strokeWidth="6" />
          {/* River Ganga / Water body simulation */}
          <path d="M0,120 C100,100 180,135 250,115 C320,95 360,110 400,100 L400,160 L0,160 Z" fill="#bae6fd" opacity="0.8" />
          {/* Flood Hazard Heatmap concentric zones */}
          <circle cx="280" cy="70" fill="#ef4444" opacity="0.18" r="50" />
          <circle cx="280" cy="70" fill="#f97316" opacity="0.25" r="30" />
          <circle cx="280" cy="70" fill="#ef4444" opacity="0.5" r="15" />
          {/* Safe Route Pathway */}
          <path d="M60,110 L110,80 L160,70 L210,35 L260,30" fill="none" stroke="#2563eb" strokeDasharray="6,4" strokeLinecap="round" strokeWidth="4" />
          {/* Current Location Pin */}
          <circle cx="60" cy="110" fill="#2563eb" r="6" />
          <circle cx="60" cy="110" fill="#2563eb" opacity="0.3" r="10" />
          {/* Target Safe Shelter Pin */}
          <circle cx="260" cy="30" fill="#10b981" r="6" />
          <circle cx="260" cy="30" fill="#10b981" opacity="0.3" r="10" />
        </svg>

        {/* Floating Badges over Map */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md rounded-lg px-2 py-1 shadow-sm border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{shelterName}</span>
        </div>

        <button
          onClick={onExploreMap}
          className="absolute bottom-2.5 right-2.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-blue-500/30 flex items-center space-x-1 cursor-pointer hover:bg-blue-700 active:scale-95 transition-all"
        >
          <span>Explore Map</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
};
