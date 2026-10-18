import React, { useState } from 'react';
import { Badge } from './Badge';

interface SettingsPageProps {
  onNotify?: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNotify }) => {
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [loc, setLoc] = useState(true);

  const Toggle: React.FC<{
    val: boolean;
    set: (v: boolean) => void;
    label: string;
    desc: string;
  }> = ({ val, set, label, desc }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => {
          set(!val);
          onNotify?.(`${label}: ${!val ? 'Enabled' : 'Disabled'}`);
        }}
        className={`w-12 h-6 rounded-full transition-colors relative ${val ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            val ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        ></span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4 fade-in pb-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings &amp; Preferences</h2>
        <p className="text-xs text-slate-500 mt-0.5">Configure alerting thresholds and registered evacuation profile</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-1">User Profile</h3>
        <div className="flex items-center gap-4 py-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-base">
            AK
          </div>
          <div>
            <p className="font-bold text-slate-800">Adeel Khan</p>
            <p className="text-xs text-slate-500">Ludhiana, Punjab — Sector 4</p>
            <div className="mt-1">
              <Badge color="emerald">Active Citizen Monitor</Badge>
            </div>
          </div>
        </div>

        <Toggle
          val={notif}
          set={setNotif}
          label="Push Notifications"
          desc="Receive immediate SMS and push alarms for Red/Orange alerts"
        />
        <Toggle
          val={sound}
          set={setSound}
          label="Emergency Alert Siren"
          desc="Play audible warning sound even if phone is on vibrate"
        />
        <Toggle
          val={loc}
          set={setLoc}
          label="GPS Background Tracking"
          desc="Continuously calculate nearest high-ground shelter"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Registered Primary Location</h3>
        <div className="p-3 bg-blue-50 rounded-xl flex items-center gap-3">
          <span className="text-xl">📍</span>
          <div>
            <p className="text-xs font-bold text-slate-800">Model Town, Ludhiana</p>
            <p className="text-[11px] text-slate-500">Pin Code: 141002 — Assigned Station: Ludhiana (42099)</p>
          </div>
          <button
            onClick={() => onNotify?.('Updating location preferences...')}
            className="ml-auto px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};
