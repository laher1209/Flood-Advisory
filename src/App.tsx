import React, { useState } from 'react';
import { WebDashboard } from './components/web/WebDashboard';
import { MobileApp } from './components/mobile/MobileApp';

type PlatformMode = 'web' | 'mobile' | 'dual';

export const App: React.FC = () => {
  const [platformMode, setPlatformMode] = useState<PlatformMode>('web');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {/* Top Cross-Platform Control Switcher Header */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">FloodSafe React TSX Platform</span>
            <span className="text-[10px] text-blue-400 block">Cross-Platform Web &amp; Mobile UI</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setPlatformMode('web')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              platformMode === 'web'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Web Dashboard</span>
          </button>

          <button
            onClick={() => setPlatformMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              platformMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span>Android Mobile</span>
          </button>

          <button
            onClick={() => setPlatformMode('dual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              platformMode === 'dual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3m8-18h3a2 2 0 012 2v14a2 2 0 01-2 2h-3" />
            </svg>
            <span>Dual View</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            ● TypeScript Active
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
            React 18+ TSX
          </span>
        </div>
      </header>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        {platformMode === 'web' && (
          <div className="w-full h-full">
            <WebDashboard />
          </div>
        )}

        {platformMode === 'mobile' && (
          <div className="w-full h-full flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
            <MobileApp />
          </div>
        )}

        {platformMode === 'dual' && (
          <div className="w-full h-full grid grid-cols-1 xl:grid-cols-12 overflow-y-auto">
            {/* Left 8 cols: Web Dashboard */}
            <div className="xl:col-span-8 border-b xl:border-b-0 xl:border-r border-slate-800 h-[650px] xl:h-full overflow-hidden">
              <div className="bg-slate-950 px-3 py-1.5 text-xs text-slate-400 font-semibold border-b border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Web Dashboard Viewport
              </div>
              <div className="h-[calc(100%-33px)]">
                <WebDashboard />
              </div>
            </div>

            {/* Right 4 cols: Mobile App */}
            <div className="xl:col-span-4 bg-slate-950/40 p-4 flex flex-col items-center justify-center overflow-y-auto">
              <div className="w-full text-center pb-2 text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mobile App Viewport
              </div>
              <MobileApp />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
