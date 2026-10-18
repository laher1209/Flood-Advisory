import React from 'react';
import { Badge } from './Badge';

interface RiskZoneItem {
  id: string | number;
  zone: string;
  risk: 'Severe' | 'High' | 'Moderate' | 'Low';
  color: 'red' | 'orange' | 'amber' | 'emerald';
  desc: string;
  affected: number;
}

const DEFAULT_RISK_ZONES: RiskZoneItem[] = [
  { id: 1, zone: 'Riverside Sector A (Low Ground)', risk: 'Severe', color: 'red', desc: 'Active water accumulation and river bank overflow threat.', affected: 2340 },
  { id: 2, zone: 'Green Park Block B', risk: 'High', color: 'orange', desc: 'Waterlogging expected within 4 to 6 hours if rainfall continues.', affected: 1200 },
  { id: 3, zone: 'Kailash Nagar Lowlands', risk: 'Moderate', color: 'amber', desc: 'Drainage running at 85% capacity. Watch for street water accumulation.', affected: 890 },
  { id: 4, zone: 'Sunset Colony', risk: 'Moderate', color: 'amber', desc: 'Puddle accumulation detected in street corners and basement parking.', affected: 760 },
  { id: 5, zone: 'Model Town Phase 2', risk: 'Low', color: 'emerald', desc: 'Elevated topography. Safe from surface runoff.', affected: 0 },
  { id: 6, zone: 'Sector 9 Ridge Area', risk: 'Low', color: 'emerald', desc: 'Safe shelter evacuation corridor. Clear access roads.', affected: 0 }
];

interface RiskZonesPageProps {
  onNotify?: (msg: string) => void;
}

export const RiskZonesPage: React.FC<RiskZonesPageProps> = ({ onNotify }) => {
  return (
    <div className="space-y-4 fade-in pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Hydrologic Risk Zones</h2>
        <p className="text-xs text-slate-500 mt-0.5">Topographical elevation and drainage basin classification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DEFAULT_RISK_ZONES.map((z) => (
          <div
            key={z.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow border-l-4 ${
              z.risk === 'Severe'
                ? 'border-l-red-500'
                : z.risk === 'High'
                ? 'border-l-orange-500'
                : z.risk === 'Moderate'
                ? 'border-l-amber-400'
                : 'border-l-emerald-500'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{z.zone}</h3>
                <p className="text-xs text-slate-500 mt-1">{z.desc}</p>
                {z.affected > 0 && (
                  <p className="text-xs text-red-600 font-semibold mt-2">
                    👥 ~{z.affected.toLocaleString()} residents in catchment
                  </p>
                )}
              </div>
              <Badge color={z.color}>{z.risk} Risk</Badge>
            </div>

            {(z.risk === 'Severe' || z.risk === 'High') && (
              <button
                onClick={() => onNotify?.(`Evacuation order issued for ${z.zone}`)}
                className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Initiate Evacuation Alert
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
