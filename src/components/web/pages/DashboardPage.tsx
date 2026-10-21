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
import { AlertData, ShelterData, DayForecast, MetricCardData } from '../../../types';
import { LiveWeatherResponse } from '../../../services/weatherFloodService';

interface DashboardPageProps {
  onNavigateTab: (tabId: string) => void;
  onNotify: (msg: string) => void;
  liveData?: LiveWeatherResponse | null;
  metricCards?: MetricCardData[];
  alertsList?: AlertData[];
  forecastDays?: DayForecast[];
  shelters?: ShelterData[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
  onNotify,
  liveData,
  metricCards = METRIC_CARDS,
  alertsList = RECENT_ALERTS,
  forecastDays = WEEK_FORECAST,
  shelters = SHELTERS_LIST
}) => {
  return (
    <div className="space-y-6 pb-12 fade-in">
      {/* Welcome and Greeting with Live Advisory */}
      <GreetingSection
        userName="Adeel"
        location={liveData?.location}
        advisory={liveData?.floodAdvisory}
      />

      {/* 4 Stat Metric Summary Cards */}
      <StatCardsRow
        cards={metricCards}
        onActionClick={(id) => {
          if (id === 'active-alerts') onNavigateTab('alerts');
          else if (id === 'affected-areas' || id === 'rising-water' || id === 'past-rain') onNavigateTab('map');
          else if (id === 'safe-zones') onNavigateTab('shelters');
          else if (id === 'flood-risk-index') onNavigateTab('risk-zones');
          else onNotify(`Selected metric: ${id}`);
        }}
      />

      {/* Center Monitoring Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="center-monitoring-section">
        <MapView
          onSelectMarker={(name) => onNotify(`Selected shelter: ${name}`)}
          userCoords={
            liveData?.location
              ? { lat: liveData.location.latitude, lon: liveData.location.longitude }
              : undefined
          }
          userLocationName={liveData?.location?.name || 'Your Location'}
          shelters={shelters}
        />
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          <RecentAlerts
            alerts={alertsList}
            onViewAll={() => onNavigateTab('alerts')}
            onAlertClick={(a: AlertData) => onNotify(`Alert details: ${a.title}`)}
          />
          <ForecastSection
            forecastDays={forecastDays}
            onViewDetails={() => onNavigateTab('forecast')}
          />
        </div>
      </section>

      {/* Bottom Action Panels */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-purpose="quick-actions-overview">
        <NearestShelters
          shelters={shelters && shelters.length > 0 ? shelters : SHELTERS_LIST}
          onViewAll={() => onNavigateTab('shelters')}
          onRouteClick={(s: ShelterData) => {
            onNotify(`Plotting evacuation route to ${s.name}...`);
            onNavigateTab('shelters');
          }}
        />

        <RoutePlanner
          currentLocation={liveData?.location?.name || 'Your Location'}
          targetShelter={
            shelters && shelters[0]
              ? `${shelters[0].name} (${shelters[0].distance.split('•')[0]})`
              : 'Govt High School (1.2 km)'
          }
          estimatedTime={
            shelters && shelters[0]?.distanceKm
              ? `${Math.max(4, Math.round(shelters[0].distanceKm * 12))} min`
              : '6 min'
          }
          onStartNavigation={() => onNavigateTab('shelters')}
        />

        <EmergencyContacts
          contacts={EMERGENCY_SERVICES}
          onCallInitiate={(phone, title) => onNotify(`Calling ${title} (${phone})...`)}
        />
      </section>
    </div>
  );
};
