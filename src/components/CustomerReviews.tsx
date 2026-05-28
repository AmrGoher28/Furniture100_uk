import { Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const REVIEWS = [
  { id: 1, name: "Daryl Y.", product: "Set of 2 Brown Suede Bar Stools", text: "Really pleased with the quality. They look fantastic in our kitchen and were easy to assemble.", stars: 5 },
  { id: 2, name: "Becky C.", product: "Vintage Swivel Leather Office Chair", text: "Gorgeous chair, exactly as described. Fast delivery too — would definitely order again.", stars: 5 },
  { id: 3, name: "Karen T.", product: "Brown Accent Armchair", text: "Beautiful piece of furniture. The colour is spot on and it's incredibly comfortable.", stars: 5 },
  { id: 4, name: "Samantha C.", product: "Orange 2 Seater Sofa", text: "Absolutely love this sofa. It's a real statement piece and the quality is brilliant for the price.", stars: 5 },
  { id: 5, name: "Emma S.", product: "Set of 2 Rattan Bar Stools", text: "Ordered three sets and they all arrived perfectly. Great communication from the seller.", stars: 5 },
  { id: 6, name: "Helen P.", product: "Khaki Chenille Accent Chair", text: "Such a lovely chair. The fabric feels premium and the lumbar pillow is a nice touch.", stars: 4 },
  { id: 7, name: "Philip P.", product: "Mid Century Rocking Chair", text: "Stunning design and very well made. Gets compliments from everyone who visits.", stars: 5 },
  { id: 8, name: "Pere C.", product: "Green Corduroy Accent Chairs", text: "Bought two for our restaurant — they look incredible. Customers love them.", stars: 5 },
];

export const CustomerReviews = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = REVIEWS.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  const getVisibleReviews = () => {
    const reviews = [];
    for (let i = 0; i < 3; i++) reviews.push(REVIEWS[(current + i) % totalSlides]);
    return reviews;
  };

  const visible = getVisibleReviews();

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20 max-w-2xl">
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-5 font-medium">Reviews</p>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 3.25rem)", letterSpacing: "-0.03em" }}>
            Loved by homes across the UK.
          </h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visible.map((r, i) => (
              <div
                key={`${r.id}-${current}`}
                className={`bg-background p-8 md:p-10 animate-fade-in ${i > 0 ? "hidden md:block" : ""}`}
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className={`w-4 h-4 ${si < r.stars ? "text-foreground fill-foreground" : "text-border"}`} strokeWidth={1.5} />
                  ))}
                </div>
                <p className="text-foreground text-base leading-relaxed mb-6">"{r.text}"</p>
                <p className="text-sm text-foreground font-semibold tracking-tight">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.product}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-10">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-[2px] transition-all duration-300 ${i === current ? "w-8 bg-foreground" : "w-4 bg-foreground/20 hover:bg-foreground/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
