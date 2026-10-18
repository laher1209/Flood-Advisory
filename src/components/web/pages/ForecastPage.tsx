import React from 'react';
import { Badge } from './Badge';
import { DayForecast } from '../../../types';
import { WEEK_FORECAST } from '../../../data/mockData';

interface ForecastPageProps {
  forecastDays?: DayForecast[];
  onNotify?: (msg: string) => void;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({
  forecastDays = WEEK_FORECAST,
  onNotify
}) => {
  return (
    <div className="space-y-4 fade-in pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">7-Day Meteorological &amp; Flood Forecast</h2>
        <p className="text-xs text-slate-500 mt-0.5">ECMWF Numerical Model with IMD Rainfall Ground Calibration</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecastDays.map((f, i) => (
          <div
            key={i}
            onClick={() => onNotify?.(`${f.day}: ${f.condition || 'Clear'}, Temp ${f.temperature}`)}
            className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 ${
              i === 0 ? 'border-blue-300 ring-2 ring-blue-50' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800 text-base">{f.day}</p>
                <p className="text-[11px] text-slate-400">{i === 0 ? 'Today' : `Day +${i}`}</p>
              </div>
              <span className="text-3xl">{f.weatherEmoji}</span>
            </div>

            <p className="text-sm font-semibold text-slate-700 mb-3">{f.condition || 'Partly Cloudy'}</p>

            <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>🌡️ Max / Min Temp</span>
                <span className="font-bold text-slate-700">{f.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span>🌧️ Precipitation Status</span>
                <span className="font-bold text-blue-600">
                  {f.condition?.toLowerCase().includes('rain') ? 'Active Runoff' : 'Nominal'}
                </span>
              </div>
            </div>

            {i <= 1 && (
              <div className="mt-3 pt-2 border-t border-slate-100">
                <Badge color={i === 0 ? 'amber' : 'emerald'}>
                  {i === 0 ? 'Hydrologic Watch' : 'Low Flood Risk'}
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
