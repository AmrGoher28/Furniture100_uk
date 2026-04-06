import { Star } from "lucide-react";

interface ProductStarsProps {
  rating: number;
  count: number;
}

const ProductStars = ({ rating, count }: ProductStarsProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating) ? "fill-gold text-gold" : "text-border"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  );
};

export default ProductStars;
