import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    text: "Absolutely stunning dining table. The craftsmanship is superb and it arrived earlier than expected. Couldn't be happier.",
    name: "Sarah M.",
    location: "London",
  },
  {
    id: 2,
    text: "We ordered a sofa and two armchairs — the quality is incredible for the price. Delivery was smooth and the team were brilliant.",
    name: "James R.",
    location: "Manchester",
  },
  {
    id: 3,
    text: "Beautiful bookshelf that looks even better in person. Great customer service when I had a question about dimensions.",
    name: "Emma T.",
    location: "Edinburgh",
  },
];

export const CustomerReviews = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-4">What Our Customers Say</h2>
        <p className="text-center text-muted-foreground font-light mb-14">Rated Excellent on Google Reviews</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.id} className="bg-card rounded-md p-6 md:p-8 transition-shadow duration-300 hover:shadow-md">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm italic mb-4 leading-relaxed">
                "{r.text}"
              </p>
              <p className="text-xs text-muted-foreground">— {r.name}, {r.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
