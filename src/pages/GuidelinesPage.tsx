import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Ban, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const GuidelinesPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'দায়িত্বশীল নাগরিকত্ব' : 'Civic Integrity'}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('communityGuidelines')}
        </h1>
        <p className="text-sm text-slate-500">
          {language === 'bn'
            ? 'আমার এলাকা প্ল্যাটফর্মের সম্মানজনক, তথ্যবহুল এবং নিরাপদ ব্যবহার নিশ্চিত করার নীতিমালা।'
            : 'Standards and principles to ensure honest, productive, and respectful civic engagement.'}
        </p>
      </div>

      {/* Emergency Notice Card */}
      <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
        <div className="p-3 bg-red-600 text-white rounded-2xl shrink-0">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-red-950">
            {language === 'bn'
              ? 'জরুরি পরিস্থিতি বনাম নাগরিক অভিযোগের পার্থক্য'
              : 'Emergency Situations vs Civic Reports'}
          </h3>
          <p className="text-xs sm:text-sm text-red-900 leading-relaxed">
            {language === 'bn'
              ? 'আমার এলাকা কোনো জরুরি উদ্ধার প্ল্যাটফর্ম নয়। অগ্নিকাণ্ড, সহিংসতা, তাৎক্ষণিক সড়ক দুর্ঘটনা বা গ্যাস লিকেজের মতো জীবন-হুমকিমূলক ঘটনায় অনুগ্রহ করে সরাসরি ৯৯৯ (জাতীয় জরুরি সেবা)-এ কল করুন।'
              : 'This platform is not an emergency response dispatch. For active fires, violent crimes, immediate road crashes, or life-threatening gas leaks, dial 999 directly without delay.'}
          </p>
          <a
            href="tel:999"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 999 Immediately</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Do's */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{language === 'bn' ? 'কী করবেন (অনুমোদিত)' : 'What to Do (Encouraged)'}</span>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>নির্দিষ্ট ও সুস্পষ্ট শিরোনাম দিন (যেমন: "মিরপুর ২ ব্লক বি-তে উন্মুক্ত ম্যানহোল")।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>দিনের আলোতে তোলা সুস্পষ্ট ও নির্ভরযোগ্য ছবি সংযুক্ত করুন।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>নতুন সমস্যা তৈরি করার আগে বিদ্যমান সমস্যা খুঁজে সমর্থন (আপভোট) দিন।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>মন্তব্য বিভাগে গঠনমূলক ও সংযত ভাষা ব্যবহার করুন।</span>
            </li>
          </ul>
        </div>

        {/* Don'ts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-800 font-bold text-base">
            <Ban className="w-5 h-5 text-red-600" />
            <span>{language === 'bn' ? 'কী করবেন না (নিষিদ্ধ)' : 'What Not to Do (Prohibited)'}</span>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>কোনো রাজনৈতিক, বাণিজ্যিক প্রচার বা বিজ্ঞাপন পোস্ট করবেন না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>কোনো ব্যক্তির ব্যক্তিগত গোপনীয়তা বা ব্যক্তিগত তথ্য (doxxing) প্রকাশ করবেন না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>ইচ্ছাকৃতভাবে বিভ্রান্তিকর বা অসত্য অভিযোগ দাখিল করবেন না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>একটি সমস্যা বারবার পোস্ট করে স্প্যাম করবেন না।</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
