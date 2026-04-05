import { Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Daryl Y.",
    product: "Set of 2 Brown Suede Bar Stools",
    text: "Really pleased with the quality. They look fantastic in our kitchen and were easy to assemble.",
    stars: 5,
  },
  {
    id: 2,
    name: "Becky C.",
    product: "Vintage Swivel Leather Office Chair",
    text: "Gorgeous chair, exactly as described. Fast delivery too — would definitely order again.",
    stars: 5,
  },
  {
    id: 3,
    name: "Karen T.",
    product: "Brown Accent Armchair",
    text: "Beautiful piece of furniture. The colour is spot on and it's incredibly comfortable.",
    stars: 5,
  },
  {
    id: 4,
    name: "Samantha C.",
    product: "Orange 2 Seater Sofa",
    text: "Absolutely love this sofa. It's a real statement piece and the quality is brilliant for the price.",
    stars: 5,
  },
  {
    id: 5,
    name: "Emma S.",
    product: "Set of 2 Rattan Bar Stools",
    text: "Ordered three sets and they all arrived perfectly. Great communication from the seller.",
    stars: 5,
  },
  {
    id: 6,
    name: "Helen P.",
    product: "Khaki Chenille Accent Chair",
    text: "Such a lovely chair. The fabric feels premium and the lumbar pillow is a nice touch.",
    stars: 4,
  },
  {
    id: 7,
    name: "Philip P.",
    product: "Mid Century Rocking Chair",
    text: "Stunning design and very well made. Gets compliments from everyone who visits.",
    stars: 5,
  },
  {
    id: 8,
    name: "Pere C.",
    product: "Green Corduroy Accent Chairs",
    text: "Bought two for our restaurant — they look incredible. Customers love them.",
    stars: 5,
  },
];

export const CustomerReviews = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Show 1 on mobile, 3 on desktop — we'll render 3 and hide extras via CSS
  const totalSlides = REVIEWS.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  const getVisibleReviews = () => {
    const reviews = [];
    for (let i = 0; i < 3; i++) {
      reviews.push(REVIEWS[(current + i) % totalSlides]);
    }
    return reviews;
  };

  const visible = getVisibleReviews();

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-4">What Our Customers Say</h2>
        <p className="text-center text-muted-foreground mb-12 font-light">
          Trusted by hundreds of happy homes across the UK
        </p>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((r, i) => (
              <div
                key={`${r.id}-${current}`}
                className={`bg-background rounded-xl p-6 md:p-8 warm-shadow animate-fade-in ${
                  i > 0 ? "hidden md:block" : ""
                }`}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`w-4 h-4 ${
                        si < r.stars ? "text-gold fill-gold" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm italic mb-4 leading-relaxed font-light">
                  "{r.text}"
                </p>
                <p className="text-xs text-foreground font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">{r.product}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-gold w-6" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
