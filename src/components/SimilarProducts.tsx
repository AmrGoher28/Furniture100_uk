import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchProductsPage, type ShopifyProduct } from "@/lib/shopify";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        // Use the first word of the title as a loose search to find similar items
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
    scrollRef.current?.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl">You May Also Like</h2>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll("left")} className="p-2 border border-border rounded-full hover:border-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="p-2 border border-border rounded-full hover:border-foreground transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => {
          const img = p.node.images.edges[0]?.node.url;
          const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
          return (
            <Link
              key={p.node.id}
              to={`/product/${p.node.handle}`}
              className="shrink-0 w-[160px] md:w-[220px] snap-start group"
            >
              <div className="aspect-square bg-secondary rounded-lg overflow-hidden mb-2">
                {img ? (
                  <img src={img} alt={p.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                )}
              </div>
              <p className="text-sm font-medium text-foreground truncate">{p.node.title}</p>
              <p className="text-sm text-muted-foreground">£{price.toFixed(2)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SimilarProducts;
