import React from 'react';
import { AlertOctagon, CheckCircle2, Clock, FileText, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SummaryCardsProps {
  summary: {
    total: number;
    unresolved: number;
    resolved: number;
    urgent: number;
  };
  hasDemoData?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, hasDemoData = true }) => {
  const { t, language } = useLanguage();

  const resolutionRate =
    summary.total > 0 ? Math.round((summary.resolved / summary.total) * 100) : 0;

  const cards = [
    {
      title: t('statTotal'),
      value: summary.total,
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-100',
    },
    {
      title: t('statUnresolved'),
      value: summary.unresolved,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-100',
    },
    {
      title: t('statResolved'),
      value: summary.resolved,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-100',
      subtext: `${resolutionRate}% ${t('resolutionRate')}`,
    },
    {
      title: t('statUrgent'),
      value: summary.urgent,
      icon: AlertOctagon,
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-100',
    },
  ];

  return (
    <div className="space-y-3">
      {hasDemoData && (
        <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50/80 border border-purple-200/80 px-3.5 py-1.5 rounded-xl font-medium w-fit">
          <Info className="w-3.5 h-3.5 text-purple-600" />
          <span>{t('demoDataNotice')}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-white border ${card.borderColor} shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 leading-snug">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                {card.subtext ? (
                  <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{card.subtext}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 mt-1">
                    {language === 'bn' ? 'মোট নিবন্ধিত' : 'Recorded entries'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
