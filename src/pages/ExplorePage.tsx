import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Map as MapIcon,
  LayoutGrid,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Report } from '../types';
import { ReportCard } from '../components/reports/ReportCard';
import { LeafletMapExplorer } from '../components/map/LeafletMapExplorer';
import { Button } from '../components/ui/Button';

export const ExplorePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'grid'>('both');

  // Filter States initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (category) params.set('category', category);
      if (status) params.set('status', status);
      if (priority) params.set('priority', priority);
      if (area) params.set('area', area);
      if (sort) params.set('sort', sort);
      params.set('page', String(page));
      params.set('limit', '12');

      setSearchParams(params);

      const data = await api.get<{
        success: boolean;
        reports: Report[];
        pagination: any;
      }>(`/reports?${params.toString()}`);

      if (data.success) {
        setReports(data.reports);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [category, status, priority, area, sort, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setPriority('');
    setArea('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'সমস্যা মানচিত্র ও এক্সপ্লোরার' : 'Civic Issue Explorer & Map'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'আপনার এলাকার সকল নথিভুক্ত নাগরিক সমস্যা অনুসন্ধান ও অগ্রগতি পর্যবেক্ষণ করুন'
              : 'Discover reported municipal issues across your neighborhood with live status tracking'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'both' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            {language === 'bn' ? 'উভয়ই' : 'Split View'}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              viewMode === 'map' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'শুধু মানচিত্র' : 'Map Only'}</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'শুধু তালিকা' : 'List Only'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <Button type="submit" size="sm" className="px-5">
            <Search className="w-4 h-4 mr-1 sm:hidden" />
            <span className="hidden sm:inline">{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
          </Button>
        </form>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              {t('filterCategory')}
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
            >
              <option value="">{t('filterAll')}</option>
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

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              {t('filterStatus')}
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
            >
              <option value="">{t('filterAll')}</option>
              <option value="Submitted">{t('statusSubmitted')}</option>
              <option value="Under Review">{t('statusUnderReview')}</option>
              <option value="Accepted">{t('statusAccepted')}</option>
              <option value="In Progress">{t('statusInProgress')}</option>
              <option value="Resolved">{t('statusResolved')}</option>
              <option value="Rejected">{t('statusRejected')}</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              {t('filterPriority')}
            </label>
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
            >
              <option value="">{t('filterAll')}</option>
              <option value="Urgent">{t('priorityUrgent')}</option>
              <option value="High">{t('priorityHigh')}</option>
              <option value="Medium">{t('priorityMedium')}</option>
              <option value="Low">{t('priorityLow')}</option>
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              {t('filterArea')}
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Bozra, বজরা"
              className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              {t('sortBy')}
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="upvotes">{t('sortUpvotes')}</option>
              <option value="priority">{t('sortPriority')}</option>
              <option value="oldest">{t('sortOldest')}</option>
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetFilters')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Map & Grid Views */}
      <div className="space-y-8">
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {language === 'bn' ? 'মানচিত্রে পিনসমূহ' : 'Interactive Geographic Markers'}
              </span>
              <span>
                {reports.filter((r) => r.location?.coordinates).length}{' '}
                {language === 'bn' ? 'টি অবস্থান চিহ্নিত' : 'locations mapped'}
              </span>
            </div>
            <LeafletMapExplorer
              reports={reports}
              className="h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200"
            />
          </div>
        )}

        {(viewMode === 'both' || viewMode === 'grid') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-800 text-sm">
                {language === 'bn'
                  ? `মোট ${pagination.total} টি প্রতিবেদন পাওয়া গেছে`
                  : `Showing ${reports.length} of ${pagination.total} problem reports`}
              </span>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
                <p className="text-base font-semibold text-slate-700">{t('noReportsFound')}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your search criteria or resetting filters.
                </p>
                <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4">
                  {t('resetFilters')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>Previous</span>
                </Button>
                <span className="text-xs font-semibold px-4 text-slate-600">
                  {page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
