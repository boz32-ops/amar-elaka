import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  UserCheck,
  Building,
  Bell,
  Check,
  Share2,
  Flag,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Report, Comment } from '../types';
import { StatusBadge, PriorityBadge, CategoryBadge, Badge } from '../components/ui/Badge';
import { VoteButton } from '../components/community/VoteButton';
import { ShareButton } from '../components/community/ShareButton';
import { FlagModal } from '../components/community/FlagModal';
import { StatusTimeline } from '../components/reports/StatusTimeline';
import { CommentList } from '../components/community/CommentList';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LeafletMapExplorer } from '../components/map/LeafletMapExplorer';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isStaff } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Community modals & states
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [isReopening, setIsReopening] = useState(false);

  // Selected photo viewer
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const fetchReportData = async () => {
    try {
      const [repData, commData] = await Promise.all([
        api.get<{ success: boolean; report: Report }>(`/reports/${id}`),
        api.get<{ success: boolean; comments: Comment[] }>(`/reports/${id}/comments`),
      ]);

      if (repData.success && repData.report) {
        setReport(repData.report);
        setIsFollowing(!!repData.report.isFollowing);
        if (repData.report.images && repData.report.images.length > 0) {
          setActivePhoto(repData.report.images[0]);
        }
      }
      if (commData.success) {
        setComments(commData.comments);
      }
    } catch (err: any) {
      error(err.message || 'Report not found.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      info('অনুগ্রহ করে আপডেট পেতে লগইন করুন / Please login to follow.');
      navigate('/login');
      return;
    }
    if (!report) return;

    try {
      const data = await api.post<{ success: boolean; isFollowing: boolean; message: string }>(
        `/reports/${report._id}/follow`
      );
      if (data.success) {
        setIsFollowing(data.isFollowing);
        success(data.message);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update follow status.');
    }
  };

  const handleReopenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    setIsReopening(true);
    try {
      const data = await api.post<{ success: boolean; message: string; report: Report }>(
        `/reports/${report._id}/reopen`,
        { reason: reopenReason }
      );
      if (data.success) {
        success(data.message);
        setReport(data.report);
        setIsReopenModalOpen(false);
        setReopenReason('');
      }
    } catch (err: any) {
      error(err.message || 'Failed to request reopen.');
    } finally {
      setIsReopening(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <div className="h-96 bg-slate-200 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Report Not Found</h2>
        <Button onClick={() => navigate('/explore')}>Go to Explorer</Button>
      </div>
    );
  }

  const isAuthor =
    user && (user.id === (report.author as any)?._id || user.id === (report.author as any));

  const canRequestReopen =
    isAuthor &&
    ['Resolved', 'Rejected'].includes(report.status) &&
    !report.reopenRequested;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
        </button>
      </div>

      {/* Main Report Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-1 rounded-lg">
              {report.reportId}
            </span>
            <StatusBadge status={report.status} />
            <CategoryBadge category={report.category} />
            <PriorityBadge priority={report.priority} />
            {report.isDemo && (
              <Badge variant="demo">{language === 'bn' ? 'নমুনা ডেটা' : 'Demo'}</Badge>
            )}
          </div>

          {/* Citizen Actions: Follow, Share, Flag */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFollow}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isFollowing
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isFollowing ? t('following') : t('followReport')}</span>
            </button>

            <ShareButton reportId={report.reportId} title={report.title} size="sm" />

            <button
              onClick={() => setIsFlagModalOpen(true)}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              title={t('flagReport')}
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Author */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {report.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {t('reportedBy')}: <strong className="text-slate-700">{report.authorName}</strong>
              </span>
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(report.createdAt).toLocaleString()}</span>
            </span>

            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <strong className="text-slate-700">{report.area}</strong>, {report.address}
            </span>
          </div>
        </div>

        {/* Reopen Requested Alert Banner */}
        {report.reopenRequested && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">{t('reopenRequestTitle')}</strong>
              <p>{report.reopenReason}</p>
            </div>
          </div>
        )}

        {/* Photos Viewer */}
        {report.images && report.images.length > 0 && (
          <div className="space-y-2">
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-80 sm:h-96 w-full bg-slate-950 flex items-center justify-center">
              <img
                src={activePhoto || report.images[0]}
                alt="Selected report photo"
                className="max-h-full max-w-full object-contain cursor-zoom-in"
                onClick={() => window.open(activePhoto || report.images[0], '_blank')}
              />
            </div>
            {report.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {report.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(img)}
                    className={`h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activePhoto === img ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-sm text-slate-800">
            {language === 'bn' ? 'সমস্যার বিস্তারিত বিবরণ' : 'Detailed Problem Description'}
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {report.description}
          </p>
        </div>

        {/* Upvote & Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <VoteButton
              reportId={report._id}
              initialUpvotes={report.upvotesCount}
              initialHasUpvoted={report.hasUpvoted}
              size="md"
            />
            <span className="text-xs text-slate-500">
              {language === 'bn'
                ? 'নাগরিক সমর্থন এই সমস্যাটিকে অগ্রাধিকার দিতে সাহায্য করে'
                : 'Community votes directly empower resolution prioritization'}
            </span>
          </div>

          {canRequestReopen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReopenModalOpen(true)}
              className="border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span>
                {language === 'bn' ? 'সমস্যা অব্যাহত থাকলে পুনরায় খুলুন' : 'Reopen if Issue Persists'}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Grid: Map and Assigned Department */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Map Location */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{t('location')}</span>
          </h3>
          <LeafletMapExplorer
            reports={[report]}
            className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200"
          />
          <p className="text-xs text-slate-500">
            {report.area}, {report.address}
            {report.location?.coordinates && (
              <span className="block text-[11px] font-mono text-slate-400 mt-0.5">
                GPS: {report.location.coordinates[1].toFixed(5)}, {report.location.coordinates[0].toFixed(5)}
              </span>
            )}
          </p>
        </div>

        {/* Right: Assigned Authority & Department */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>{t('assignedDept')}</span>
          </h3>

          {report.assignedDepartment ? (
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block text-sm">
                  {language === 'bn' && report.assignedDepartment.nameBn
                    ? report.assignedDepartment.nameBn
                    : report.assignedDepartment.name}
                </span>
                <span className="text-[11px] text-emerald-700 font-mono">
                  Code: {report.assignedDepartment.code}
                </span>
              </div>
              <p className="text-slate-600">
                {report.assignedDepartment.description}
              </p>
              {report.assignedDepartment.contactEmail && (
                <div className="text-[11px] text-slate-500 pt-1">
                  Email: {report.assignedDepartment.contactEmail}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
              {t('notAssigned')}
            </div>
          )}

          {isStaff && (
            <div className="pt-3 border-t border-slate-100">
              <Link to="/admin">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Open Staff Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Status History Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900">
          {t('statusTimeline')}
        </h3>
        <StatusTimeline
          history={report.statusHistory}
          resolutionProof={report.resolutionProof}
        />
      </div>

      {/* Comments Thread */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <CommentList
          reportId={report._id}
          comments={comments}
          onCommentAdded={(newComment) => setComments((prev) => [...prev, newComment])}
          onCommentDeleted={(delId) => setComments((prev) => prev.filter((c) => c._id !== delId))}
        />
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        reportId={report._id}
      />

      {/* Reopen Request Modal */}
      <Modal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        title={t('reopenRequestTitle')}
      >
        <form onSubmit={handleReopenSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            {language === 'bn'
              ? 'যদি সমস্যাটি সঠিকভাবে সমাধান না হয়ে থাকে বা পুনরায় ফিরে আসে, তবে অনুগ্রহ করে বিস্তারিত কারণ লিখুন।'
              : 'If the problem has persisted or was not resolved adequately, please explain the issue.'}
          </p>

          <textarea
            value={reopenReason}
            onChange={(e) => setReopenReason(e.target.value)}
            rows={4}
            required
            minLength={10}
            placeholder={
              language === 'bn'
                ? 'কেন পুনরায় পর্যালোচনা প্রয়োজন বিস্তারিত লিখুন...'
                : 'Explain why this report should be reopened for review...'
            }
            className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:ring-emerald-500"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReopenModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isReopening}
            >
              Submit Reopen Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
