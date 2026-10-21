import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DetectedUserLocation, PreciseAddressResult } from '../../types';
import { searchPreciseAddress, reverseGeocodeCoords } from '../../services/weatherFloodService';
import { MAPBOX_ACCESS_TOKEN } from '../../services/mapboxService';

interface LocationPrecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: DetectedUserLocation | null;
  onApplyLocation: (loc: DetectedUserLocation) => void;
  onTriggerGpsRefine: () => Promise<DetectedUserLocation | null>;
  isRefiningGps?: boolean;
}

export const LocationPrecisionModal: React.FC<LocationPrecisionModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onApplyLocation,
  onTriggerGpsRefine,
  isRefiningGps = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PreciseAddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('satellite');

  // Fine-tuning coordinate state
  const [pinLat, setPinLat] = useState<number>(currentLocation?.lat || 28.6139);
  const [pinLon, setPinLon] = useState<number>(currentLocation?.lon || 77.2090);
  const [resolvedAddress, setResolvedAddress] = useState<string>(
    currentLocation?.city || 'Locating doorstep...'
  );
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Mapbox DOM and instance refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Synchronize initial coordinates when modal opens or currentLocation updates
  useEffect(() => {
    if (currentLocation) {
      setPinLat(currentLocation.lat);
      setPinLon(currentLocation.lon);
      setResolvedAddress(currentLocation.city);
    }
  }, [currentLocation, isOpen]);

  // Initialize Mapbox GL Map with Draggable Pinpoint Marker
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const initialLat = currentLocation?.lat || 28.6139;
    const initialLon = currentLocation?.lon || 77.2090;

    const styleUri =
      mapStyle === 'satellite'
        ? 'mapbox://styles/mapbox/satellite-streets-v12'
        : 'mapbox://styles/mapbox/streets-v12';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUri,
      center: [initialLon, initialLat],
      zoom: 16.5,
      pitch: 30
    });

    mapRef.current = map;

    // Add navigation controls (zoom & pitch)
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    // Add Geolocate Control with high accuracy
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: false,
      showAccuracyCircle: true
    });
    map.addControl(geolocate, 'top-right');

    // Custom Draggable Pinpoint Marker
    const marker = new mapboxgl.Marker({
      draggable: true,
      color: '#ef4444'
    })
      .setLngLat([initialLon, initialLat])
      .addTo(map);

    markerRef.current = marker;

    const handlePinMove = async (lng: number, lat: number) => {
      const formattedLat = parseFloat(lat.toFixed(5));
      const formattedLon = parseFloat(lng.toFixed(5));
      setPinLat(formattedLat);
      setPinLon(formattedLon);

      setIsReverseGeocoding(true);
      try {
        const place = await reverseGeocodeCoords(formattedLat, formattedLon);
        setResolvedAddress(place);
      } finally {
        setIsReverseGeocoding(false);
      }
    };

    // When the user drags the pinpoint marker
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      handlePinMove(lngLat.lng, lngLat.lat);
    });

    // When the user clicks anywhere on the map, snap the pinpoint marker there
    map.on('click', (e) => {
      marker.setLngLat(e.lngLat);
      handlePinMove(e.lngLat.lng, e.lngLat.lat);
    });

    // When Geolocate button fires, update pin
    geolocate.on('geolocate', (pos: any) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      marker.setLngLat([lon, lat]);
      handlePinMove(lon, lat);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isOpen, mapStyle]);

  // Update map center when coordinates change from search
  const panToCoords = (lat: number, lon: number, addressName: string) => {
    setPinLat(lat);
    setPinLon(lon);
    setResolvedAddress(addressName);

    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lon, lat], zoom: 17, essential: true });
    }
    if (markerRef.current) {
      markerRef.current.setLngLat([lon, lat]);
    }
  };

  if (!isOpen) return null;

  const accuracyM = currentLocation?.accuracyMeters || 1000;
  const isHighPrecision = currentLocation?.isPrecise || (accuracyM <= 50 && currentLocation?.source === 'gps');
  const isCoarse = !isHighPrecision && (currentLocation?.source === 'ip' || accuracyM > 250);

  // Address search with Mapbox & Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setIsSearching(true);
    try {
      const results = await searchPreciseAddress(searchQuery.trim());
      setSearchResults(results);
    } catch (err) {
      console.warn('Address search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: PreciseAddressResult) => {
    panToCoords(result.lat, result.lon, result.shortName || result.displayName);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Lock and save pinpoint
  const handleSavePinpoint = () => {
    const newLoc: DetectedUserLocation = {
      lat: pinLat,
      lon: pinLon,
      city: resolvedAddress,
      accuracyMeters: 3, // Pinpoint sub-meter precision
      source: 'manual',
      isPrecise: true,
      timestamp: Date.now()
    };
    onApplyLocation(newLoc);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-6 py-4 text-white relative flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
                📍
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                  <span>Interactive Mapbox Doorstep Pinpoint</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                    Mapbox GL
                  </span>
                </h3>
                <p className="text-xs text-blue-100/80">Drag the red pin or click anywhere on the satellite map</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Real-Time Precision Status Card */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              isHighPrecision
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : isCoarse
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-blue-50/70 border-blue-200 text-blue-950'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isHighPrecision ? 'bg-emerald-500 animate-pulse' : isCoarse ? 'bg-amber-500 animate-ping' : 'bg-blue-500'
                    }`}
                  ></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {isHighPrecision
                      ? 'Satellite GPS Precision Locked'
                      : isCoarse
                      ? '⚠️ Imprecise Location Detected'
                      : 'Approximate Network Location'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📍 Pin Address: {isReverseGeocoding ? 'Reverse geocoding...' : resolvedAddress}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 flex items-center gap-2">
                  <span>Lat: {pinLat.toFixed(5)}°N</span>
                  <span>•</span>
                  <span>Lon: {pinLon.toFixed(5)}°E</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Sub-meter resolution</span>
                </div>
              </div>

              {/* Live GPS Refine button */}
              <button
                onClick={async () => {
                  const res = await onTriggerGpsRefine();
                  if (res) {
                    panToCoords(res.lat, res.lon, res.city);
                  }
                }}
                disabled={isRefiningGps}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-60 shrink-0"
                title="Poll device GPS hardware satellites"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isRefiningGps ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M8.343 15.657l-1.414 1.414m11.314 0l-1.414-1.414M8.343 8.343L6.929 6.929M12 16a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
                <span>{isRefiningGps ? 'Locking...' : 'Refine GPS'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar for Landmarks & Streets */}
          <form onSubmit={handleSearch} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colony, apartment, road, or landmark (e.g. Hazratganj, Indiranagar)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Autocomplete Suggestions List */}
          {searchResults.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-40 overflow-y-auto bg-white shadow-md">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  className="p-2.5 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">📍 {res.shortName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{res.displayName}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold shrink-0">
                    Fly to Pin
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Mapbox Canvas Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span>🎯 Drag Red Pin to Doorstep</span>
                <span className="text-[10px] text-slate-400 font-normal">(Click anywhere on map to move pin)</span>
              </span>

              {/* Map Layer Toggle (Satellite vs Streets) */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMapStyle('satellite')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    mapStyle === 'satellite'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🛰️ Satellite
                </button>
                <button
                  type="button"
                  onClick={() => setMapStyle('streets')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    mapStyle === 'streets'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🗺️ Streets
                </button>
              </div>
            </div>

            <div
              ref={mapContainerRef}
              className="w-full h-64 sm:h-72 rounded-2xl border-2 border-slate-200 shadow-inner overflow-hidden relative"
              style={{ minHeight: '260px' }}
            />
          </div>
        </div>

        {/* Modal Footer with Primary Apply Button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Doorstep Coords:</span> {pinLat.toFixed(5)}°N,{' '}
            {pinLon.toFixed(5)}°E
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePinpoint}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>✅ Lock Exact Doorstep Pin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
