import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg">
                {language === 'bn' ? 'আমার এলাকা' : 'Amar Elaka'}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              {t('appTagline')}.{' '}
              {language === 'bn'
                ? 'নাগরিক ও স্থানীয় প্রশাসনের যৌথ উদ্যোগে এলাকার সমস্যা চিহ্নিতকরণ এবং কার্যকর সমাধানের আধুনিক প্ল্যাটফর্ম।'
                : 'Empowering residents and municipal agencies to identify, track, and resolve local issues transparently.'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {language === 'bn' ? 'স্বচ্ছ ও নিরাপদ সিভিক-টেক উদ্যোগ' : 'Transparent & Verified Civic Tech'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition-colors">
                  {t('navExplore')}
                </Link>
              </li>
              <li>
                <Link to="/report/new" className="hover:text-emerald-400 transition-colors">
                  {t('navReport')}
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-emerald-400 transition-colors">
                  {t('communityGuidelines')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">
              {language === 'bn' ? 'আইন ও নিরাপত্তা' : 'Privacy & Trust'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                  {t('termsOfService')}
                </Link>
              </li>
              <li className="text-xs text-slate-500 pt-2">
                {language === 'bn'
                  ? 'নাগরিকদের ব্যক্তিগত ফোন ও ইমেইল নম্বর সর্বসাধারণের জন্য প্রদর্শিত হয় না।'
                  : 'Citizens’ private contact information is strictly protected.'}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('copyright')}</p>
          <p className="flex items-center gap-1">
            Built for community empowerment with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
