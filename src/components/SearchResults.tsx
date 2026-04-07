import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchProductsPage, type ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export const SearchResults = ({ query, onClose }: SearchResultsProps) => {
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { products } = await fetchProductsPage(6, null, query.trim());
        setResults(products);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  if (!query.trim()) return null;

  return (
    <div className="border-t border-border/50 bg-background">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10 font-light">
            No results found for "{query}"
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-4 font-light tracking-wide uppercase">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col divide-y divide-border/40">
              {results.map((p) => {
                const img = p.node.images.edges[0]?.node.url;
                const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
                return (
                  <Link
                    key={p.node.id}
                    to={`/product/${p.node.handle}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 group"
                  >
                    <div className="w-14 h-14 bg-secondary rounded-md overflow-hidden shrink-0">
                      {img ? (
                        <img src={img} alt={p.node.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">No image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate group-hover:text-gold transition-colors">{p.node.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">£{price.toFixed(2)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
