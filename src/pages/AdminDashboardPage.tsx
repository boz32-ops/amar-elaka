import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  BarChart3,
  Flag,
  Users,
  History,
  Download,
  CheckCircle,
  XCircle,
  Building,
  Edit,
  Eye,
  AlertOctagon,
  Search,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Report, Department, AnalyticsData, AuditLogItem, FlagItem, User } from '../types';
import { StatusBadge, PriorityBadge, CategoryBadge, Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const AdminDashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isStaff, isAdmin } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reports' | 'analytics' | 'flags' | 'users' | 'audit'>('reports');

  // Reports Table State
  const [reports, setReports] = useState<Report[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Status & Assignment Modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('Accepted');
  const [statusNote, setStatusNote] = useState('');
  const [assignedDeptId, setAssignedDeptId] = useState('');
  const [newPriority, setNewPriority] = useState<string>('Medium');
  const [internalNotes, setInternalNotes] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [proofImageInput, setProofImageInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Flags State
  const [flaggedItems, setFlaggedItems] = useState<FlagItem[]>([]);

  // Users State
  const [usersList, setUsersList] = useState<User[]>([]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    if (!isStaff) {
      navigate('/login');
      return;
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [repRes, deptRes] = await Promise.all([
          api.get<{ success: boolean; reports: Report[] }>('/reports?limit=100'),
          api.get<{ success: boolean; departments: Department[] }>('/departments'),
        ]);

        if (repRes.success) setReports(repRes.reports);
        if (deptRes.success) setDepartments(deptRes.departments);
      } catch (err: any) {
        error(err.message || 'Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [isStaff, navigate]);

  // Load Tab-specific data
  useEffect(() => {
    if (activeTab === 'analytics') {
      api.get<{ success: boolean; analytics: AnalyticsData }>('/admin/analytics').then((res) => {
        if (res.success) setAnalytics(res.analytics);
      });
    } else if (activeTab === 'flags') {
      api.get<{ success: boolean; flags: FlagItem[] }>('/admin/flagged-reports').then((res) => {
        if (res.success) setFlaggedItems(res.flags);
      });
    } else if (activeTab === 'users') {
      api.get<{ success: boolean; users: User[] }>('/admin/users').then((res) => {
        if (res.success) setUsersList(res.users);
      });
    } else if (activeTab === 'audit') {
      api.get<{ success: boolean; logs: AuditLogItem[] }>('/admin/audit-logs').then((res) => {
        if (res.success) setAuditLogs(res.logs);
      });
    }
  }, [activeTab]);

  // Open Update Modal
  const handleOpenUpdateModal = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setNewPriority(report.priority);
    setAssignedDeptId(report.assignedDepartment?._id || '');
    setInternalNotes(report.internalNotes || '');
    setStatusNote('');
    setProofNotes(report.resolutionProof?.notes || '');
    setProofImageInput((report.resolutionProof?.images || []).join(', '));
    setIsUpdateModalOpen(true);
  };

  // Submit Status / Assignment Update
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setIsUpdating(true);
    try {
      const proofImages = proofImageInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload: any = {
        status: newStatus,
        priority: newPriority,
        note: statusNote.trim() || `Status updated to ${newStatus}`,
        internalNotes: internalNotes.trim(),
      };

      if (assignedDeptId) {
        payload.assignedDepartmentId = assignedDeptId;
      }

      if (newStatus === 'Resolved' && proofNotes.trim()) {
        payload.resolutionProofNotes = proofNotes.trim();
        payload.resolutionProofImages = proofImages;
      }

      const res = await api.patch<{ success: boolean; report: Report }>(
        `/reports/${selectedReport._id}/status`,
        payload
      );

      if (res.success && res.report) {
        success(language === 'bn' ? 'রিপোর্টের অবস্থা হালনাগাদ হয়েছে' : 'Report status updated.');
        setReports((prev) =>
          prev.map((r) => (r._id === selectedReport._id ? { ...r, ...res.report } : r))
        );
        setIsUpdateModalOpen(false);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update report status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Moderate Flag
  const handleModerateFlag = async (flagId: string, action: 'dismiss' | 'accept_and_hide') => {
    try {
      const res = await api.post<{ success: boolean }>(`/admin/flags/${flagId}/moderate`, { action });
      if (res.success) {
        success('Flag processed successfully.');
        setFlaggedItems((prev) => prev.filter((f) => f._id !== flagId));
      }
    } catch (err: any) {
      error(err.message || 'Failed to moderate flag.');
    }
  };

  // Promote / Demote user role (Admin only)
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await api.patch<{ success: boolean }>(`/admin/users/${userId}/role`, { role: newRole });
      if (res.success) {
        success(`User role updated to ${newRole}.`);
        setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)));
      }
    } catch (err: any) {
      error(err.message || 'Failed to change role.');
    }
  };

  // CSV Export Download
  const handleExportCSV = async () => {
    try {
      info('Generating CSV report export...');
      const csvText = await api.get<string>('/admin/export-csv');
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `amar-elaka-civic-reports-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('CSV exported successfully.');
    } catch (err: any) {
      error('Failed to export CSV: ' + err.message);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span className="capitalize">{user?.role} Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('adminTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('adminSubtitle')}
          </p>
        </div>

        <Button onClick={handleExportCSV} variant="outline" size="sm" className="self-start sm:self-auto">
          <Download className="w-4 h-4 mr-1.5" />
          <span>{t('btnExportCSV')}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('tabReports')}</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t('tabAnalytics')}</span>
        </button>

        <button
          onClick={() => setActiveTab('flags')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'flags' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>{t('tabFlags')}</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('tabUsers')}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'audit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t('tabAudit')}</span>
        </button>
      </div>

      {/* Tab 1: Reports Management Table */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, title, or area..."
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Problem & Area</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Dept</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {rep.reportId}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-800 line-clamp-1">{rep.title}</div>
                      <div className="text-[11px] text-slate-400">{rep.area}</div>
                    </td>
                    <td className="py-3 px-4">
                      <CategoryBadge category={rep.category} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={rep.status} />
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={rep.priority} />
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {rep.assignedDepartment?.code || 'None'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenUpdateModal(rep)}
                        className="text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/report/${rep.reportId}`)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Analytics & Insights */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Total Reports</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{analytics.totalReports}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Resolution Rate</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-2">{analytics.resolutionRate}%</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Registered Citizens</span>
              <div className="text-3xl font-extrabold text-blue-600 mt-2">{analytics.totalUsers}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Pending Flags</span>
              <div className="text-3xl font-extrabold text-red-600 mt-2">{analytics.pendingFlags}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Category */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Reports by Category</h3>
              <div className="space-y-2">
                {analytics.byCategory.map((c) => (
                  <div key={c.category} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{c.category}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Status */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Reports by Status</h3>
              <div className="space-y-2">
                {analytics.byStatus.map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{s.status}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Moderation Flags Queue */}
      {activeTab === 'flags' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900">Pending Citizen Flag Reports</h3>
          {flaggedItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">No pending flags in queue.</p>
          ) : (
            <div className="space-y-3">
              {flaggedItems.map((flag) => (
                <div key={flag._id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded">
                      {flag.reason}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{(flag.report as any)?.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Notes: {flag.notes || 'No note provided'}</p>
                    <span className="text-[10px] text-slate-400">Reported by: {flag.reporterName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleModerateFlag(flag._id, 'dismiss')}>
                      Dismiss
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleModerateFlag(flag._id, 'accept_and_hide')}>
                      Hide & Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <h3 className="font-bold text-sm text-slate-900 mb-4">User Accounts</h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase text-slate-500 font-semibold border-y">
              <tr>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Area</th>
                <th className="py-2.5 px-4">Role</th>
                {isAdmin && <th className="py-2.5 px-4 text-right">Change Role</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3 px-4 text-slate-600">{u.area}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="text-xs rounded-lg border border-slate-300 p-1 bg-white"
                      >
                        <option value="resident">Resident</option>
                        <option value="moderator">Moderator</option>
                        <option value="administrator">Administrator</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Administrative Audit Trails</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 uppercase text-slate-500 font-semibold border-y">
                <tr>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Target</th>
                  <th className="py-2.5 px-4">Details</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {log.actorName} ({log.actorRole})
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700">{log.action}</td>
                    <td className="py-2.5 px-4 text-slate-600">{log.targetType} #{log.targetId}</td>
                    <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status & Assignment Modal */}
      {selectedReport && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Problem Report: ${selectedReport.reportId}`}
          maxWidth="lg"
        >
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('selectNewStatus')}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-semibold"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('btnAssignDept')}
              </label>
              <select
                value={assignedDeptId}
                onChange={(e) => setAssignedDeptId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
              >
                <option value="">Unassigned</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('statusChangeNote')}
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g., Road repair squad dispatched for tonight"
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('internalNotes')}
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={2}
                placeholder="Internal department notes (only visible to staff)..."
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5"
              />
            </div>

            {newStatus === 'Resolved' && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-emerald-900">
                  {t('proofNotes')}
                </label>
                <textarea
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  rows={2}
                  placeholder="Describe resolution details..."
                  className="w-full text-xs rounded-xl border border-emerald-300 p-2 bg-white"
                />
                <input
                  type="text"
                  value={proofImageInput}
                  onChange={(e) => setProofImageInput(e.target.value)}
                  placeholder="Proof photo URLs (comma-separated)..."
                  className="w-full text-xs rounded-xl border border-emerald-300 p-2 bg-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={isUpdating}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
