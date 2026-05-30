import { Star } from "lucide-react";

interface ProductStarsProps {
  rating: number;
  count: number;
  showCount?: boolean;
  size?: "sm" | "md";
}

const ProductStars = ({ rating, count, showCount = true, size = "sm" }: ProductStarsProps) => {
  const dim = size === "md" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fillPct = Math.max(0, Math.min(1, rating - i)) * 100;
          return (
            <div key={i} className={`relative ${dim}`}>
              <Star className={`${dim} text-border absolute inset-0`} strokeWidth={1.5} />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPct}%` }}
              >
                <Star className={`${dim} fill-gold text-gold`} strokeWidth={1.5} />
              </div>
            </div>
          );
        })}
      </div>
      {showCount && <span className="text-xs text-muted-foreground tabular-nums">({count})</span>}
    </div>
  );
};

export default ProductStars;
