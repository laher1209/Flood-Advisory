import React from 'react';

interface GreetingSectionProps {
  userName?: string;
  subtitle?: string;
}

export const GreetingSection: React.FC<GreetingSectionProps> = ({
  userName = 'Adeel',
  subtitle = "Here's the latest flood information for your area."
}) => {
  return (
    <section data-purpose="greeting-header">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
        Good Morning, {userName} <span className="text-2xl animate-bounce">👋</span>
      </h2>
      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
    </section>
  );
};
