import React, { useState } from 'react';
import { Comment } from '../../types';
import { Button } from '../ui/Button';
import { MessageSquare, ShieldCheck, Trash2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface CommentListProps {
  reportId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
}

export const CommentList: React.FC<CommentListProps> = ({
  reportId,
  comments,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isStaff } = useAuth();
  const { success, error, info } = useToast();

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      info(
        language === 'bn'
          ? 'মন্তব্য প্রকাশ করতে অনুগ্রহ করে লগইন করুন'
          : 'Please login to post a comment.'
      );
      return;
    }

    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const data = await api.post<{ success: boolean; comment: Comment }>(
        `/reports/${reportId}/comments`,
        { content: content.trim() }
      );
      if (data.success && data.comment) {
        onCommentAdded(data.comment);
        setContent('');
        success(language === 'bn' ? 'মন্তব্য যুক্ত হয়েছে' : 'Comment posted successfully.');
      }
    } catch (err: any) {
      error(err.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm(language === 'bn' ? 'মন্তব্যটি মুছে ফেলতে চান?' : 'Delete this comment?'))
      return;

    try {
      await api.delete(`/reports/comments/${commentId}`);
      onCommentDeleted(commentId);
      success(language === 'bn' ? 'মন্তব্য মোছা হয়েছে' : 'Comment deleted.');
    } catch (err: any) {
      error(err.message || 'Failed to delete comment.');
    }
  };

  return (
    <div id="comments" className="space-y-6">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        <span>{t('comments')} ({comments.length})</span>
      </div>

      {/* New Comment Input Box */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('addComment')}
          rows={3}
          maxLength={1000}
          className="w-full text-sm rounded-2xl border border-slate-300 p-3.5 focus:border-emerald-500 focus:ring-emerald-500 bg-white shadow-2xs resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {1000 - content.length} {language === 'bn' ? 'অক্ষর বাকি' : 'characters left'}
          </span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={submitting}
            disabled={!content.trim()}
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            <span>{t('submitComment')}</span>
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3.5">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            {language === 'bn'
              ? 'এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন।'
              : 'No comments yet. Be the first to share community insight.'}
          </p>
        ) : (
          comments.map((comment) => {
            const canDelete =
              user &&
              (user.id === (comment.author as any)?._id ||
                user.id === (comment.author as any) ||
                isStaff);

            return (
              <div
                key={comment._id}
                className={`p-4 rounded-2xl border text-xs transition-colors ${
                  comment.isOfficial
                    ? 'bg-emerald-50/70 border-emerald-300/80 shadow-2xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {comment.authorName}
                    </span>
                    {comment.isOfficial && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        {t('officialBadge')}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      • {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
