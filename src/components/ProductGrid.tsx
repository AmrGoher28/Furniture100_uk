import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchProductsPage, ShopifyProduct, ProductsPageInfo } from "@/lib/shopify";
import { Loader2 } from "lucide-react";
import ProductImageCarousel from "@/components/ProductImageCarousel";

const CATEGORIES: Record<string, string[]> = {
  All: [],
  Office: ["Desks", "Office Chairs", "Bookshelves"],
  "Dining Room": ["Dining Tables", "Dining Chairs", "Sideboards"],
  "Living Room": ["Sofas", "Coffee Tables", "TV Units", "Shelving"],
  Seating: ["Armchairs", "Accent Chairs", "Benches", "Stools"],
};

const PAGE_SIZE = 24;

interface ProductGridProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const ProductGrid = ({ activeCategory, onCategoryChange }: ProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState<ProductsPageInfo>({ hasNextPage: false, endCursor: null });
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveSubCategory(null);
  }, [activeCategory]);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const { products: firstPage, pageInfo: pi } = await fetchProductsPage(PAGE_SIZE);
        setProducts(firstPage);
        setPageInfo(pi);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !pageInfo.hasNextPage) return;
    setLoadingMore(true);
    try {
      const { products: nextPage, pageInfo: pi } = await fetchProductsPage(PAGE_SIZE, pageInfo.endCursor);
      setProducts((prev) => [...prev, ...nextPage]);
      setPageInfo(pi);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pageInfo]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  const filterTerm = activeSubCategory || (activeCategory !== "All" ? activeCategory : null);

  const filteredProducts = !filterTerm
    ? products
    : products.filter((p) => {
        const title = p.node.title.toLowerCase();
        const desc = p.node.description.toLowerCase();
        const term = filterTerm.toLowerCase();
        return title.includes(term) || desc.includes(term);
      });

  const subCategories = CATEGORIES[activeCategory] || [];

  return (
    <section id="collection" className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 font-light">
            The Collection
          </p>
          <h2 className="text-4xl md:text-5xl">Crafted for Living</h2>
        </div>

        {subCategories.length > 0 && (
          <div className="flex justify-center gap-3 md:gap-5 mb-16 flex-wrap overflow-x-auto">
            <button
              onClick={() => setActiveSubCategory(null)}
              className={`text-[11px] tracking-[0.15em] uppercase px-4 py-1.5 rounded-full border transition-colors ${
                !activeSubCategory
                  ? "border-primary text-foreground bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              All {activeCategory}
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub)}
                className={`text-[11px] tracking-[0.15em] uppercase px-4 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  activeSubCategory === sub
                    ? "border-primary text-foreground bg-primary/10"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {subCategories.length === 0 && <div className="mb-16" />}

        {loading && products.length === 0 ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length === 0 && !loading ? (
          <div className="text-center py-24">
            <p className="text-2xl mb-3">No products found</p>
            <p className="text-muted-foreground font-light">
              New pieces are being prepared. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filteredProducts.map((product) => {
                const image = product.node.images.edges[0]?.node;
                const price = product.node.priceRange.minVariantPrice;
                return (
                  <Link
                    key={product.node.id}
                    to={`/product/${product.node.handle}`}
                    className="group block"
                  >
                    <div className="aspect-[4/5] bg-card overflow-hidden mb-5 rounded-xl warm-shadow group-hover:warm-shadow-lg transition-shadow duration-300">
                      {image ? (
                        <img
                          src={image.url}
                          alt={image.altText || product.node.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <span className="text-xs tracking-[0.2em] uppercase font-light">No image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg mb-1">{product.node.title}</h3>
                    <p className="text-sm text-muted-foreground font-light">
                      From {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
                    </p>
                  </Link>
                );
              })}
            </div>

            {pageInfo.hasNextPage && (
              <div ref={sentinelRef} className="flex justify-center py-8">
                {loadingMore && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
