import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyTermsPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'গোপনীয়তা ও আইনি সুরক্ষা' : 'Privacy & Terms'}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('privacyPolicy')} & {t('termsOfService')}
        </h1>
        <p className="text-sm text-slate-500">
          Last updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* Privacy Notice */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>{language === 'bn' ? '১. নাগরিক গোপনীয়তা নীতি' : '1. Privacy Protection Standards'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'আমরা আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা দিতে অঙ্গীকারবদ্ধ। সমস্যা রিপোর্ট করার সময় আপনার ফোন নম্বর বা ইমেইল ঠিকানা কোনো অবস্থাতেই সাধারণ জনগণের নিকট উন্মুক্ত করা হয় না।'
              : 'We are committed to upholding strict citizen confidentiality. Your private telephone number and email address are never exposed publicly on the platform.'}
          </p>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900 text-xs">
            <EyeOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              {language === 'bn'
                ? 'মানচিত্রে প্রদর্শিত অবস্থান শুধুমাত্র সমস্যার স্থান নির্দেশ করে; এটি কোনো বাসিন্দার ব্যক্তিগত বাসভবনের গোপনীয়তা লঙ্ঘন করে না।'
                : 'Report coordinates are restricted to public civic spaces (roads, drains, light posts) and do not expose private home boundaries.'}
            </p>
          </div>
        </div>

        {/* Data Usage */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>{language === 'bn' ? '২. ব্যবহারের শর্তাবলী' : '2. Terms of Platform Usage'}</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'প্ল্যাটফর্মে দাখিলকৃত সমস্যাসমূহ সংশ্লিষ্ট সিটি কর্পোরেশন, পৌরসভা, বিদ্যুৎ বা পানি সরবরাহ কর্তৃপক্ষকে অবহিতকরণের জন্য উন্মুক্ত পাবলিক রেকর্ড হিসেবে প্রক্রিয়াজাত করা হয়।'
              : 'Citizen submissions are processed as transparent public records to foster civic accountability among local authorities and municipal contractors.'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Users must be at least 13 years of age to register an account.</li>
            <li>Photos uploaded must directly depict the civic hazard.</li>
            <li>Abusive, defamatory, or fraudulent content will result in immediate suspension.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
