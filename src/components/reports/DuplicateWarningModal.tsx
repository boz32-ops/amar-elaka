import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertCircle, ThumbsUp, ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../ui/Badge';
import { Link } from 'react-router-dom';

interface DuplicateReportCandidate {
  _id: string;
  reportId: string;
  title: string;
  category: string;
  area: string;
  address: string;
  status: string;
  distanceMeters?: number;
  matchReason: string;
}

interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicates: DuplicateReportCandidate[];
  onProceedAnyway: () => void;
  isSubmitting?: boolean;
}

export const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({
  isOpen,
  onClose,
  duplicates,
  onProceedAnyway,
  isSubmitting = false,
}) => {
  const { t, language } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('duplicateWarningTitle')}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>{t('duplicateWarningDesc')}</p>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {duplicates.map((dup) => (
            <div
              key={dup._id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
                    {dup.reportId}
                  </span>
                  <StatusBadge status={dup.status as any} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {dup.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {dup.area}, {dup.address}
                </p>
                <div className="mt-1.5 text-[11px] text-amber-700 font-medium">
                  • {dup.matchReason}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                <Link
                  to={`/report/${dup.reportId}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  <span>{language === 'bn' ? 'রিপোর্টটি দেখুন ও সমর্থন দিন' : 'View & Support This Report'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {t('btnBackToEdit')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onProceedAnyway}
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            <span>{t('btnProceedAnyway')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
