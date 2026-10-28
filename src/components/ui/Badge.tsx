import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ReportStatus, ReportPriority, ReportCategory } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'demo';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const styles = {
    primary: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    demo: 'bg-purple-100 text-purple-800 border-purple-200 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'Submitted':
      return <Badge variant="info">{t('statusSubmitted')}</Badge>;
    case 'Under Review':
      return <Badge variant="warning">{t('statusUnderReview')}</Badge>;
    case 'Accepted':
      return <Badge variant="primary">{t('statusAccepted')}</Badge>;
    case 'In Progress':
      return <Badge variant="primary" className="animate-pulse">{t('statusInProgress')}</Badge>;
    case 'Resolved':
      return <Badge variant="success">✓ {t('statusResolved')}</Badge>;
    case 'Rejected':
      return <Badge variant="danger">✕ {t('statusRejected')}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: ReportPriority }> = ({ priority }) => {
  const { t } = useLanguage();

  switch (priority) {
    case 'Urgent':
      return <Badge variant="danger">⚡ {t('priorityUrgent')}</Badge>;
    case 'High':
      return <Badge variant="warning">{t('priorityHigh')}</Badge>;
    case 'Medium':
      return <Badge variant="info">{t('priorityMedium')}</Badge>;
    case 'Low':
      return <Badge variant="neutral">{t('priorityLow')}</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

export const CategoryBadge: React.FC<{ category: ReportCategory }> = ({ category }) => {
  const { t } = useLanguage();
  const getCatLabel = (cat: string) => {
    switch (cat) {
      case 'Road Damage': return t('catRoadDamage');
      case 'Drainage': return t('catDrainage');
      case 'Garbage': return t('catGarbage');
      case 'Water Supply': return t('catWaterSupply');
      case 'Streetlights': return t('catStreetlights');
      case 'Electricity': return t('catElectricity');
      case 'Public Safety': return t('catPublicSafety');
      case 'Environment': return t('catEnvironment');
      case 'Public Facilities': return t('catPublicFacilities');
      default: return t('catOther');
    }
  };

  return (
    <Badge variant="neutral" className="bg-slate-100 text-slate-800">
      🏷️ {getCatLabel(category)}
    </Badge>
  );
};
