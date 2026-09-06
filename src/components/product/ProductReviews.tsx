import { useMemo, useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useProductReviews } from "@/hooks/useProductReviews";
import { supabase } from "@/integrations/supabase/client";

const VOTE_STORAGE_KEY = "review_votes";

function readVotes(): Record<string, "up" | "down"> {
  try {
    return JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function countryFlag(code: string | null | undefined) {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return null;
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

function HelpfulVotes({
  reviewId,
  up,
  down,
}: {
  reviewId: string;
  up: number;
  down: number;
}) {
  const [votes, setVotes] = useState<Record<string, "up" | "down">>(readVotes);
  const voted = votes[reviewId];
  const [counts, setCounts] = useState({ up, down });

  const vote = async (dir: "up" | "down") => {
    if (voted) return;
    const next = { ...readVotes(), [reviewId]: dir };
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(next));
    setVotes(next);
    setCounts((c) => ({ ...c, [dir]: c[dir] + 1 }));
    await supabase.rpc("vote_review", { review_id: reviewId, up: dir === "up" });
  };

  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-[11px] text-muted-foreground">
        {voted ? "Thanks for your feedback" : "Was this helpful?"}
      </span>
      <button
        type="button"
        onClick={() => vote("up")}
        disabled={!!voted}
        aria-label="Mark review as helpful"
        className={`flex items-center gap-1 text-[11px] rounded-full border px-2 py-0.5 transition-colors ${
          voted === "up"
            ? "border-[#5E6A45] text-[#5E6A45]"
            : "border-border text-muted-foreground hover:border-foreground/40 disabled:opacity-50"
        }`}
      >
        <ThumbsUp className="w-3 h-3" strokeWidth={1.5} />
        <span className="tabular-nums">{counts.up}</span>
      </button>
      <button
        type="button"
        onClick={() => vote("down")}
        disabled={!!voted}
        aria-label="Mark review as not helpful"
        className={`flex items-center gap-1 text-[11px] rounded-full border px-2 py-0.5 transition-colors ${
          voted === "down"
            ? "border-foreground/50 text-foreground"
            : "border-border text-muted-foreground hover:border-foreground/40 disabled:opacity-50"
        }`}
      >
        <ThumbsDown className="w-3 h-3" strokeWidth={1.5} />
        <span className="tabular-nums">{counts.down}</span>
      </button>
    </div>
  );
}

interface ProductReviewsProps {
  productHandle: string;
  reviewPhotos?: string;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(rating) ? "fill-[#5E6A45] text-[#5E6A45]" : "text-border"
          }`}
          strokeWidth={1}
        />
      ))}
    </span>
  );
}

export function ProductReviews({ productHandle, reviewPhotos }: ProductReviewsProps) {
  const { reviews, average, count, loading } = useProductReviews(productHandle);

  const photos = useMemo(() => {
    if (!reviewPhotos) return [];
    try {
      const parsed = JSON.parse(reviewPhotos);
      return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
      return [];
    }
  }, [reviewPhotos]);

  if (loading) {
    return (
      <div className="mt-16 md:mt-24 pt-10 border-t border-border">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!count) return null;

  return (
    <section className="mt-16 md:mt-24 pt-10 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-medium mb-2">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-medium text-foreground tabular-nums">
              {average.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <StarRating rating={average} />
              <span className="text-xs text-muted-foreground mt-0.5">
                Based on {count} review{count !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="mb-10">
          <p className="text-xs text-muted-foreground mb-3">Customer photos</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Customer photo ${i + 1}`}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-muted shrink-0"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
        {reviews.map((review) => (
          <article key={review.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating || 0} />
                {review.verified && (
                  <span className="text-[10px] tracking-wide text-[#5E6A45] uppercase font-medium">
                    Verified
                  </span>
                )}
              </div>
              {review.reviewed_at && (
                <span className="text-xs text-muted-foreground">{formatDate(review.reviewed_at)}</span>
              )}
            </div>

            {review.title && (
              <h3 className="text-sm font-medium text-foreground">{review.title}</h3>
            )}

            <p className="text-sm leading-relaxed text-foreground/80">{review.body}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">
                {review.author_name || "Anonymous"}
                {review.variant_label ? ` · ${review.variant_label}` : ""}
              </span>
              {review.incentivised && (
                <span className="text-[10px] tracking-wide uppercase font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  Incentivised review
                </span>
              )}
            </div>

            {review.source && (
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Via {review.source_label || review.source}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
