import React, { useState, useEffect } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { TopHeader } from './TopHeader';
import {
  DashboardPage,
  MapPage,
  AlertsPage,
  SheltersPage,
  RoutePage,
  ForecastPage,
  RiskZonesPage,
  EmergencyPage,
  SettingsPage
} from './pages';
import {
  SIDEBAR_NAV_ITEMS,
  METRIC_CARDS,
  RECENT_ALERTS,
  WEEK_FORECAST
} from '../../data/mockData';
import { AlertData, DayForecast, MetricCardData, ShelterData } from '../../types';
import {
  fetchLiveWeatherAndAdvisory,
  getUserLocation,
  detectLocationByIp,
  LiveWeatherResponse
} from '../../services/weatherFloodService';
import { getNearbyShelters } from '../../services/shelterService';

export const WebDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Live Weather & Advisory State
  const [liveData, setLiveData] = useState<LiveWeatherResponse | null>(null);
  const [forecastDays, setForecastDays] = useState<DayForecast[]>(WEEK_FORECAST);
  const [alertsList, setAlertsList] = useState<AlertData[]>(RECENT_ALERTS);
  const [metricCards, setMetricCards] = useState<MetricCardData[]>(METRIC_CARDS);
  const [nearbyShelters, setNearbyShelters] = useState<ShelterData[]>([]);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const showNotificationToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Auto-detect user's real location on initial mount
  useEffect(() => {
    handleAutoDetectLocation(false);
  }, []);

  const loadWeatherData = async (lat: number, lon: number, cityName: string) => {
    try {
      // 1. Fetch real OpenStreetMap shelters for coordinates
      const shelters = await getNearbyShelters(lat, lon, cityName);
      setNearbyShelters(shelters);

      // 2. Fetch live weather & flood analysis
      const data = await fetchLiveWeatherAndAdvisory(lat, lon, cityName);
      setLiveData(data);

      if (data.forecast && data.forecast.length > 0) {
        setForecastDays(data.forecast);
      }

      if (data.floodAdvisory?.alerts && data.floodAdvisory.alerts.length > 0) {
        setAlertsList(data.floodAdvisory.alerts);
      }

      // Update stat cards dynamically
      setMetricCards([
        {
          id: 'active-alerts',
          title: 'Active Alerts',
          value: data.floodAdvisory?.alerts?.length || 1,
          actionText: 'View all',
          actionHref: '#',
          type: data.floodAdvisory?.severity === 'danger' ? 'danger' : 'warning'
        },
        {
          id: 'past-rain',
          title: 'Past 24h Rain',
          value: `${data.floodAdvisory?.metrics?.past24hRainfallMm ?? 0} mm`,
          actionText: `IMD: ${data.location?.nearestImdStation?.name || 'Live'}`,
          actionHref: '#',
          type: (data.floodAdvisory?.metrics?.past24hRainfallMm ?? 0) > 30 ? 'danger' : 'primary'
        },
        {
          id: 'flood-risk-index',
          title: 'Flood Risk Index',
          value: `${data.floodAdvisory?.riskScore ?? 25}%`,
          actionText: data.floodAdvisory?.statusText || 'Normal',
          actionHref: '#',
          type: (data.floodAdvisory?.riskScore ?? 0) > 50 ? 'danger' : 'primary'
        },
        {
          id: 'safe-zones',
          title: 'Safe Shelters',
          value: shelters.filter((s) => s.isOpen).length,
          actionText: `${shelters.length} Shelters Nearby`,
          actionHref: '#',
          type: 'success'
        }
      ]);
    } catch (err: any) {
      showNotificationToast('Error loading live advisory: ' + err.message);
    }
  };

  // Handle Location Auto-detection (GPS + Network/IP fallback)
  const handleAutoDetectLocation = async (forceRefresh = true) => {
    setIsLocating(true);
    showNotificationToast('📍 Detecting your exact live GPS location...');
    try {
      const userLoc = await getUserLocation(forceRefresh);
      await loadWeatherData(userLoc.lat, userLoc.lon, userLoc.city);
      const mode =
        userLoc.source === 'gps'
          ? `Exact GPS${userLoc.accuracyMeters ? ` ±${userLoc.accuracyMeters}m` : ''}`
          : userLoc.source === 'ip'
          ? 'Network'
          : 'Regional';
      showNotificationToast(`📍 Located: ${userLoc.city} (${mode}) • Shelters updated`);
    } catch (err: any) {
      console.warn('Auto-detect error:', err);
      try {
        const ipLoc = await detectLocationByIp();
        if (ipLoc) {
          await loadWeatherData(ipLoc.lat, ipLoc.lon, ipLoc.city);
          showNotificationToast(`📍 Located: ${ipLoc.city} (Network) • Shelters updated`);
          return;
        }
      } catch (e) {}
      await loadWeatherData(28.6139, 77.2090, 'Central Safe Zone');
      showNotificationToast('📍 Loaded regional advisory and safe shelters');
    } finally {
      setIsLocating(false);
    }
  };

  // Handle city search with global geocoding support
  const handleSearchLocation = async (query: string) => {
    showNotificationToast(`Searching weather & shelters for "${query}"...`);
    const cityMap: Record<string, { lat: number; lon: number }> = {
      delhi: { lat: 28.58, lon: 77.20 },
      'new delhi': { lat: 28.58, lon: 77.20 },
      mumbai: { lat: 19.07, lon: 72.87 },
      kolkata: { lat: 22.53, lon: 88.33 },
      chennai: { lat: 12.99, lon: 80.18 },
      bengaluru: { lat: 12.97, lon: 77.59 },
      bangalore: { lat: 12.97, lon: 77.59 },
      hyderabad: { lat: 17.38, lon: 78.48 },
      ludhiana: { lat: 30.90, lon: 75.85 },
      chandigarh: { lat: 30.73, lon: 76.77 },
      patna: { lat: 25.59, lon: 85.13 },
      guwahati: { lat: 26.14, lon: 91.73 },
      pune: { lat: 18.52, lon: 73.85 },
      ahmedabad: { lat: 23.02, lon: 72.57 },
      jaipur: { lat: 26.91, lon: 75.78 },
      lucknow: { lat: 26.84, lon: 80.94 },
      shahganj: { lat: 26.05, lon: 82.68 },
      varanasi: { lat: 25.31, lon: 82.97 }
    };

    const key = query.toLowerCase().trim();
    if (cityMap[key]) {
      await loadWeatherData(cityMap[key].lat, cityMap[key].lon, query);
      showNotificationToast(`Loaded real-time advisory and shelters for ${query}`);
      return;
    }

    // Try dynamic geocoding for any custom city name
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const r = geoData.results[0];
          const formattedCity = r.admin1 ? `${r.name}, ${r.admin1}` : r.name;
          await loadWeatherData(r.latitude, r.longitude, formattedCity);
          showNotificationToast(`Loaded advisory and shelters for ${formattedCity}`);
          return;
        }
      }
    } catch (e) {
      console.warn('Geocoding lookup failed:', e);
    }

    await loadWeatherData(28.58, 77.20, query);
    showNotificationToast(`Showing regional advisory and shelters for ${query}`);
  };

  const currentLocationName = liveData?.location?.name || 'Your Location';

  return (
    <div className="bg-[#f0f4f9] text-slate-800 antialiased h-screen flex overflow-hidden w-full relative">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* BEGIN: LeftSidebar with Active Navigation */}
      <LeftSidebar
        navItems={SIDEBAR_NAV_ITEMS}
        activeTab={activeTab}
        onSelectTab={(id: string) => {
          setActiveTab(id);
        }}
      />
      {/* END: LeftSidebar */}

      {/* BEGIN: MainContentArea */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar">
        {/* Top Header */}
        <TopHeader
          onSearch={handleSearchLocation}
          onDetectLocation={handleAutoDetectLocation}
          isDetectingLocation={isLocating}
          locationName={currentLocationName}
          locationTemp={`${liveData?.current?.temperature ?? 28}°C`}
          weatherCondition={liveData?.current?.condition || 'Partly Cloudy'}
          weatherEmoji={liveData?.current?.emoji || '⛅'}
          stationName={liveData?.location?.nearestImdStation?.name || 'IMD Station'}
          onNotificationClick={() => setActiveTab('alerts')}
        />

        {/* Dynamic Page Rendering based on activeTab */}
        <main className="p-6" data-purpose="page-content">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigateTab={(tab) => setActiveTab(tab)}
              onNotify={showNotificationToast}
              liveData={liveData}
              metricCards={metricCards}
              alertsList={alertsList}
              forecastDays={forecastDays}
              shelters={nearbyShelters}
            />
          )}

          {activeTab === 'map' && (
            <MapPage
              onNotify={showNotificationToast}
              shelters={nearbyShelters}
              userLocationName={currentLocationName}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage alerts={alertsList} onNotify={showNotificationToast} />
          )}

          {activeTab === 'shelters' && (
            <SheltersPage
              shelters={nearbyShelters}
              userLocationName={currentLocationName}
              userCoords={
                liveData?.location
                  ? { lat: liveData.location.latitude, lon: liveData.location.longitude }
                  : undefined
              }
              onNotify={showNotificationToast}
              onDetectLocation={() => handleAutoDetectLocation(true)}
              isLocating={isLocating}
              onSearchLocation={handleSearchLocation}
              onNavigateToShelter={(shelter) => {
                setActiveTab('route');
                showNotificationToast(`Plotting safe route to ${shelter.name}`);
              }}
            />
          )}

          {activeTab === 'route' && (
            <RoutePage
              onNotify={showNotificationToast}
              currentLocation={currentLocationName}
              targetShelter={nearbyShelters[0]}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastPage forecastDays={forecastDays} onNotify={showNotificationToast} />
          )}

          {activeTab === 'risk-zones' && (
            <RiskZonesPage onNotify={showNotificationToast} />
          )}

          {activeTab === 'emergency' && (
            <EmergencyPage onNotify={showNotificationToast} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage onNotify={showNotificationToast} />
          )}
        </main>
      </div>
      {/* END: MainContentArea */}
    </div>
  );
};
