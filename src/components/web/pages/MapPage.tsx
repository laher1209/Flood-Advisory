import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ShelterData } from '../../../types';
import { MAPBOX_ACCESS_TOKEN } from '../../../services/mapboxService';
import { SHELTERS_LIST } from '../../../data/mockData';

interface MapPageProps {
  onNotify?: (msg: string) => void;
  shelters?: ShelterData[];
  userLocationName?: string;
  userCoords?: { lat: number; lon: number };
}

export const MapPage: React.FC<MapPageProps> = ({
  onNotify,
  shelters = SHELTERS_LIST,
  userLocationName = 'Current Location',
  userCoords
}) => {
  const [mode, setMode] = useState<'streets' | 'satellite' | 'outdoors'>('streets');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hospital' | 'school' | 'community'>('all');
  const [is3D, setIs3D] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const shelterMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const centerLat = userCoords?.lat || 26.8393;
  const centerLon = userCoords?.lon || 80.9231;

  // Filter shelters based on category
  const filteredShelters = shelters.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.category === activeFilter;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    let styleUri = 'mapbox://styles/mapbox/streets-v12';
    if (mode === 'satellite') styleUri = 'mapbox://styles/mapbox/satellite-streets-v12';
    else if (mode === 'outdoors') styleUri = 'mapbox://styles/mapbox/outdoors-v12';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUri,
      center: [centerLon, centerLat],
      zoom: 13.5,
      pitch: is3D ? 45 : 0,
      bearing: is3D ? -20 : 0
    });

    mapRef.current = map;

    // Add navigation & geolocate controls
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }),
      'top-right'
    );
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.on('load', () => {
      // 1. Add User Origin Marker
      const userEl = document.createElement('div');
      userEl.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; height: 32px; width: 32px; border-radius: 9999px; background: #60a5fa; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position: relative; height: 20px; width: 20px; border-radius: 9999px; background: #2563eb; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></span>
        </div>
      `;

      new mapboxgl.Marker({ element: userEl })
        .setLngLat([centerLon, centerLat])
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(`
            <div style="font-family: inherit; padding: 2px;">
              <p style="font-size: 11px; font-weight: 700; color: #1e3a8a; margin: 0 0 2px;">📍 ${userLocationName}</p>
              <p style="font-size: 10px; color: #64748b; margin: 0;">Lat: ${centerLat.toFixed(4)}°, Lon: ${centerLon.toFixed(4)}°</p>
            </div>
          `)
        )
        .addTo(map);

      // 2. Add Shelter Markers
      shelterMarkersRef.current.forEach((m) => m.remove());
      shelterMarkersRef.current = [];

      filteredShelters.forEach((s) => {
        if (typeof s.latitude !== 'number' || typeof s.longitude !== 'number') return;

        const shelterEl = document.createElement('div');
        const isHospital = s.category === 'hospital';
        const isCommunity = s.category === 'community';
        const icon = isHospital ? '🏥' : isCommunity ? '🏛️' : '🏫';
        const bg = isHospital ? '#dc2626' : isCommunity ? '#d97706' : '#2563eb';

        shelterEl.innerHTML = `
          <div style="background-color: ${bg}; color: white; border-radius: 9999px; padding: 3px 8px; font-size: 10px; font-weight: 800; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.25); border: 2px solid white; cursor: pointer;">
            <span>${icon}</span>
            <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.name.replace(/^[^\w\s]+/, '').trim()}</span>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 15, maxWidth: '250px' }).setHTML(`
          <div style="padding: 4px; font-family: sans-serif;">
            <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">${s.name}</div>
            <div style="font-size: 11px; color: #2563eb; font-weight: 700; margin-bottom: 4px;">🚶 ${s.distance}</div>
            <div style="display: flex; gap: 4px; margin-bottom: 4px;">
              <span style="font-size: 10px; padding: 2px 6px; background: #ecfdf5; color: #047857; font-weight: 700; border-radius: 4px;">
                Beds: ${s.availableBeds || s.capacity}
              </span>
              <span style="font-size: 10px; padding: 2px 6px; background: #eff6ff; color: #1d4ed8; font-weight: 700; border-radius: 4px;">
                Safety: ${s.floodSafetyScore || 95}%
              </span>
            </div>
            <p style="font-size: 10px; color: #64748b; margin: 0 0 4px;">${s.address || 'Designated High Ground Evacuation Center'}</p>
            <a href="https://www.google.com/maps/dir/?api=1&origin=${centerLat},${centerLon}&destination=${s.latitude},${s.longitude}" target="_blank" style="display: block; text-align: center; background: #2563eb; color: white; padding: 5px; border-radius: 6px; font-size: 10px; font-weight: 700; text-decoration: none; margin-top: 4px;">
              🧭 Get Turn-by-Turn Directions
            </a>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: shelterEl })
          .setLngLat([s.longitude, s.latitude])
          .setPopup(popup)
          .addTo(map);

        shelterMarkersRef.current.push(marker);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mode, activeFilter, is3D, centerLat, centerLon, filteredShelters]);

  const handleResetLocation = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [centerLon, centerLat],
        zoom: 14,
        pitch: 0,
        bearing: 0,
        essential: true
      });
      onNotify?.('Re-centered map on your doorstep coordinates');
    }
  };

  return (
    <div className="space-y-4 fade-in pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Live Hydrological &amp; Safe Shelters Map</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
              Mapbox GL Vector
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive GIS topography, physical shelter markers, and flood inundation assessment
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Style Toggles */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setMode('streets')}
              className={`px-3 py-1 font-bold rounded-lg transition-all ${
                mode === 'streets' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              🗺️ Streets
            </button>
            <button
              onClick={() => setMode('satellite')}
              className={`px-3 py-1 font-bold rounded-lg transition-all ${
                mode === 'satellite' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => setMode('outdoors')}
              className={`px-3 py-1 font-bold rounded-lg transition-all ${
                mode === 'outdoors' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              ⛰️ Terrain
            </button>
          </div>

          <button
            onClick={() => setIs3D((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              is3D
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {is3D ? '3D Active' : '3D Tilt'}
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col"
        style={{ height: 'calc(100vh - 220px)', minHeight: '520px' }}
      >
        {/* Sub-header Filter Tabs */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-white z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1">Shelters Filter:</span>
            {[
              { id: 'all', label: `All Shelters (${shelters.length})` },
              { id: 'hospital', label: `🏥 Medical (${shelters.filter((s) => s.category === 'hospital').length})` },
              { id: 'school', label: `🏫 Schools (${shelters.filter((s) => s.category === 'school').length})` },
              { id: 'community', label: `🏛️ Community Halls (${shelters.filter((s) => s.category === 'community').length})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeFilter === f.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetLocation}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M8.343 15.657l-1.414 1.414m11.314 0l-1.414-1.414M8.343 8.343L6.929 6.929M12 16a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              <span>Center GPS</span>
            </button>
          </div>
        </div>

        {/* Real Interactive Mapbox Map Container */}
        <div className="relative flex-1 w-full h-full">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

          {/* Floating Elevation & Inundation Legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl max-w-xs z-10 space-y-2 pointer-events-auto">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
              Flood Inundation &amp; Elevation
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-700 font-medium">Safe Elevated Ridge (&gt; 22m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
                <span className="text-slate-700 font-medium">Moderate Runoff Buffer (16–22m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
                <span className="text-slate-700 font-medium">High Inundation Risk (&lt; 16m)</span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-slate-200/80 text-[10px] text-slate-500">
              📍 Current Doorstep: {userLocationName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
