import React from 'react';

interface MobileAlertsProps {
  onViewAll?: () => void;
  onAlertSelect?: (title: string) => void;
}

export const MobileAlerts: React.FC<MobileAlertsProps> = ({
  onViewAll,
  onAlertSelect
}) => {
  return (
    <section className="pt-2" data-purpose="recent-alerts">
      <div className="flex justify-between items-center mb-2.5">
        <h2 className="text-sm font-bold text-slate-800">Recent Alerts</h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5"
        >
          <span>View all</span>
          <span className="text-xs">→</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {/* Alert 1: High Water Level Alert */}
        <article
          onClick={() => onAlertSelect?.('High Water Level Alert')}
          className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between active:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">High Water Level Alert</h3>
              <p className="text-[11px] text-slate-500 font-medium">Riverside Area • 2h ago</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </article>

        {/* Alert 2: Flash Flood Warning */}
        <article
          onClick={() => onAlertSelect?.('Flash Flood Warning')}
          className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between active:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Flash Flood Warning</h3>
              <p className="text-[11px] text-slate-500 font-medium">Green Park • 4h ago</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </article>
      </div>
    </section>
  );
};
