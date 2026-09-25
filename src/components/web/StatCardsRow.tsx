import React from 'react';
import { MetricCardData } from '../../types';

interface StatCardsRowProps {
  cards: MetricCardData[];
  onActionClick?: (cardId: string) => void;
}

export const StatCardsRow: React.FC<StatCardsRowProps> = ({
  cards,
  onActionClick
}) => {
  const getCardStyles = (type: MetricCardData['type']) => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-50 text-red-600',
          linkColor: 'text-red-600 hover:text-red-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-600',
          linkColor: 'text-amber-600 hover:text-amber-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
      case 'primary':
        return {
          iconBg: 'bg-blue-50 text-blue-600',
          linkColor: 'text-blue-600 hover:text-blue-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
      case 'success':
      default:
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
          linkColor: 'text-emerald-600 hover:text-emerald-700',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
    }
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="metrics-summary-cards">
      {cards.map((card) => {
        const styles = getCardStyles(card.type);
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
                {styles.icon}
              </div>
              <span className="text-2xl font-extrabold text-slate-900">{card.value}</span>
            </div>
            <div className="mt-3">
              <h5 className="text-xs font-semibold text-slate-600">{card.title}</h5>
              <button
                type="button"
                onClick={() => onActionClick?.(card.id)}
                className={`text-[11px] font-bold ${styles.linkColor} flex items-center gap-1 mt-1 transition-colors`}
              >
                {card.actionText} <span>→</span>
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
};
