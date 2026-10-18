import React from 'react';

interface BadgeProps {
  color?: 'red' | 'amber' | 'orange' | 'emerald' | 'blue' | 'cyan' | string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ color = 'blue', children }) => {
  const colors: Record<string, string> = {
    red: 'bg-red-100 text-red-700 border-red-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};
