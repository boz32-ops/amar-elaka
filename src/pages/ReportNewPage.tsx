import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  X,
  MapPin,
  AlertTriangle,
  Eye,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { LocationPicker } from '../components/map/LocationPicker';
import { DuplicateWarningModal } from '../components/reports/DuplicateWarningModal';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/ui/Badge';

export const ReportNewPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { error, success, info } = useToast();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Road Damage');
  const [priority, setPriority] = useState<string>('Medium');
  const [area, setArea] = useState(user?.area || 'Gunaigach, Ulipur, Kurigram');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // File uploads
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Preview & duplicate modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateCandidates, setDuplicateCandidates] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image files selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 4) {
      error('Maximum 4 images allowed per report.');
      return;
    }

    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        error(`File ${file.name} is larger than 5MB.`);
        continue;
      }
      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Pre-submission validation & duplicate check
  const handleInitiateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      info(
        language === 'bn'
          ? 'সমস্যা রিপোর্ট করতে অনুগ্রহ করে লগইন বা নিবন্ধন করুন।'
          : 'Please log in to submit a civic report.'
      );
      navigate('/login');
      return;
    }

    if (!title.trim() || title.length < 5) {
      error('Title must be at least 5 characters.');
      return;
    }

    if (!description.trim() || description.length < 10) {
      error('Description must be at least 10 characters.');
      return;
    }

    if (!area.trim() || !address.trim()) {
      error('Area and Address are required.');
      return;
    }

    // Step 1: Check for potential duplicates
    try {
      const dupData = await api.post<{
        success: boolean;
        hasPotentialDuplicates: boolean;
        duplicates: any[];
      }>('/reports/check-duplicate', {
        category,
        title: title.trim(),
        area: area.trim(),
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      });

      if (dupData.success && dupData.hasPotentialDuplicates && dupData.duplicates.length > 0) {
        setDuplicateCandidates(dupData.duplicates);
        setIsDuplicateModalOpen(true);
        return;
      }
    } catch {
      // If duplicate check fails, continue to preview
    }

    // If no duplicate warning, open preview modal
    setIsPreviewOpen(true);
  };

  // Final submission action
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('priority', priority);
      formData.append('area', area.trim());
      formData.append('address', address.trim());
      formData.append('district', user?.district || 'Kurigram');

      if (coords) {
        formData.append('latitude', String(coords.latitude));
        formData.append('longitude', String(coords.longitude));
      }

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const data = await api.postForm<{ success: boolean; report: any }>('/reports', formData);

      if (data.success && data.report) {
        success(
          language === 'bn'
            ? `আপনার অভিযোগটি সফলভাবে জমা হয়েছে (আইডি: ${data.report.reportId})`
            : `Report submitted successfully (ID: ${data.report.reportId})`
        );
        setIsPreviewOpen(false);
        setIsDuplicateModalOpen(false);
        navigate(`/report/${data.report.reportId}`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('formTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('formSubtitle')}
        </p>
      </div>

      <form onSubmit={handleInitiateSubmission} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {language === 'bn' ? '১. সমস্যার বিবরণ' : '1. Problem Details'}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('fieldTitle')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('fieldTitlePlaceholder')}
              maxLength={150}
              required
              className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('fieldCategory')} <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full text-sm rounded-xl border border-slate-300 p-3 bg-white focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="Road Damage">{t('catRoadDamage')}</option>
                <option value="Drainage">{t('catDrainage')}</option>
                <option value="Garbage">{t('catGarbage')}</option>
                <option value="Water Supply">{t('catWaterSupply')}</option>
                <option value="Streetlights">{t('catStreetlights')}</option>
                <option value="Electricity">{t('catElectricity')}</option>
                <option value="Public Safety">{t('catPublicSafety')}</option>
                <option value="Environment">{t('catEnvironment')}</option>
                <option value="Public Facilities">{t('catPublicFacilities')}</option>
                <option value="Other">{t('catOther')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('fieldPriority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 p-3 bg-white focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="Low">{t('priorityLow')}</option>
                <option value="Medium">{t('priorityMedium')}</option>
                <option value="High">{t('priorityHigh')}</option>
                <option value="Urgent">{t('priorityUrgent')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('fieldDescription')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('fieldDescriptionPlaceholder')}
              rows={4}
              maxLength={3000}
              required
              className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Location & Map Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {language === 'bn' ? '২. অবস্থান ও ঠিকানা' : '2. Location & Address'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('fieldArea')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={t('fieldAreaPlaceholder')}
                required
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('fieldAddress')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('fieldAddressPlaceholder')}
                required
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Interactive Leaflet Location Picker */}
          <LocationPicker
            latitude={coords?.latitude}
            longitude={coords?.longitude}
            onChange={(c) => setCoords(c)}
          />
        </div>

        {/* Photo Attachments Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {language === 'bn' ? '৩. ছবি প্রমাণাদি সংযুক্তকরণ' : '3. Photo Attachments'}
          </h2>

          <div className="space-y-3">
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all">
              <Upload className="w-8 h-8 text-emerald-600 mb-2" />
              <span className="text-xs font-semibold text-slate-700">
                {t('uploadDragDrop')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                JPEG, PNG, WebP (Max 4 images, up to 5MB each)
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Photo Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 h-28">
                    <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button type="submit" size="lg" className="px-8 shadow-md">
            <Eye className="w-4 h-4 mr-1.5" />
            <span>{t('previewBeforeSubmit')}</span>
          </Button>
        </div>
      </form>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicates={duplicateCandidates}
        onProceedAnyway={() => {
          setIsDuplicateModalOpen(false);
          setIsPreviewOpen(true);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Final Submission Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={t('previewBeforeSubmit')}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={category as any} />
            <PriorityBadge priority={priority as any} />
          </div>

          <div>
            <h3 className="font-extrabold text-lg text-slate-900 leading-snug">{title}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{area}, {address}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
            {description}
          </div>

          {previewUrls.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">Attached Photos:</span>
              <div className="grid grid-cols-4 gap-2">
                {previewUrls.map((url, i) => (
                  <img key={i} src={url} alt="Preview" className="h-16 w-full object-cover rounded-lg border" />
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
            >
              {t('btnBackToEdit')}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleFinalSubmit}
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>{t('btnSubmitReport')}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
