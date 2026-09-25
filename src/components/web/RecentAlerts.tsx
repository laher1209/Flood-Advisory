import React from 'react';
import { AlertData } from '../../types';

interface RecentAlertsProps {
  alerts: AlertData[];
  onViewAll?: () => void;
  onAlertClick?: (alert: AlertData) => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({
  alerts,
  onViewAll,
  onAlertClick
}) => {
  const getSeverityStyle = (severity: AlertData['severity']) => {
    switch (severity) {
      case 'danger':
      case 'severe':
        return {
          bg: 'bg-red-100 text-red-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
      case 'warning':
      case 'high':
        return {
          bg: 'bg-amber-100 text-amber-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
      case 'primary':
        return {
          bg: 'bg-blue-100 text-blue-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
      case 'moderate':
      default:
        return {
          bg: 'bg-cyan-100 text-cyan-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex-1 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-800">Recent Alerts</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          View all <span>→</span>
        </button>
      </div>

      {/* Alerts List Items */}
      <div className="divide-y divide-slate-100 my-1">
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          return (
            <div
              key={alert.id}
              onClick={() => onAlertClick?.(alert)}
              className="py-2.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50/80 px-1 rounded-lg transition-colors"
            >
              <div className={`w-7 h-7 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {style.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-800 truncate">{alert.title}</p>
                  <span className="text-[10px] text-slate-400">{alert.timeAgo}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{alert.location}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
