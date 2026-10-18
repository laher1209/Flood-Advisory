import React from 'react';
import { LiveFloodAdvisory, LiveLocation } from '../../services/weatherFloodService';

interface GreetingSectionProps {
  userName?: string;
  location?: LiveLocation;
  advisory?: LiveFloodAdvisory;
}

export const GreetingSection: React.FC<GreetingSectionProps> = ({
  userName = 'Adeel',
  location,
  advisory
}) => {
  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'emerald':
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
    }
  };

  return (
    <section data-purpose="greeting-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Good Morning, {userName} <span className="text-xl">👋</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
          <span>Active Flood &amp; Weather Monitoring for</span>
          <strong className="text-slate-700">{location?.name || 'Local Area'}</strong>
          {location?.nearestImdStation && (
            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
              IMD Station: {location.nearestImdStation.name} ({location.nearestImdStation.distanceKm} km away)
            </span>
          )}
        </p>
      </div>

      {/* Real-time Flood Advisory Status Badge */}
      {advisory && (
        <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 shrink-0 ${getBadgeStyle(advisory.badgeColor)}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>{advisory.statusText}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-white/80 rounded font-semibold border border-current">
                Risk: {advisory.riskScore}%
              </span>
            </div>
            <div className="text-[10px] opacity-80 mt-0.5">
              Water Level: {advisory.waterLevelTrend} • 24h Rain: {advisory.metrics.past24hRainfallMm} mm
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
