export type UserRole = 'resident' | 'moderator' | 'administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  area: string;
  ward?: string;
  district?: string;
  createdAt?: string;
}

export type ReportCategory =
  | 'Road Damage'
  | 'Drainage'
  | 'Garbage'
  | 'Water Supply'
  | 'Streetlights'
  | 'Electricity'
  | 'Public Safety'
  | 'Environment'
  | 'Public Facilities'
  | 'Other';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Accepted'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type ReportPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface StatusHistoryItem {
  status: ReportStatus;
  changedBy: string;
  changedByName: string;
  changedByRole: string;
  note?: string;
  timestamp: string;
}

export interface Department {
  _id: string;
  name: string;
  nameBn: string;
  code: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface Report {
  _id: string;
  reportId: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: ReportPriority;
  area: string;
  district: string;
  address: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  images: string[];
  author: string | { _id: string; name: string; area?: string; ward?: string };
  authorName: string;
  assignedDepartment?: Department;
  internalNotes?: string;
  upvotesCount: number;
  commentsCount: number;
  followers?: string[];
  flagsCount?: number;
  isFlagged?: boolean;
  isDemo?: boolean;
  reopenRequested?: boolean;
  reopenReason?: string;
  resolutionProof?: {
    images: string[];
    notes: string;
    resolvedAt: string;
  };
  statusHistory: StatusHistoryItem[];
  hasUpvoted?: boolean;
  isFollowing?: boolean;
  isAuthor?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  report: string;
  author: {
    _id: string;
    name: string;
    role: string;
    area?: string;
  };
  authorName: string;
  authorRole: string;
  content: string;
  isOfficial: boolean;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  recipient: string;
  type: 'STATUS_CHANGE' | 'NEW_COMMENT' | 'ASSIGNMENT' | 'MODERATION' | 'SYSTEM';
  title: string;
  titleBn?: string;
  message: string;
  messageBn?: string;
  reportId?: string;
  reportObjectId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  _id: string;
  actor: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface FlagItem {
  _id: string;
  report: Report;
  reportedBy: {
    _id: string;
    name: string;
    email: string;
  };
  reporterName: string;
  reason: 'spam' | 'offensive' | 'inaccurate' | 'duplicate' | 'other';
  notes?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface AnalyticsData {
  totalReports: number;
  totalUsers: number;
  pendingFlags: number;
  resolvedReports: number;
  resolutionRate: number;
  byStatus: Array<{ status: string; count: number }>;
  byCategory: Array<{ category: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
  byArea: Array<{ area: string; count: number }>;
}
