import React from 'react';

interface MobileStatusBarProps {
  currentTime?: string;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  currentTime = '9:41'
}) => {
  return (
    <div className="w-full px-7 pt-3.5 pb-2 flex justify-between items-center bg-white z-20 shrink-0 text-slate-800 select-none">
      <div className="font-bold text-sm tracking-tight">{currentTime}</div>
      <div className="flex items-center space-x-2 text-xs">
        {/* Cellular Signal Icon */}
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path className="opacity-0" d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.2.2-.2.51 0 .71.1.1.23.15.35.15s.26-.05.35-.15l1.9-1.9C8.38 19.34 10.11 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          <rect height="5" rx="0.5" width="3" x="2" y="16" />
          <rect height="9" rx="0.5" width="3" x="7" y="12" />
          <rect height="13" rx="0.5" width="3" x="12" y="8" />
          <rect height="17" rx="0.5" width="3" x="17" y="4" />
        </svg>
        {/* Wi-Fi Icon */}
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.5 0 6.69 1.4 9.03 3.66L12 19.23 2.97 11.16C5.31 8.9 8.5 7.5 12 7.5z" />
        </svg>
        {/* Battery Icon */}
        <div className="w-6 h-3 border-2 border-slate-700 rounded-sm p-0.5 flex items-center">
          <div className="w-full h-full bg-slate-800 rounded-2xs"></div>
        </div>
      </div>
    </div>
  );
};
