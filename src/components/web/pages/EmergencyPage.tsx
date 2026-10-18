import React from 'react';
import { EMERGENCY_SERVICES } from '../../../data/mockData';

interface EmergencyPageProps {
  onNotify?: (msg: string) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onNotify }) => {
  return (
    <div className="space-y-4 fade-in pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Emergency &amp; Rescue Contacts</h2>
        <p className="text-xs text-slate-500 mt-0.5">24/7 Government disaster response and rescue dispatch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {EMERGENCY_SERVICES.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{e.emoji}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{e.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{e.description}</p>
                </div>
              </div>

              <a
                href={`tel:${e.phone}`}
                onClick={() => onNotify?.(`Dialing ${e.title} (${e.phone})...`)}
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm transition-colors ${
                  e.themeColor === 'red'
                    ? 'bg-red-600 hover:bg-red-700'
                    : e.themeColor === 'emerald'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Call {e.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Immediate Life-Threatening Emergency Card */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-5 mt-6">
        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
          <span>⚠️</span> In an Immediate Life-Threatening Situation
        </h3>
        <p className="text-sm text-red-700 mb-4">
          If you or someone around you is in immediate danger due to rapid flooding or water flow, dial <strong>112</strong> immediately. Do not attempt to cross flooded roadways on foot or vehicle.
        </p>
        <a
          href="tel:112"
          onClick={() => onNotify?.('Connecting to National Emergency Helpline 112!')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
        >
          <span>📞</span> Dial 112 Emergency Hotline
        </a>
      </div>
    </div>
  );
};
