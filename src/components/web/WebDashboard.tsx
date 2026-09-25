import React, { useState } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { TopHeader } from './TopHeader';
import { GreetingSection } from './GreetingSection';
import { StatCardsRow } from './StatCardsRow';
import { MapView } from './MapView';
import { RecentAlerts } from './RecentAlerts';
import { ForecastSection } from './ForecastSection';
import { NearestShelters } from './NearestShelters';
import { RoutePlanner } from './RoutePlanner';
import { EmergencyContacts } from './EmergencyContacts';
import {
  SIDEBAR_NAV_ITEMS,
  METRIC_CARDS,
  RECENT_ALERTS,
  WEEK_FORECAST,
  SHELTERS_LIST,
  EMERGENCY_SERVICES
} from '../../data/mockData';
import { AlertData, ShelterData } from '../../types';

export const WebDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotificationToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleNavSelect = (id: string) => {
    setActiveTab(id);
    showNotificationToast(`Switched view to ${id.toUpperCase()}`);
  };

  const handleCardAction = (cardId: string) => {
    showNotificationToast(`Opened details for metric: ${cardId}`);
  };

  const handleAlertClick = (alert: AlertData) => {
    showNotificationToast(`Viewing alert: "${alert.title}" in ${alert.location}`);
  };

  const handleRouteClick = (shelter: ShelterData) => {
    showNotificationToast(`Plotting safe route to ${shelter.name}...`);
  };

  const handleStartNavigation = () => {
    showNotificationToast('Safe navigation route initiated! Avoiding flooded zones.');
  };

  const handleEmergencyCall = (phone: string, title: string) => {
    showNotificationToast(`Connecting to ${title} (${phone})...`);
  };

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

      {/* BEGIN: LeftSidebar */}
      <LeftSidebar
        navItems={SIDEBAR_NAV_ITEMS}
        activeTab={activeTab}
        onSelectTab={handleNavSelect}
      />
      {/* END: LeftSidebar */}

      {/* BEGIN: MainContentArea */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar">
        {/* BEGIN: TopHeader */}
        <TopHeader
          onSearch={(query) => showNotificationToast(`Searching areas for "${query}"...`)}
          onNotificationClick={() => showNotificationToast('All systems monitoring active feeds.')}
        />
        {/* END: TopHeader */}

        {/* Main Scrollable Dashboard Content */}
        <main className="p-6 space-y-6" data-purpose="dashboard-content">
          {/* BEGIN: WelcomeAndGreeting */}
          <GreetingSection userName="Adeel" />
          {/* END: WelcomeAndGreeting */}

          {/* BEGIN: StatCardsRow */}
          <StatCardsRow
            cards={METRIC_CARDS}
            onActionClick={handleCardAction}
          />
          {/* END: StatCardsRow */}

          {/* BEGIN: CenterGridArea */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="center-monitoring-section">
            {/* Center Map View Widget (8 Cols) */}
            <MapView
              onSelectMarker={(name) => showNotificationToast(`Inspecting location: ${name}`)}
            />

            {/* Right Side Alerts & 7-Day Forecast Column (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
              <RecentAlerts
                alerts={RECENT_ALERTS}
                onViewAll={() => showNotificationToast('Viewing all alerts')}
                onAlertClick={handleAlertClick}
              />
              <ForecastSection
                forecastDays={WEEK_FORECAST}
                onViewDetails={() => showNotificationToast('Viewing detailed weather radar')}
              />
            </div>
          </section>
          {/* END: CenterGridArea */}

          {/* BEGIN: BottomActionPanels */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-purpose="quick-actions-overview">
            <NearestShelters
              shelters={SHELTERS_LIST}
              onViewAll={() => showNotificationToast('Loading full shelter directory...')}
              onRouteClick={handleRouteClick}
            />

            <RoutePlanner
              currentLocation="Sector 4, Model Town"
              targetShelter="Govt High School (1.2 km)"
              estimatedTime="6 min"
              onStartNavigation={handleStartNavigation}
            />

            <EmergencyContacts
              contacts={EMERGENCY_SERVICES}
              onCallInitiate={handleEmergencyCall}
            />
          </section>
          {/* END: BottomActionPanels */}
        </main>
      </div>
      {/* END: MainContentArea */}
    </div>
  );
};
