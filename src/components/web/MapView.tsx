import React, { useState } from 'react';

interface MapViewProps {
  onSelectMarker?: (markerName: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ onSelectMarker }) => {
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const handleMarkerClick = (name: string) => {
    setSelectedMarker(name);
    onSelectMarker?.(name);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 70));
  };

  const handleResetLocation = () => {
    setZoomLevel(100);
    setSelectedMarker(null);
  };

  return (
    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[460px]">
      {/* Map Header / Toggle Buttons */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMapMode('map')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
              mapMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              mapMode === 'satellite' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satellite
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-600 border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            Live Sensor Feed
          </span>
        </div>
      </div>

      {/* Interactive Simulated Map Container */}
      <div
        className={`relative flex-1 map-canvas-bg overflow-hidden transition-all duration-300 ${
          mapMode === 'satellite' ? 'brightness-90 contrast-125' : ''
        }`}
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
      >
        {/* Simulated River Canvas Path */}
        <div className="river-path"></div>
        <div className="absolute text-[11px] font-bold tracking-widest text-blue-900/60 rotate-45 top-1/2 right-1/4 select-none pointer-events-none">
          RIVER GANGA
        </div>

        {/* Heatmap Gradient Area Overlay for Flood Hazard */}
        <div className="heatmap-severe absolute w-64 h-64 rounded-full top-28 left-48 pointer-events-none"></div>

        {/* Road / Route Polyline Simulation (Blue dashed rescue path) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 120 220 Q 200 190 280 230 T 420 180"
            fill="none"
            stroke="#2563eb"
            strokeDasharray="6,4"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="120" cy="220" fill="#2563eb" r="5" />
          <circle cx="420" cy="180" fill="#dc2626" r="5" />
        </svg>

        {/* Map Location Markers */}
        {/* Marker: Riverside Area (Warning) */}
        <div
          onClick={() => handleMarkerClick('Riverside Area')}
          className="absolute top-20 left-28 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
        >
          <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] font-semibold text-slate-700 px-2 py-0.5 rounded shadow-sm mb-1 group-hover:bg-blue-50 transition-colors">
            Riverside
          </span>
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-blue-500/30 group-hover:scale-110 transition-transform">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Marker: Green Park (Severe Hazard Zone) */}
        <div
          onClick={() => handleMarkerClick('Green Park')}
          className="absolute top-16 right-36 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
        >
          <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] font-semibold text-slate-700 px-2 py-0.5 rounded shadow-sm mb-1 group-hover:bg-emerald-50 transition-colors">
            Green Park
          </span>
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-500/30 group-hover:scale-110 transition-transform">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Marker: High Risk Center Hotspot */}
        <div
          onClick={() => handleMarkerClick('High Risk Center')}
          className="absolute top-44 left-72 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl border-2 border-white animate-pulse hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Marker: Sunset Colony */}
        <div
          onClick={() => handleMarkerClick('Sunset Colony')}
          className="absolute bottom-28 left-40 transform -translate-x-1/2 flex flex-col items-center cursor-pointer group"
        >
          <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] font-semibold text-slate-700 px-2 py-0.5 rounded shadow-sm mb-1 group-hover:bg-blue-50 transition-colors">
            Sunset Colony
          </span>
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Marker: Kailash Nagar */}
        <div
          onClick={() => handleMarkerClick('Kailash Nagar')}
          className="absolute bottom-12 right-48 transform -translate-x-1/2 flex flex-col items-center cursor-pointer group"
        >
          <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] font-semibold text-slate-700 px-2 py-0.5 rounded shadow-sm mb-1 group-hover:bg-blue-50 transition-colors">
            Kailash Nagar
          </span>
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Map Controls (Zoom & Location) */}
        <div className="absolute right-4 bottom-5 flex flex-col bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden divide-y divide-slate-100 z-10">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-sm"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-sm"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleResetLocation}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            title="Recenter"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Flood Risk Level Legend Floating Box */}
        <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/90 shadow-md z-10 w-44">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
            Flood Risk Level
          </span>
          <div className="space-y-1.5 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        {/* Selected Marker Toast Feedback */}
        {selectedMarker && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-20 flex items-center gap-2">
            <span>Selected Area: <strong>{selectedMarker}</strong></span>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-slate-400 hover:text-white text-xs ml-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
