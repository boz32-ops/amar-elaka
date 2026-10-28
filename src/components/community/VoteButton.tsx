import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface VoteButtonProps {
  reportId: string;
  initialUpvotes: number;
  initialHasUpvoted?: boolean;
  onVoteChange?: (newCount: number, hasUpvoted: boolean) => void;
  size?: 'sm' | 'md';
}

export const VoteButton: React.FC<VoteButtonProps> = ({
  reportId,
  initialUpvotes,
  initialHasUpvoted = false,
  onVoteChange,
  size = 'md',
}) => {
  const { isAuthenticated } = useAuth();
  const { info, error } = useToast();
  const navigate = useNavigate();

  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotes);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      info('সমর্থন জানাতে অনুগ্রহ করে লগইন করুন / Please login to support');
      navigate('/login');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    // Optimistic UI update
    const nextHasUpvoted = !hasUpvoted;
    const nextCount = nextHasUpvoted ? upvotesCount + 1 : Math.max(0, upvotesCount - 1);
    setHasUpvoted(nextHasUpvoted);
    setUpvotesCount(nextCount);

    try {
      const data = await api.post<{
        success: boolean;
        hasUpvoted: boolean;
        upvotesCount: number;
      }>(`/reports/${reportId}/vote`);

      if (data.success) {
        setHasUpvoted(data.hasUpvoted);
        setUpvotesCount(data.upvotesCount);
        if (onVoteChange) onVoteChange(data.upvotesCount, data.hasUpvoted);
      }
    } catch (err: any) {
      // Revert optimistic update
      setHasUpvoted(hasUpvoted);
      setUpvotesCount(upvotesCount);
      error(err.message || 'Failed to register vote.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      aria-label="Support report"
      className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all duration-150 select-none ${
        hasUpvoted
          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700'
          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/80'
      } ${isSmall ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}
    >
      <ThumbsUp
        className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
          hasUpvoted ? 'fill-white' : 'fill-none'
        } transition-transform active:scale-125`}
      />
      <span>{upvotesCount}</span>
    </button>
  );
};
