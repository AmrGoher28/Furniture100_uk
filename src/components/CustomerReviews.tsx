import { Star } from "lucide-react";

const PLACEHOLDER_REVIEWS = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

export const CustomerReviews = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-4">What Our Customers Say</h2>
        <p className="text-center text-muted-foreground mb-12 font-light">Rated Excellent on Google Reviews</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEHOLDER_REVIEWS.map((r) => (
            <div key={r.id} className="bg-background rounded-xl p-6 md:p-8 warm-shadow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm italic mb-4 leading-relaxed font-light">
                No reviews yet — be the first to share your experience.
              </p>
              <p className="text-xs text-muted-foreground font-light">— Customer</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
