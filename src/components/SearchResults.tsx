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
        const { products } = await fetchProductsPage(8, null, query.trim());
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
    <div className="border-t border-border bg-background px-6 md:px-12 py-4 animate-fade-in max-h-[60vh] overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No results found for "{query}"
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {results.map((p) => {
              const img = p.node.images.edges[0]?.node.url;
              const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
              return (
                <Link
                  key={p.node.id}
                  to={`/product/${p.node.handle}`}
                  onClick={onClose}
                  className="group"
                >
                  <div className="aspect-square bg-secondary rounded-md overflow-hidden mb-2">
                    {img ? (
                      <img src={img} alt={p.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">{p.node.title}</p>
                  <p className="text-xs text-muted-foreground">£{price.toFixed(2)}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
