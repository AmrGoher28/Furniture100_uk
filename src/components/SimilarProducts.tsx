import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchProductsPage, type ShopifyProduct } from "@/lib/shopify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface SimilarProductsProps {
  currentHandle: string;
  productTitle: string;
}

const SimilarProducts = ({ currentHandle, productTitle }: SimilarProductsProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const keyword = productTitle.split(" ").find((w) => w.length > 3) || "";
        const { products: results } = await fetchProductsPage(12, null, keyword);
        setProducts(results.filter((p) => p.node.handle !== currentHandle).slice(0, 10));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [currentHandle, productTitle]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32 mb-8">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-3 font-medium">More to consider</p>
          <h2
            style={{
              fontSize: "clamp(1.375rem, 2.4vw, 1.875rem)",
              letterSpacing: "-0.03em",
              fontWeight: 500,
            }}
          >
            You may also like.
          </h2>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll("left")} aria-label="Previous" className="text-foreground/60 hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button onClick={() => scroll("right")} aria-label="Next" className="text-foreground/60 hover:text-foreground transition-colors">
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-8 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => (
          <div key={p.node.id} className="shrink-0 w-[180px] md:w-[260px] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;
