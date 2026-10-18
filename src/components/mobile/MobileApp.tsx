import React, { useState, useEffect } from 'react';
import { MobileStatusBar } from './MobileStatusBar';
import { MobileTopBar } from './MobileTopBar';
import { MobileGreeting } from './MobileGreeting';
import { MobileQuickMetrics } from './MobileQuickMetrics';
import { MobileAlerts } from './MobileAlerts';
import { MobileMapPreview } from './MobileMapPreview';
import { MobileBottomNav, MobileNavTab } from './MobileBottomNav';
import { SHELTERS_LIST, RECENT_ALERTS, EMERGENCY_SERVICES } from '../../data/mockData';
import { ShelterData } from '../../types';
import { getUserLocation } from '../../services/weatherFloodService';
import { getNearbyShelters } from '../../services/shelterService';

interface MobileAppProps {
  onNotify?: (msg: string) => void;
  locationName?: string;
  shelters?: ShelterData[];
  onAutoDetect?: () => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({
  onNotify,
  locationName: propLocationName,
  shelters: propShelters,
  onAutoDetect
}) => {
  const [activeTab, setActiveTab] = useState<MobileNavTab>('home');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [localLocation, setLocalLocation] = useState<string>('Detecting location...');
  const [localShelters, setLocalShelters] = useState<ShelterData[]>(propShelters || []);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const notify = (msg: string) => {
    setToastMsg(msg);
    onNotify?.(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Auto-detect on mobile mount if props not provided
  useEffect(() => {
    if (propLocationName) {
      setLocalLocation(propLocationName);
    } else {
      detectMobileLocation();
    }
  }, [propLocationName]);

  useEffect(() => {
    if (propShelters && propShelters.length > 0) {
      setLocalShelters(propShelters);
    }
  }, [propShelters]);

  const detectMobileLocation = async () => {
    setIsLocating(true);
    notify('📍 Auto-detecting GPS location...');
    try {
      const loc = await getUserLocation();
      setLocalLocation(loc.city);
      const shelters = await getNearbyShelters(loc.lat, loc.lon, loc.city);
      setLocalShelters(shelters);
      notify(`📍 Located: ${loc.city} (${loc.source.toUpperCase()})`);
    } catch (e: any) {
      setLocalLocation('Regional Safe Zone');
      const fallback = await getNearbyShelters(28.6139, 77.2090, 'Regional Safe Zone');
      setLocalShelters(fallback);
    } finally {
      setIsLocating(false);
    }
  };

  const activeLocation = propLocationName || localLocation;
  const activeShelters = propShelters && propShelters.length > 0 ? propShelters : localShelters;
  const primaryShelter = activeShelters[0];

  return (
    <div className="flex items-center justify-center p-0 sm:p-4 select-none w-full h-full">
      {/* Toast inside mobile phone */}
      {toastMsg && (
        <div className="fixed top-12 z-50 bg-slate-900/95 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      {/* Phone Shell Mockup */}
      <div className="w-full max-w-[412px] h-[100dvh] sm:h-[880px] bg-slate-50 sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[8px] sm:border-slate-800">
        {/* Mobile Status Bar */}
        <MobileStatusBar currentTime="10:24" />

        {/* Top App Bar */}
        <MobileTopBar
          onNotificationClick={() => setActiveTab('alerts')}
          hasNotification={true}
        />

        {/* Main Content Area based on activeTab */}
        <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-20 mobile-no-scrollbar">
          {activeTab === 'home' && (
            <>
              <div className="relative">
                <MobileGreeting
                  userName="Adeel"
                  locationName={activeLocation}
                  onLocationClick={() => {
                    if (onAutoDetect) onAutoDetect();
                    else detectMobileLocation();
                  }}
                />
                <button
                  onClick={() => {
                    if (onAutoDetect) onAutoDetect();
                    else detectMobileLocation();
                  }}
                  disabled={isLocating}
                  className="absolute right-3 top-3 px-2 py-1 bg-white/90 shadow-sm border border-slate-200 rounded-full text-[10px] font-semibold text-blue-600 flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span className={isLocating ? 'animate-spin' : ''}>🎯</span>
                  <span>{isLocating ? 'Locating...' : 'Auto-Detect'}</span>
                </button>
              </div>

              <MobileQuickMetrics
                activeAlertsCount={3}
                nearbySheltersCount={activeShelters.length}
                forecastSummary="Rain Likely"
                safeZonesCount={activeShelters.filter((s) => s.isOpen).length}
                onMetricClick={(type) => {
                  if (type === 'alerts') setActiveTab('alerts');
                  else if (type === 'shelters' || type === 'safe') setActiveTab('shelters');
                  else if (type === 'forecast') notify('Viewing 7-Day Weather Radar');
                }}
              />

              <MobileAlerts
                onViewAll={() => setActiveTab('alerts')}
                onAlertSelect={(title) => notify(`Alert details for: ${title}`)}
              />

              <MobileMapPreview
                onExploreMap={() => setActiveTab('map')}
                shelterName={
                  primaryShelter
                    ? `${primaryShelter.name} (${primaryShelter.distance.split('•')[0]})`
                    : 'Govt High School (1.2 km)'
                }
              />
            </>
          )}

          {activeTab === 'map' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Interactive Flood Map</h3>
              <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 relative map-canvas-bg">
                <div className="river-path"></div>
                <div className="absolute top-4 left-4 bg-white/95 p-2 rounded-lg text-[10px] font-semibold border shadow">
                  🔴 Area: {activeLocation}
                </div>
                {/* Pins */}
                {activeShelters.slice(0, 3).map((s, i) => (
                  <div
                    key={s.id}
                    onClick={() => notify(`Evacuation Shelter: ${s.name} (${s.distance.split('•')[0]})`)}
                    className="absolute cursor-pointer flex flex-col items-center"
                    style={{ top: `${25 + i * 25}%`, left: `${20 + i * 28}%` }}
                  >
                    <span className="bg-white/95 text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200 max-w-[110px] truncate">
                      {s.name}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-md border border-white">
                      🏠
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shelters' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Designated Shelters Nearby</h3>
                  <p className="text-[10px] text-slate-500">📍 Near {activeLocation}</p>
                </div>
                <button
                  onClick={() => {
                    if (onAutoDetect) onAutoDetect();
                    else detectMobileLocation();
                  }}
                  className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg"
                >
                  🔄 Refresh
                </button>
              </div>

              {activeShelters.map((s) => {
                const available = s.availableBeds ?? (s.capacity - (s.occupied ?? 0));
                return (
                  <div key={s.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-xs text-slate-900">{s.name}</p>
                        <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
                          📍 {s.distance.split('•')[0]} • {s.direction || 'Safe High Ground'}
                        </p>
                        {s.address && (
                          <p className="text-[10px] text-slate-500 line-clamp-1">{s.address}</p>
                        )}
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        {s.statusText}
                      </span>
                    </div>

                    {/* Capacity & Beds */}
                    <div className="bg-slate-50 p-2 rounded-xl text-[10px] flex items-center justify-between text-slate-600">
                      <span>Total Capacity: <b>{s.capacity}</b></span>
                      <span className="text-emerald-700 font-bold">🛏️ {available} Beds Free</span>
                    </div>

                    {/* Officer Contact if available */}
                    {s.contact && (
                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                        <span className="text-slate-600 truncate mr-2">In-Charge: {s.contact.name}</span>
                        <a
                          href={`tel:${s.contact.phone.replace(/[^0-9+]/g, '')}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            notify(`Dialing ${s.contact?.name}...`);
                          }}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 shrink-0"
                        >
                          📞 Call
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          if (s.latitude && s.longitude) {
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`,
                              '_blank'
                            );
                          }
                          notify(`Navigating to ${s.name}`);
                        }}
                        className="flex-1 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                      >
                        <span>🧭 Navigate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Active Severe Alerts</h3>
              {RECENT_ALERTS.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-2.5"
                >
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-bold text-xs text-slate-800">{a.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {a.location} • {a.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'more' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Emergency Hotlines</h3>
              {EMERGENCY_SERVICES.map((e) => (
                <a
                  key={e.id}
                  href={`tel:${e.phone}`}
                  onClick={() => notify(`Calling ${e.title} (${e.phone})...`)}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{e.emoji}</span>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{e.title}</p>
                      <p className="text-[10px] text-slate-400">{e.description}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {e.phone}
                  </span>
                </a>
              ))}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>
    </div>
  );
};
