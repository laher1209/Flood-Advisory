import React from 'react';
import { EmergencyService } from '../../types';

interface EmergencyContactsProps {
  contacts: EmergencyService[];
  onCallInitiate?: (phone: string, title: string) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
  onCallInitiate
}) => {
  const getServiceStyles = (color: EmergencyService['themeColor']) => {
    switch (color) {
      case 'red':
        return {
          iconBg: 'bg-red-500 text-white',
          buttonStyle: 'bg-red-50 hover:bg-red-100 text-red-600'
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500 text-white',
          buttonStyle: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
        };
      case 'blue':
      default:
        return {
          iconBg: 'bg-blue-500 text-white',
          buttonStyle: 'bg-blue-50 hover:bg-blue-100 text-blue-600'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">Emergency Assistance</h4>
            <p className="text-[11px] text-slate-400">Direct disaster response channels</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-red-600">24/7 Hotlines</span>
      </div>

      <div className="space-y-2.5">
        {contacts.map((service) => {
          const styles = getServiceStyles(service.themeColor);
          return (
            <div
              key={service.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-lg ${styles.iconBg} flex items-center justify-center text-xs font-bold`}>
                  {service.emoji}
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">{service.title}</div>
                  <div className="text-[11px] text-slate-500">{service.description}</div>
                </div>
              </div>
              <a
                onClick={() => onCallInitiate?.(service.phone, service.title)}
                className={`px-3 py-1 ${styles.buttonStyle} font-bold text-xs rounded-lg transition-colors cursor-pointer select-none`}
                href={`tel:${service.phone}`}
              >
                Call {service.phone}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
