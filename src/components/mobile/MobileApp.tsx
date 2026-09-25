import React, { useState } from 'react';
import { MobileStatusBar } from './MobileStatusBar';
import { MobileTopBar } from './MobileTopBar';
import { MobileGreeting } from './MobileGreeting';
import { MobileQuickMetrics } from './MobileQuickMetrics';
import { MobileAlerts } from './MobileAlerts';
import { MobileMapPreview } from './MobileMapPreview';
import { MobileBottomNav, MobileNavTab } from './MobileBottomNav';

interface MobileAppProps {
  onNotify?: (msg: string) => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<MobileNavTab>('home');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    onNotify?.(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex items-center justify-center p-0 sm:p-4 select-none w-full h-full">
      {/* Toast inside mobile phone */}
      {toastMsg && (
        <div className="fixed top-12 z-50 bg-slate-900/95 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      {/* BEGIN: PhoneShellMockup */}
      {/* Container scaled specifically to modern mobile viewport (iPhone 14/15 or Pixel aspect ratio) */}
      <div className="w-full max-w-[412px] h-[100dvh] sm:h-[880px] bg-slate-50 sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[8px] sm:border-slate-800">
        
        {/* BEGIN: MobileStatusBar */}
        <MobileStatusBar currentTime="9:41" />
        {/* END: MobileStatusBar */}

        {/* BEGIN: TopAppBar */}
        <MobileTopBar
          onNotificationClick={() => notify('Notification: Flash Flood Warning in Green Park')}
          hasNotification={true}
        />
        {/* END: TopAppBar */}

        {/* BEGIN: MainContentArea */}
        {/* Scrollable content matching FloodSafe mobile preview */}
        <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-20 mobile-no-scrollbar">
          {/* BEGIN: UserGreetingSection */}
          <MobileGreeting
            userName="Adeel"
            locationName="Ludhiana, Punjab"
            onLocationClick={() => notify('Selected location: Ludhiana, Punjab')}
          />
          {/* END: UserGreetingSection */}

          {/* BEGIN: QuickActionsGrid */}
          <MobileQuickMetrics
            activeAlertsCount={3}
            nearbySheltersCount={2}
            forecastSummary="Rain Likely"
            safeZonesCount={12}
            onMetricClick={(type) => notify(`Opened ${type.toUpperCase()} view`)}
          />
          {/* END: QuickActionsGrid */}

          {/* BEGIN: RecentAlertsSection */}
          <MobileAlerts
            onViewAll={() => notify('Opening all alert records...')}
            onAlertSelect={(title) => notify(`Alert details for: ${title}`)}
          />
          {/* END: RecentAlertsSection */}

          {/* BEGIN: EvacuationMapPreviewSection */}
          <MobileMapPreview
            onExploreMap={() => notify('Opening full GPS navigation map...')}
            shelterName="Govt High School (1.2 km)"
          />
          {/* END: EvacuationMapPreviewSection */}
        </main>
        {/* END: MainContentArea */}

        {/* BEGIN: BottomNavigation */}
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            notify(`Switched to tab: ${tab.toUpperCase()}`);
          }}
          alertBadge={true}
        />
        {/* END: BottomNavigation */}
      </div>
      {/* END: PhoneShellMockup */}
    </div>
  );
};
