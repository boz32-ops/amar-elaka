import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EmergencyBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-2 text-xs md:text-sm font-medium shadow-inner flex items-center justify-between">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
          <span>
            <strong className="text-amber-200 mr-1.5">{t('emergencyAlert')}</strong>
            {t('emergencyText')}
          </span>
        </div>
        <a
          href="tel:999"
          className="ml-3 shrink-0 inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-amber-100 px-3 py-1 rounded-full font-bold transition-colors shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>৯৯৯ / 999</span>
        </a>
      </div>
    </div>
  );
};
