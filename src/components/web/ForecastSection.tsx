import React from 'react';
import { DayForecast } from '../../types';

interface ForecastSectionProps {
  forecastDays: DayForecast[];
  onViewDetails?: () => void;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({
  forecastDays,
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-slate-800">7-Day Forecast</h3>
        <button
          onClick={onViewDetails}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          View details <span>→</span>
        </button>
      </div>

      {/* Horizontal forecast mini week cards */}
      <div className="grid grid-cols-7 gap-1 pt-1 text-center">
        {forecastDays.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title={item.condition || item.day}
          >
            <span className="text-[11px] text-slate-400 font-medium">{item.day}</span>
            <span className="text-base my-1 transform hover:scale-125 transition-transform">
              {item.weatherEmoji}
            </span>
            <span className="text-xs font-bold text-slate-700">{item.temperature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
