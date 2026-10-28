import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { Flag } from 'lucide-react';

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
}

export const FlagModal: React.FC<FlagModalProps> = ({ isOpen, onClose, reportId }) => {
  const { t, language } = useLanguage();
  const { success, error } = useToast();

  const [reason, setReason] = useState<'spam' | 'offensive' | 'inaccurate' | 'duplicate' | 'other'>('spam');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/reports/${reportId}/flag`, { reason, notes });
      success(
        language === 'bn'
          ? 'রিপোর্টটি মডারেশন দলের পর্যালোচনার জন্য পাঠানো হয়েছে।'
          : 'Report flagged for moderator review. Thank you.'
      );
      onClose();
    } catch (err: any) {
      error(err.message || 'Failed to flag report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('flagReport')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'প্ল্যাটফর্মের স্বচ্ছতা বজায় রাখতে অনুপযুক্ত বা ভুয়া রিপোর্ট সম্পর্কে প্রশাসনকে জানান।'
            : 'Help maintain platform integrity by reporting spam, offensive, or inaccurate content.'}
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {language === 'bn' ? 'অভিযোগের কারণ' : 'Reason for Flagging'}
          </label>
          <select
            value={reason}
            onChange={(e: any) => setReason(e.target.value)}
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
          >
            <option value="spam">{language === 'bn' ? 'স্প্যাম / অপ্রাসঙ্গিক প্রচার' : 'Spam / Commercial advertising'}</option>
            <option value="offensive">{language === 'bn' ? 'আপত্তিকর বা অপমানজনক ভাষা' : 'Offensive / Abusive content'}</option>
            <option value="inaccurate">{language === 'bn' ? 'সম্পূর্ণ অসত্য বা বিভ্রান্তিকর তথ্য' : 'Completely inaccurate information'}</option>
            <option value="duplicate">{language === 'bn' ? 'অনুরূপ বিদ্যমান রিপোর্ট' : 'Duplicate of existing report'}</option>
            <option value="other">{language === 'bn' ? 'অন্যান্য কারণ' : 'Other'}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {language === 'bn' ? 'অতিরিক্ত ব্যাখ্যা (ঐচ্ছিক)' : 'Additional Notes (Optional)'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder={language === 'bn' ? 'সংক্ষেপে কারণটি লিখুন...' : 'Briefly explain why this report should be reviewed...'}
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" size="sm" isLoading={submitting}>
            <Flag className="w-3.5 h-3.5 mr-1" />
            Submit Flag
          </Button>
        </div>
      </form>
    </Modal>
  );
};
