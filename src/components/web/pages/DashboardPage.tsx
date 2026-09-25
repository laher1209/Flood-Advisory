import React from 'react';
import { GreetingSection } from '../GreetingSection';
import { StatCardsRow } from '../StatCardsRow';
import { MapView } from '../MapView';
import { RecentAlerts } from '../RecentAlerts';
import { ForecastSection } from '../ForecastSection';
import { NearestShelters } from '../NearestShelters';
import { RoutePlanner } from '../RoutePlanner';
import { EmergencyContacts } from '../EmergencyContacts';
import {
  METRIC_CARDS,
  RECENT_ALERTS,
  WEEK_FORECAST,
  SHELTERS_LIST,
  EMERGENCY_SERVICES
} from '../../../data/mockData';
import { AlertData, ShelterData } from '../../../types';

interface DashboardPageProps {
  onNavigateTab: (tabId: string) => void;
  onNotify: (msg: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
  onNotify
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Welcome and Greeting */}
      <GreetingSection userName="Adeel" />

      {/* 4 Stat Metric Summary Cards */}
      <StatCardsRow
        cards={METRIC_CARDS}
        onActionClick={(id) => {
          if (id === 'active-alerts') onNavigateTab('alerts');
          else if (id === 'affected-areas' || id === 'rising-water') onNavigateTab('map');
          else if (id === 'safe-zones') onNavigateTab('shelters');
          else onNotify(`Selected metric: ${id}`);
        }}
      />

      {/* Center Monitoring Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="center-monitoring-section">
        <MapView onSelectMarker={(name) => onNotify(`Selected area: ${name}`)} />
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          <RecentAlerts
            alerts={RECENT_ALERTS}
            onViewAll={() => onNavigateTab('alerts')}
            onAlertClick={(a: AlertData) => onNotify(`Alert details: ${a.title}`)}
          />
          <ForecastSection
            forecastDays={WEEK_FORECAST}
            onViewDetails={() => onNavigateTab('forecast')}
          />
        </div>
      </section>

      {/* Bottom Action Panels */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-purpose="quick-actions-overview">
        <NearestShelters
          shelters={SHELTERS_LIST}
          onViewAll={() => onNavigateTab('shelters')}
          onRouteClick={(s: ShelterData) => onNotify(`Plotting route to ${s.name}...`)}
        />

        <RoutePlanner
          currentLocation="Sector 4, Model Town"
          targetShelter="Govt High School (1.2 km)"
          estimatedTime="6 min"
          onStartNavigation={() => onNavigateTab('route')}
        />

        <EmergencyContacts
          contacts={EMERGENCY_SERVICES}
          onCallInitiate={(phone, title) => onNotify(`Calling ${title} (${phone})...`)}
        />
      </section>
    </div>
  );
};
