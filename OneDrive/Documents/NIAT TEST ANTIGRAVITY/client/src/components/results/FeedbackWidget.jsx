import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { useAdvisoryFeedback } from '../../hooks/useAdvisories.js';

export function FeedbackWidget({ advisoryId }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  const { mutate: submitFeedback, isPending } = useAdvisoryFeedback(advisoryId);

  const handleRatingClick = (val) => {
    setRating(val);
    setShowCommentBox(true);
    submitFeedback({ rating: val, comment });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (rating !== null) {
      submitFeedback({ rating, comment });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-800">Was this AI advisory helpful?</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRatingClick(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              rating === 1
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-emerald-50'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Yes, helpful
          </button>
          <button
            type="button"
            onClick={() => handleRatingClick(-1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              rating === -1
                ? 'bg-red-700 text-white border-red-800'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-red-50'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            Needs improvement
          </button>
        </div>
      </div>

      {showCommentBox && (
        <form onSubmit={handleCommentSubmit} className="space-y-2 pt-2 border-t border-slate-100">
          <Textarea
            placeholder="Optional comment: How can KrishiMitra improve this advice for your field?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            maxLength={1000}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" variant="outline" icon={Send} isLoading={isPending}>
              Save Comment
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
