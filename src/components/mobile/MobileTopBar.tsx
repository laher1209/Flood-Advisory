import React from 'react';

interface MobileTopBarProps {
  onNotificationClick?: () => void;
  hasNotification?: boolean;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onNotificationClick,
  hasNotification = true
}) => {
  return (
    <header className="bg-white px-6 py-2.5 flex justify-between items-center border-b border-slate-100 z-10 shrink-0">
      <div className="flex items-center space-x-2.5">
        {/* Logo Icon */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-800">FloodSafe</span>
      </div>

      {/* Notification Bell */}
      <button
        onClick={onNotificationClick}
        aria-label="Notifications"
        className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition relative active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {hasNotification && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>
    </header>
  );
};
