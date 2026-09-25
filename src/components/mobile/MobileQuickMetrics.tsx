import React from 'react';

interface MobileQuickMetricsProps {
  activeAlertsCount?: number;
  nearbySheltersCount?: number;
  forecastSummary?: string;
  safeZonesCount?: number;
  onMetricClick?: (metricType: string) => void;
}

export const MobileQuickMetrics: React.FC<MobileQuickMetricsProps> = ({
  activeAlertsCount = 3,
  nearbySheltersCount = 2,
  forecastSummary = 'Rain Likely',
  safeZonesCount = 12,
  onMetricClick
}) => {
  return (
    <section className="grid grid-cols-2 gap-3 pt-1" data-purpose="quick-metrics-grid">
      {/* Alerts Card */}
      <div
        onClick={() => onMetricClick?.('alerts')}
        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center space-x-3 hover:border-red-100 transition cursor-pointer active:scale-95"
      >
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="block text-xs font-semibold text-slate-700">Alerts</span>
          <span className="block text-sm font-extrabold text-red-600">{activeAlertsCount} Active</span>
        </div>
      </div>

      {/* Shelters Card */}
      <div
        onClick={() => onMetricClick?.('shelters')}
        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center space-x-3 hover:border-emerald-100 transition cursor-pointer active:scale-95"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="block text-xs font-semibold text-slate-700">Shelters</span>
          <span className="block text-sm font-extrabold text-emerald-600">{nearbySheltersCount} Nearby</span>
        </div>
      </div>

      {/* Forecast Card */}
      <div
        onClick={() => onMetricClick?.('forecast')}
        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center space-x-3 hover:border-blue-100 transition cursor-pointer active:scale-95"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="block text-xs font-semibold text-slate-700">Forecast</span>
          <span className="block text-sm font-extrabold text-slate-800">{forecastSummary}</span>
        </div>
      </div>

      {/* Safe Zones Card */}
      <div
        onClick={() => onMetricClick?.('safe-zones')}
        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center space-x-3 hover:border-emerald-100 transition cursor-pointer active:scale-95"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <span className="block text-xs font-semibold text-slate-700">Safe Zones</span>
          <span className="block text-sm font-extrabold text-emerald-600">{safeZonesCount} Locations</span>
        </div>
      </div>
    </section>
  );
};
