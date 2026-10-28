import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, Bell, PlusCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Report } from '../types';
import { ReportCard } from '../components/reports/ReportCard';
import { Button } from '../components/ui/Button';

export const MyReportsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'mine' | 'followed'>('mine');
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [followedReports, setFollowedReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [mineRes, followedRes] = await Promise.all([
          api.get<{ success: boolean; reports: Report[] }>('/reports/my-reports'),
          api.get<{ success: boolean; reports: Report[] }>('/reports/my-followed'),
        ]);

        if (mineRes.success) setMyReports(mineRes.reports);
        if (followedRes.success) setFollowedReports(followedRes.reports);
      } catch (err) {
        console.error('Failed to load user reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const currentList = activeTab === 'mine' ? myReports : followedReports;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('navMyReports')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? `স্বাগতম ${user?.name}, আপনার দাখিলকৃত ও অনুসরণ করা সকল সমস্যার অগ্রগতি`
              : `Welcome ${user?.name}, monitor all your reported issues and followed updates`}
          </p>
        </div>

        <Link to="/report/new">
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>{t('btnReportProblem')}</span>
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('mine')}
          className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'mine'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>
            {language === 'bn' ? 'আমার দাখিলকৃত সমস্যা' : 'My Submissions'} ({myReports.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('followed')}
          className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'followed'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>
            {language === 'bn' ? 'অনুসরণ করা রিপোর্ট' : 'Followed Reports'} ({followedReports.length})
          </span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4">
          <p className="text-base font-semibold text-slate-700">
            {activeTab === 'mine'
              ? language === 'bn'
                ? 'আপনি এখনো কোনো সমস্যা প্রতিবেদন জমা দেননি।'
                : 'You have not submitted any civic reports yet.'
              : language === 'bn'
              ? 'আপনি কোনো রিপোর্ট অনুসরণ করছেন না।'
              : 'You are not following any reports yet.'}
          </p>
          <Link to="/report/new">
            <Button size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>{t('btnReportProblem')}</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};
