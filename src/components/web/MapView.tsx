import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ShelterData } from '../../types';
import { MAPBOX_ACCESS_TOKEN } from '../../services/mapboxService';

interface MapViewProps {
  onSelectMarker?: (markerName: string) => void;
  userCoords?: { lat: number; lon: number };
  userLocationName?: string;
  shelters?: ShelterData[];
}

export const MapView: React.FC<MapViewProps> = ({
  onSelectMarker,
  userCoords,
  userLocationName = 'Your Location',
  shelters = []
}) => {
  const [mapMode, setMapMode] = useState<'streets' | 'satellite' | 'outdoors'>('streets');
  const [is3D, setIs3D] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const shelterMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const centerLat = userCoords?.lat || 26.8393;
  const centerLon = userCoords?.lon || 80.9231;

  // Initialize Mapbox Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    let styleUri = 'mapbox://styles/mapbox/streets-v12';
    if (mapMode === 'satellite') styleUri = 'mapbox://styles/mapbox/satellite-streets-v12';
    else if (mapMode === 'outdoors') styleUri = 'mapbox://styles/mapbox/outdoors-v12';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUri,
      center: [centerLon, centerLat],
      zoom: 13.5,
      pitch: is3D ? 45 : 0,
      bearing: is3D ? -15 : 0
    });

    mapRef.current = map;

    // Navigation Controls
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }),
      'top-right'
    );

    // Create User Location Marker with pulsing blue dot
    const userEl = document.createElement('div');
    userEl.className = 'user-pin-wrapper';
    userEl.innerHTML = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-lg"></span>
      </div>
    `;

    const userPopup = new mapboxgl.Popup({ offset: 12 }).setHTML(`
      <div style="font-family: inherit; padding: 2px;">
        <p style="font-size: 11px; font-weight: 700; color: #1e3a8a; margin: 0 0 2px;">📍 ${userLocationName}</p>
        <p style="font-size: 10px; color: #64748b; margin: 0;">Lat: ${centerLat.toFixed(4)}°, Lon: ${centerLon.toFixed(4)}°</p>
      </div>
    `);

    userMarkerRef.current = new mapboxgl.Marker({ element: userEl })
      .setLngLat([centerLon, centerLat])
      .setPopup(userPopup)
      .addTo(map);

    // Clean up previous shelter markers
    shelterMarkersRef.current.forEach((m) => m.remove());
    shelterMarkersRef.current = [];

    // Add Shelter Markers
    shelters.forEach((s) => {
      if (typeof s.latitude !== 'number' || typeof s.longitude !== 'number') return;

      const shelterEl = document.createElement('div');
      shelterEl.className = 'shelter-marker-pill';
      const isHospital = s.category === 'hospital';
      const isCommunity = s.category === 'community';
      const icon = isHospital ? '🏥' : isCommunity ? '🏛️' : '🏫';
      const bg = isHospital ? '#dc2626' : isCommunity ? '#d97706' : '#2563eb';

      shelterEl.innerHTML = `
        <div style="background-color: ${bg}; color: white; border-radius: 9999px; padding: 3px 8px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); border: 2px solid white; cursor: pointer;">
          <span>${icon}</span>
          <span style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.name.replace(/^[^\w\s]+/, '').trim()}</span>
        </div>
      `;

      shelterEl.addEventListener('click', () => {
        onSelectMarker?.(s.name);
      });

      const popup = new mapboxgl.Popup({ offset: 15, maxWidth: '240px' }).setHTML(`
        <div style="padding: 4px; font-family: sans-serif;">
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">${s.name}</div>
          <div style="font-size: 11px; color: #3b82f6; font-weight: 600; margin-bottom: 4px;">🚶 ${s.distance}</div>
          <div style="display: flex; gap: 4px; margin-bottom: 4px;">
            <span style="font-size: 10px; padding: 2px 6px; background: #ecfdf5; color: #047857; font-weight: 700; border-radius: 4px;">
              Beds: ${s.availableBeds || s.capacity}
            </span>
            <span style="font-size: 10px; padding: 2px 6px; background: #eff6ff; color: #1d4ed8; font-weight: 700; border-radius: 4px;">
              Elev: ${s.elevationMeters || 20}m
            </span>
          </div>
          <p style="font-size: 10px; color: #64748b; margin: 0 0 4px;">${s.address || 'Safe High Ground Evacuation Center'}</p>
          <a href="https://www.google.com/maps/dir/?api=1&origin=${centerLat},${centerLon}&destination=${s.latitude},${s.longitude}" target="_blank" style="display: block; text-align: center; background: #2563eb; color: white; padding: 4px; border-radius: 6px; font-size: 10px; font-weight: 700; text-decoration: none; margin-top: 4px;">
            🧭 Turn-by-Turn Navigation
          </a>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: shelterEl })
        .setLngLat([s.longitude, s.latitude])
        .setPopup(popup)
        .addTo(map);

      shelterMarkersRef.current.push(marker);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapMode, centerLat, centerLon, shelters, is3D]);

  const handleResetLocation = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [centerLon, centerLat],
        zoom: 14,
        pitch: 0,
        bearing: 0,
        essential: true
      });
    }
  };

  return (
    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[460px]">
      {/* Map Header / Layer Toggles */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-white z-10 flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMapMode('streets')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              mapMode === 'streets'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Streets
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              mapMode === 'satellite'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setMapMode('outdoors')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              mapMode === 'outdoors'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⛰️ Terrain
          </button>
        </div>

        {/* 3D and Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIs3D((prev) => !prev)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              is3D
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle 3D Perspective Tilt"
          >
            {is3D ? '3D Active' : '3D Tilt'}
          </button>

          <button
            onClick={handleResetLocation}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Re-center on user position"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M8.343 15.657l-1.414 1.414m11.314 0l-1.414-1.414M8.343 8.343L6.929 6.929M12 16a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Mapbox GL Live
          </span>
        </div>
      </div>

      {/* Real Interactive Mapbox GL Container */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};
