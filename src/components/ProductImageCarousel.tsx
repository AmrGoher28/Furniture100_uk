import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageNode {
  url: string;
  altText?: string | null;
}

interface ProductImageCarouselProps {
  images: ImageNode[];
  title: string;
  className?: string;
}

const ProductImageCarousel = ({ images, title, className = "" }: ProductImageCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const didSwipe = useRef(false);

  const count = images.length;

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? count - 1 : c - 1));
  }, [count]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c === count - 1 ? 0 : c + 1));
  }, [count]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    didSwipe.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const diff = Math.abs(e.touches[0].clientX - touchStartX.current);
    if (diff > 10) {
      didSwipe.current = true;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      didSwipe.current = true;
      if (diff > 0) setCurrent((c) => (c === count - 1 ? 0 : c + 1));
      else setCurrent((c) => (c === 0 ? count - 1 : c - 1));
    }
  };

  // Prevent the parent Link from navigating when user swiped
  const onClickCapture = (e: React.MouseEvent) => {
    if (didSwipe.current) {
      e.preventDefault();
      e.stopPropagation();
      didSwipe.current = false;
    }
  };

  if (count === 0) {
    return (
      <div className={`bg-secondary flex items-center justify-center text-muted-foreground text-sm ${className}`}>
        No image
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden group/carousel ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClickCapture={onClickCapture}
    >
      {images.map((img, i) => {
        // Only render current image and its neighbors to reduce DOM/network load
        const distance = Math.min(Math.abs(i - current), count - Math.abs(i - current));
        if (distance > 1) return null;
        return (
          <img
            key={i}
            src={img.url}
            alt={img.altText || title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            loading={i === current ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        );
      })}

      {count > 1 && (
        <>
          {/* Arrows – visible on hover (desktop) */}
          <button
            onClick={prev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? "bg-primary-foreground" : "bg-primary-foreground/40"
                }`}
              />
            ))}
            {count > 5 && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/40" />}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImageCarousel;
