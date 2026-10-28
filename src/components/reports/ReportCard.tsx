import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, Clock, Flag, CheckCircle2 } from 'lucide-react';
import { Report } from '../../types';
import { StatusBadge, PriorityBadge, CategoryBadge, Badge } from '../ui/Badge';
import { VoteButton } from '../community/VoteButton';
import { ShareButton } from '../community/ShareButton';
import { FlagModal } from '../community/FlagModal';
import { useLanguage } from '../../context/LanguageContext';

interface ReportCardProps {
  report: Report;
  onVoteChange?: (newCount: number, hasUpvoted: boolean) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onVoteChange }) => {
  const { t, language } = useLanguage();
  const [flagModalOpen, setFlagModalOpen] = useState(false);

  const formattedDate = new Date(report.createdAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
        {/* Card Header & Photo */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          {report.images && report.images.length > 0 ? (
            <img
              src={report.images[0]}
              alt={report.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                // If local upload path is not found, fallback to graceful placeholder
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=800&auto=format&fit=crop&q=60';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4">
              <MapPin className="w-10 h-10 text-slate-300 mb-1" />
              <span className="text-xs font-medium">No photo attached</span>
            </div>
          )}

          {/* Top floating badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
              <StatusBadge status={report.status} />
              {report.isDemo && (
                <Badge variant="demo">
                  {language === 'bn' ? 'নমুনা ডেটা' : 'Demo'}
                </Badge>
              )}
            </div>
            <div className="pointer-events-auto">
              <PriorityBadge priority={report.priority} />
            </div>
          </div>

          {/* Report ID Overlay */}
          <div className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-md">
            {report.reportId}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <CategoryBadge category={report.category} />
            </div>

            <Link to={`/report/${report.reportId}`} className="block group-hover:text-emerald-700">
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 transition-colors">
                {report.title}
              </h3>
            </Link>

            <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
              {report.description}
            </p>

            <div className="mt-3.5 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">{report.area}, {report.address}</span>
            </div>

            {report.assignedDepartment && (
              <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">
                  {language === 'bn' ? 'বরাদ্দ:' : 'Dept:'}
                </span>
                <span className="truncate">
                  {language === 'bn' && report.assignedDepartment.nameBn
                    ? report.assignedDepartment.nameBn
                    : report.assignedDepartment.name}
                </span>
              </div>
            )}
          </div>

          {/* Card Footer: Metadata and Actions */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            {/* Author & Date */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-1.5">
              <VoteButton
                reportId={report._id}
                initialUpvotes={report.upvotesCount}
                initialHasUpvoted={report.hasUpvoted}
                onVoteChange={onVoteChange}
                size="sm"
              />

              <Link
                to={`/report/${report.reportId}#comments`}
                className="inline-flex items-center gap-1 p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                title={t('comments')}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{report.commentsCount || 0}</span>
              </Link>

              <ShareButton reportId={report.reportId} title={report.title} size="sm" />

              <button
                onClick={() => setFlagModalOpen(true)}
                title={t('flagReport')}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <FlagModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        reportId={report._id}
      />
    </>
  );
};
