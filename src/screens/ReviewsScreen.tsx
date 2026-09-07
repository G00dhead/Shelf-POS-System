import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewsScreen: React.FC = () => {
  const { reviews } = useApp();
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [helpfulCounts, setHelpfulCounts] = useState<{ [id: string]: number }>({
    'rev-1': 14,
    'rev-2': 9,
    'rev-3': 5,
    'rev-4': 21,
    'rev-5': 8
  });

  const filteredReviews = reviews.filter(
    (r) => starFilter === 'all' || r.rating === starFilter
  );

  const avgRating = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);

  const handleHelpful = (id: string) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div id="reviews-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Customer Product Reviews</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Verified purchaser feedback and product satisfaction ratings
        </p>
      </div>

      {/* Review Metrics Overview */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold font-mono text-zinc-900">{avgRating}</div>
          <div>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              Based on {reviews.length} verified ratings
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 flex items-center gap-2 flex-wrap sm:justify-end">
          <span className="text-xs font-semibold text-zinc-500 mr-2">Filter by:</span>
          {(['all', 5, 4, 3] as const).map((r) => (
            <button
              key={r}
              onClick={() => setStarFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                starFilter === r
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {r === 'all' ? 'All Ratings' : `${r} Stars ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 border border-zinc-200 rounded-xl bg-white hover:border-zinc-300 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-900">
                    {rev.customerName}
                  </span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified Buyer
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">
                  Item: <span className="text-[#6D5AE6] font-semibold">{rev.productName}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= rev.rating ? 'fill-current text-amber-400' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1">{rev.date}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-700 leading-relaxed">
              "{rev.comment}"
            </p>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
              <button
                onClick={() => handleHelpful(rev.id)}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({helpfulCounts[rev.id] || 0})</span>
              </button>
              <span>POS Store Order Review</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
