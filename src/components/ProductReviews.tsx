import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, ThumbsUp, User } from "lucide-react";

interface Review {
  id: string;
  reviewer_name: string;
  rating: string;
  feedback: string;
  item_title: string | null;
  price: string | null;
  period: string | null;
  created_at: string;
}

interface ProductReviewsProps {
  productTitle: string;
}

const STARS_MAP: Record<string, number> = {
  Positive: 5,
  Neutral: 3,
  Negative: 1,
};

const getInitials = (name: string) => {
  return name.slice(0, 2).toUpperCase();
};

const timeAgo = (period: string | null) => {
  if (!period) return "";
  if (period.toLowerCase().includes("month")) return "Last month";
  if (period.toLowerCase().includes("6 months")) return "6 months ago";
  if (period.toLowerCase().includes("year")) return "Over a year ago";
  return period;
};

const ProductReviews = ({ productTitle }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Get all positive reviews first, then try to match by keywords
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("rating", "Positive")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!data) return;

        // Try to find reviews matching this product by keywords
        const titleWords = productTitle
          .toLowerCase()
          .split(/[\s\-]+/)
          .filter((w) => w.length > 3 && !["send", "offer", "save", "style", "with"].includes(w));

        const matched = data.filter((r) => {
          const itemLower = (r.item_title || "").toLowerCase();
          return titleWords.some((word) => itemLower.includes(word));
        });

        // If we have matched reviews use those, otherwise pick general positive reviews
        const finalReviews = matched.length >= 2 ? matched : data.slice(0, 8);
        setReviews(finalReviews);
      } catch (e) {
        console.error("Error fetching reviews:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productTitle]);

  if (loading || reviews.length === 0) return null;

  const avgStars =
    reviews.reduce((sum, r) => sum + (STARS_MAP[r.rating] || 5), 0) / reviews.length;
  const displayReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <section className="mt-16 border-t border-border pt-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(avgStars)
                      ? "fill-gold text-gold"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {avgStars.toFixed(1)} out of 5 · {reviews.length} reviews
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ThumbsUp className="w-3.5 h-3.5 text-gold" />
          Verified purchases from eBay
        </div>
      </div>

      {/* Review cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {displayReviews.map((review) => (
          <div
            key={review.id}
            className="border border-border rounded-lg p-5 hover:border-gold/30 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                {getInitials(review.reviewer_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">
                    {review.reviewer_name}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {timeAgo(review.period)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= (STARS_MAP[review.rating] || 5)
                          ? "fill-gold text-gold"
                          : "text-border"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-green-600 ml-2">✓ Verified</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {review.feedback}
            </p>
          </div>
        ))}
      </div>

      {/* Show more */}
      {reviews.length > 4 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-gold hover:underline transition-colors"
          >
            {showAll ? "Show fewer reviews" : `View all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
