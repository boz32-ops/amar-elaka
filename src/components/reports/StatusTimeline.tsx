import React from 'react';
import { StatusHistoryItem } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { Clock, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface StatusTimelineProps {
  history: StatusHistoryItem[];
  resolutionProof?: {
    images: string[];
    notes: string;
    resolvedAt: string;
  };
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  history,
  resolutionProof,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {history.map((item, itemIdx) => {
            const isLast = itemIdx === history.length - 1;
            const dateStr = new Date(item.timestamp).toLocaleString(
              language === 'bn' ? 'bn-BD' : 'en-US',
              {
                dateStyle: 'medium',
                timeStyle: 'short',
              }
            );

            return (
              <li key={itemIdx}>
                <div className="relative pb-8">
                  {!isLast && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-start space-x-3">
                    {/* Status Circle Icon */}
                    <div className="relative">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                          item.status === 'Resolved'
                            ? 'bg-emerald-600 text-white'
                            : item.status === 'In Progress'
                            ? 'bg-emerald-500 text-white animate-pulse'
                            : item.status === 'Rejected'
                            ? 'bg-red-500 text-white'
                            : item.status === 'Accepted'
                            ? 'bg-blue-600 text-white'
                            : item.status === 'Under Review'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-400 text-white'
                        }`}
                      >
                        {item.status === 'Resolved' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Timeline Event Details */}
                    <div className="min-w-0 flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} />
                          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                            {item.changedByName}
                            <span className="text-[10px] text-slate-500 font-normal uppercase bg-slate-200/70 px-1.5 py-0.2 rounded">
                              {item.changedByRole}
                            </span>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{dateStr}</span>
                      </div>

                      {item.note && (
                        <p className="text-xs text-slate-700 mt-2 bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed font-sans">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Resolution Proof Card if resolved */}
      {resolutionProof && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{t('resolutionProof')}</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed mb-3">
            {resolutionProof.notes}
          </p>

          {resolutionProof.images && resolutionProof.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {resolutionProof.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Resolution proof"
                  className="rounded-xl h-24 w-full object-cover border border-emerald-200 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          )}

          <div className="mt-3 text-[10px] text-emerald-700">
            Resolved at: {new Date(resolutionProof.resolvedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};
