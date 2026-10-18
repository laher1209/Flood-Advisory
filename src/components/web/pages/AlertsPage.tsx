import React, { useState } from 'react';
import { Badge } from './Badge';
import { AlertData } from '../../../types';

interface AlertsPageProps {
  alerts?: AlertData[];
  onNotify?: (msg: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts = [], onNotify }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'danger' | 'warning' | 'primary'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  return (
    <div className="space-y-4 fade-in pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hydrological &amp; Weather Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">{alerts.length} active advisories for your sector</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'danger', 'warning', 'primary'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 bg-white'
              }`}
            >
              {f === 'all' ? 'All Alerts' : f === 'danger' ? 'Severe' : f === 'warning' ? 'Warnings' : 'Advisories'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filteredAlerts.map((a) => {
          const isExpanded = selected === a.id;
          const badgeColor = a.severity === 'danger' ? 'red' : a.severity === 'warning' ? 'amber' : 'blue';

          return (
            <div
              key={a.id}
              onClick={() => setSelected(isExpanded ? null : a.id)}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden cursor-pointer transition-all ${
                isExpanded ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="p-4 flex items-start gap-3.5">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                    a.severity === 'danger'
                      ? 'bg-red-100 text-red-600'
                      : a.severity === 'warning'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {a.severity === 'danger' ? '🚨' : a.severity === 'warning' ? '⚠️' : '🌧️'}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-800">{a.title}</h3>
                    <Badge color={badgeColor}>
                      {a.severity === 'danger' ? 'Severe Flood Alert' : a.severity === 'warning' ? 'Warning' : 'Advisory'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {a.location} • <span className="text-slate-400">{a.timeAgo}</span>
                  </p>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Official meteorological and flood monitoring sensors indicate dynamic water accumulation in this zone. Stay alert and follow municipal evacuation routes if water levels exceed doorstep thresholds.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNotify?.('📢 Advisory shared with community emergency channels.');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Broadcast Alert
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNotify?.('✅ Alert acknowledged.');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
