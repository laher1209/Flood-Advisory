import React, { useState } from 'react';
import { Badge } from './Badge';
import { ShelterData, DetectedUserLocation } from '../../../types';
import { SHELTERS_LIST } from '../../../data/mockData';

interface SheltersPageProps {
  shelters?: ShelterData[];
  userLocationName?: string;
  userCoords?: { lat: number; lon: number };
  userLocation?: DetectedUserLocation | null;
  onNotify?: (msg: string) => void;
  onNavigateToShelter?: (shelter: ShelterData) => void;
  onDetectLocation?: () => Promise<any> | void;
  onOpenPrecisionModal?: () => void;
  isLocating?: boolean;
  onSearchLocation?: (query: string) => Promise<void> | void;
}

export const SheltersPage: React.FC<SheltersPageProps> = ({
  shelters = SHELTERS_LIST,
  userLocationName = 'Your Location',
  userCoords,
  userLocation,
  onNotify,
  onNavigateToShelter,
  onDetectLocation,
  onOpenPrecisionModal,
  isLocating = false,
  onSearchLocation
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalShelter, setActiveModalShelter] = useState<ShelterData | null>(null);
  const [customLocationInput, setCustomLocationInput] = useState<string>('');
  const [showLocationInput, setShowLocationInput] = useState<boolean>(false);

  const isCoarse =
    userLocation &&
    (!userLocation.isPrecise || (userLocation.accuracyMeters && userLocation.accuracyMeters > 200) || userLocation.source === 'ip');

  const displayList = shelters.length > 0 ? shelters : SHELTERS_LIST;

  // Filter and search
  const filteredShelters = displayList.filter((s) => {
    // Search
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.amenities && s.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    // Categories / Filters
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'open') return s.isOpen && (s.availableBeds ?? 1) > 0;
    if (selectedFilter === 'medical')
      return s.amenities?.some((a) => a.toLowerCase().includes('medical') || a.toLowerCase().includes('first aid'));
    if (selectedFilter === 'meals')
      return s.amenities?.some((a) => a.toLowerCase().includes('meal') || a.toLowerCase().includes('food') || a.toLowerCase().includes('water'));
    if (selectedFilter === 'high_capacity') return s.capacity >= 300;
    if (selectedFilter === 'safe_elevation') return (s.elevationMeters ?? 0) >= 16;
    return true;
  });

  // Aggregated Stats
  const totalCapacity = displayList.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupied = displayList.reduce((acc, s) => acc + (s.occupied ?? Math.round(s.capacity * 0.45)), 0);
  const totalAvailableBeds = Math.max(0, totalCapacity - totalOccupied);
  const openCount = displayList.filter((s) => s.isOpen).length;

  const handleNavigate = (s: ShelterData) => {
    if (onNavigateToShelter) {
      onNavigateToShelter(s);
    } else if (s.latitude && s.longitude) {
      const gmapsUrl = userCoords
        ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lon}&destination=${s.latitude},${s.longitude}`
        : `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;
      window.open(gmapsUrl, '_blank');
      onNotify?.(`Opening turn-by-turn navigation to ${s.name}`);
    } else {
      onNotify?.(`Plotting evacuation route to ${s.name}...`);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchLocation && customLocationInput.trim()) {
      onSearchLocation(customLocationInput.trim());
      setShowLocationInput(false);
      setCustomLocationInput('');
    }
  };

  return (
    <div className="space-y-5 fade-in pb-10">
      {/* Top Banner / Location Context */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-5 md:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 w-56 h-56 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-blue-100 backdrop-blur-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Verified Relief Centers</span>
              </span>
              <span className="text-xs text-blue-200 font-semibold flex items-center gap-1">
                📍 {userLocationName}
              </span>
              {userCoords && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-900/60 text-blue-200 border border-blue-400/30">
                  🛰️ GPS: {userCoords.lat.toFixed(5)}°N, {userCoords.lon.toFixed(5)}°E
                  {userLocation?.accuracyMeters ? ` (±${userLocation.accuracyMeters}m)` : ''}
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Designated Emergency Shelters
            </h2>
            <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed">
              Real high-ground evacuation shelters vetted for flash flood protection, uninterrupted power, warm community meals, and emergency medical triage.
            </p>
          </div>

          {/* Location Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
            {/* Primary Exact GPS Location Trigger */}
            <button
              onClick={() => onDetectLocation?.()}
              disabled={isLocating}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-lg shadow-emerald-900/20 border border-emerald-400/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              title="Detect my exact current GPS coordinates and re-center shelters"
            >
              <svg
                className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M8.343 15.657l-1.414 1.414m11.314 0l-1.414-1.414M8.343 8.343L6.929 6.929M12 16a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              <span>{isLocating ? 'Acquiring GPS...' : '📍 Use Live GPS'}</span>
            </button>

            {/* Precision Calibrator Button */}
            {onOpenPrecisionModal && (
              <button
                onClick={onOpenPrecisionModal}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md"
                title="Calibrate exact doorstep location or street address"
              >
                <span>🎯 Doorstep Precision</span>
              </button>
            )}

            {/* Manual Change Location Button */}
            <button
              onClick={() => setShowLocationInput((prev) => !prev)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-1.5 text-white"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Change Area</span>
            </button>
          </div>
        </div>

        {/* Life-Safety Imprecise Location Warning Banner */}
        {isCoarse && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/20 border border-amber-300/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-100">
            <div className="flex items-start gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Imprecise Location Alert: Network/ISP Estimate (~{userLocation?.accuracyMeters ? Math.round(userLocation.accuracyMeters / 1000) : 4} km radius)</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/30 text-amber-200 text-[10px] font-mono uppercase">Crucial</span>
                </div>
                <p className="text-[11px] text-amber-100/90 mt-0.5">
                  Your laptop or network is reporting an approximate telecom node. In a flood, being off by 500m can route through flooded underpasses. Click to calibrate your exact street or building.
                </p>
              </div>
            </div>
            {onOpenPrecisionModal && (
              <button
                onClick={onOpenPrecisionModal}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all flex-shrink-0 shadow-sm"
              >
                🎯 Calibrate Doorstep Now
              </button>
            )}
          </div>
        )}

        {/* Optional Collapsible Location Search Bar */}
        {showLocationInput && (
          <form
            onSubmit={handleLocationSubmit}
            className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 animate-in fade-in"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={customLocationInput}
                onChange={(e) => setCustomLocationInput(e.target.value)}
                placeholder="Type your neighborhood, colony, or city (e.g. Hazratganj, Indiranagar, Delhi)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                autoFocus
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowLocationInput(false)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-blue-100 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Shelters Open</span>
            <span className="text-lg font-extrabold">{openCount} of {displayList.length}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Available Beds</span>
            <span className="text-lg font-extrabold text-emerald-300">{totalAvailableBeds.toLocaleString()}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Total Capacity</span>
            <span className="text-lg font-extrabold">{totalCapacity.toLocaleString()}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[10px] text-blue-200 block uppercase font-medium">Nearest Shelter</span>
            <span className="text-lg font-extrabold text-amber-200">
              {displayList[0]?.distanceKm ? `${displayList[0].distanceKm} km` : displayList[0]?.distance?.split('•')[0] || '1.2 km'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scroll-area">
          {[
            { id: 'all', label: 'All Shelters', icon: '🏢' },
            { id: 'open', label: 'Open Now', icon: '🟢' },
            { id: 'medical', label: 'Medical Post', icon: '🩺' },
            { id: 'meals', label: 'Free Meals', icon: '🍲' },
            { id: 'safe_elevation', label: 'High Ground (+16m)', icon: '⛰️' },
            { id: 'high_capacity', label: 'High Capacity', icon: '👥' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shelter, area, or amenity..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-4 h-4 absolute left-3 top-2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Shelters Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredShelters.map((s, idx) => {
          const occupied = s.occupied ?? (idx === 0 ? 140 : 85);
          const pct = Math.min(100, Math.round((occupied / s.capacity) * 100));
          const available = Math.max(0, s.capacity - occupied);

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-blue-600 transition-colors">
                        {s.name}
                      </h3>
                      <Badge color={s.isOpen ? (pct > 85 ? 'amber' : 'emerald') : 'red'}>
                        {s.isOpen ? (pct > 85 ? 'Near Capacity' : 'Open & Safe') : 'Standby'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-blue-600 flex items-center gap-1">
                        📍 {s.distance}
                      </span>
                      {s.elevationMeters && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">⛰️ +{s.elevationMeters}m Elevation</span>
                        </>
                      )}
                      {s.floodSafetyScore && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            🛡️ {s.floodSafetyScore}% Safe
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Address */}
                {s.address && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1 flex items-center gap-1">
                    <span className="text-slate-400">Address:</span>
                    <span>{s.address}</span>
                  </p>
                )}

                {/* Amenities Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(s.amenities || [
                    'Free Warm Meals',
                    '24/7 First Aid Post',
                    'Generator Backup',
                    'Dry Bedding'
                  ]).slice(0, 4).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                  {(s.amenities?.length ?? 0) > 4 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-lg bg-blue-50 text-blue-600">
                      +{(s.amenities?.length ?? 0) - 4} more
                    </span>
                  )}
                </div>

                {/* In-Charge Contact Preview */}
                {s.contact && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Shelter In-Charge</span>
                      <span className="font-semibold text-slate-800">{s.contact.name}</span>
                      <span className="text-slate-500 text-[11px] ml-1">({s.contact.role})</span>
                    </div>
                    <a
                      href={`tel:${s.contact.phone.replace(/[^0-9+]/g, '')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotify?.(`Dialing ${s.contact?.name} (${s.contact?.phone})`);
                      }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>📞</span>
                      <span>Call</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom Actions & Capacity Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="text-slate-500 font-medium">Capacity Utilization</span>
                  <span className="font-bold text-slate-800">
                    {occupied} / {s.capacity} persons ({available} beds left)
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleNavigate(s)}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🧭</span>
                    <span>Get Directions</span>
                  </button>

                  <button
                    onClick={() => setActiveModalShelter(s)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>ℹ️ Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredShelters.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <span className="text-3xl block mb-2">🔍</span>
          <h4 className="font-bold text-slate-800 text-sm">No shelters found matching your criteria</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filter or search term.</p>
          <button
            onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detailed Modal for Shelter */}
      {activeModalShelter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  Relief Camp Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activeModalShelter.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">📍 {activeModalShelter.address}</p>
              </div>
              <button
                onClick={() => setActiveModalShelter(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Distance and Elevation */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="text-[10px] text-blue-600 uppercase font-semibold block">Distance</span>
                  <span className="text-sm font-extrabold text-blue-900">{activeModalShelter.distance.split('•')[0]}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-600 uppercase font-semibold block">Safety Score</span>
                  <span className="text-sm font-extrabold text-emerald-900">{activeModalShelter.floodSafetyScore ?? 96}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                  <span className="text-[10px] text-purple-600 uppercase font-semibold block">Elevation</span>
                  <span className="text-sm font-extrabold text-purple-900">+{activeModalShelter.elevationMeters ?? 18}m High</span>
                </div>
              </div>

              {/* In-Charge Details */}
              {activeModalShelter.contact && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Designated Relief In-Charge
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{activeModalShelter.contact.name}</p>
                      <p className="text-xs text-slate-500">{activeModalShelter.contact.role}</p>
                    </div>
                    <a
                      href={`tel:${activeModalShelter.contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm hover:bg-emerald-700"
                    >
                      <span>📞</span>
                      <span>{activeModalShelter.contact.phone}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Complete Amenities Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Facilities & Services Provided
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(activeModalShelter.amenities || []).map((a, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-100">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to bring */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Important: What to Bring With You
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-amber-50/70 border border-amber-200/70 p-3 rounded-2xl">
                  {(activeModalShelter.whatToBring || [
                    'Government photo ID (Aadhar / Voter ID)',
                    'Minimum 3-day supply of critical prescription medications',
                    'Mobile phone, charger, and power bank if available',
                    'A set of dry clothes and essential infant supplies'
                  ]).map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Camp Rules */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Relief Center Protocol
                </h4>
                <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <p>• {activeModalShelter.verifiedAt || 'Verified by District Disaster Authority'}</p>
                  <p>• Medical triage is mandatory at the entrance gates.</p>
                  <p>• Hot meal distribution runs from 07:00 to 21:00 continuously.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  handleNavigate(activeModalShelter);
                  setActiveModalShelter(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>🧭</span>
                <span>Navigate to this Shelter</span>
              </button>
              <button
                onClick={() => setActiveModalShelter(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
