import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  PlusCircle,
  Map as MapIcon,
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Report } from '../types';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { ReportCard } from '../components/reports/ReportCard';
import { LeafletMapExplorer } from '../components/map/LeafletMapExplorer';
import { Button } from '../components/ui/Button';
import { AdminProfileCard } from '../components/ui/AdminProfileCard';
import { ActivitySlider } from '../components/ui/ActivitySlider';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [summary, setSummary] = useState({
    total: 0,
    unresolved: 0,
    resolved: 0,
    urgent: 0,
    categories: [] as Array<{ category: string; count: number }>,
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [trendingReports, setTrendingReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await api.get<{
          success: boolean;
          summary: any;
          recentReports: Report[];
          trendingReports: Report[];
        }>('/reports/home-summary');

        if (data.success) {
          setSummary(data.summary);
          setRecentReports(data.recentReports);
          setTrendingReports(data.trendingReports);
        }
      } catch (err) {
        console.error('Error fetching home summary:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categoriesList = [
    { id: '', labelBn: 'সকল ক্যাটেগরি', labelEn: 'All Categories' },
    { id: 'Road Damage', labelBn: 'সড়ক ক্ষতি / গর্ত', labelEn: 'Road Damage' },
    { id: 'Drainage', labelBn: 'নিকাশী / জলাবদ্ধতা', labelEn: 'Drainage & Waterlogging' },
    { id: 'Garbage', labelBn: 'ময়লা-আবর্জনা', labelEn: 'Garbage & Waste' },
    { id: 'Water Supply', labelBn: 'পানি সরবরাহ', labelEn: 'Water Supply' },
    { id: 'Streetlights', labelBn: 'সড়ক বাতি', labelEn: 'Streetlights' },
    { id: 'Electricity', labelBn: 'বিদ্যুৎ', labelEn: 'Electricity' },
    { id: 'Public Safety', labelBn: 'জননিরাপত্তা', labelEn: 'Public Safety' },
    { id: 'Environment', labelBn: 'পরিবেশ', labelEn: 'Environment' },
  ];

  const filteredRecent = recentReports.filter((r) => {
    const matchCat = !selectedCategory || r.category === selectedCategory;
    const matchQuery =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-8 sm:p-12 md:p-16 shadow-xl border border-emerald-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === 'bn'
                ? 'স্থানীয় এলাকা সমস্যা সমাধান পোর্টাল'
                : 'Local Area Problem Resolution Platform'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/report/new">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25">
                <PlusCircle className="w-5 h-5 mr-1" />
                <span>{t('btnReportProblem')}</span>
              </Button>
            </Link>

            <Link to="/explore">
              <Button size="lg" variant="outline" className="border-slate-700 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                <MapIcon className="w-5 h-5 mr-1" />
                <span>{t('btnExploreMap')}</span>
              </Button>
            </Link>

            {isAuthenticated && (
              <Link to="/my-reports">
                <Button size="lg" variant="ghost" className="text-emerald-300 hover:bg-white/5">
                  <span>{t('btnTrackMyReports')}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Summary KPI Metrics */}
      <section>
        <SummaryCards summary={summary} hasDemoData={true} />
      </section>

      {/* Interactive Map Preview & Fast Category Filter */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-emerald-600" />
              <span>{t('btnExploreMap')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'মানচিত্রের যেকোনো পিনে ক্লিক করে বিস্তারিত সমস্যা দেখুন'
                : 'Click any map pin to view report details and support civic action'}
            </p>
          </div>
          <Link to="/explore">
            <Button variant="outline" size="sm">
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Map */}
        <LeafletMapExplorer
          reports={[...recentReports, ...trendingReports]}
          className="h-[380px] w-full rounded-2xl overflow-hidden border border-slate-200"
        />

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>
      </section>

      {/* ── Admin / Moderator Profile Card (dynamic fade-in) ── */}
      <section>
        <AdminProfileCard language={language as 'bn' | 'en'} />
      </section>

      {/* Trending & High Support Section */}
      {trendingReports.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <Flame className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {t('sectionTrending')}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'bn'
                    ? 'কমিউনিটির সর্বাধিক ভোটপ্রাপ্ত সক্রিয় সমস্যাসমূহ'
                    : 'Highest community upvotes requiring urgent prioritization'}
                </p>
              </div>
            </div>
            <Link to="/explore?sort=upvotes" className="text-xs font-bold text-emerald-700 hover:underline">
              {t('viewAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingReports.slice(0, 3).map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Problem Reports Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {t('sectionRecent')}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'নাগরিকদের সর্বশেষ জমাকৃত সমস্যা প্রতিবেদনসমূহ'
                  : 'Latest citizen submissions across all wards and sectors'}
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {filteredRecent.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-sm text-slate-500">{t('noReportsFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecent.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </section>

      {/* ── Community Activity Slideshow (auto-plays every 4s) ── */}
      <ActivitySlider language={language as 'bn' | 'en'} />

    </div>
  );
};
