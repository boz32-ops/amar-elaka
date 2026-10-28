import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

interface ShareButtonProps {
  reportId: string;
  title: string;
  size?: 'sm' | 'md';
}

export const ShareButton: React.FC<ShareButtonProps> = ({ reportId, title, size = 'md' }) => {
  const { t } = useLanguage();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const url = `${window.location.origin}/report/${reportId}`;

    if (navigator.share) {
      navigator
        .share({
          title: `আমার এলাকা | ${title}`,
          text: `Check out this civic problem report on Amar Elaka: ${title}`,
          url,
        })
        .catch(() => {
          // Fallback to clipboard
          copyToClipboard(url);
        });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    success(t('linkCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleShare}
      title={t('share')}
      aria-label="Share report"
      className={`inline-flex items-center gap-1 rounded-xl font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
        isSmall ? 'p-1.5 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
    >
      {copied ? (
        <Check className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-emerald-600`} />
      ) : (
        <Share2 className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      )}
      {!isSmall && <span>{copied ? 'Copied' : t('share')}</span>}
    </button>
  );
};
