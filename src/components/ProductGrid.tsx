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
        <div className="mb-16 max-w-2xl">
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-5 font-medium">
            The Collection
          </p>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 3.25rem)", letterSpacing: "-0.03em" }}>
            Crafted for living.
          </h2>
        </div>

        {subCategories.length > 0 && (
          <div className="flex gap-2 md:gap-3 mb-12 flex-wrap">
            <button
              onClick={() => setActiveSubCategory(null)}
              className={`text-xs tracking-tight px-5 h-9 rounded-full border transition-colors ${
                !activeSubCategory
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              All {activeCategory}
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub)}
                className={`text-xs tracking-tight px-5 h-9 rounded-full border transition-colors whitespace-nowrap ${
                  activeSubCategory === sub
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length === 0 && !loading ? (
          <div className="text-center py-24">
            <p className="text-2xl mb-3 tracking-tight">No products found</p>
            <p className="text-muted-foreground">
              New pieces are being prepared. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-16">
              {filteredProducts.map((product) => {
                const price = product.node.priceRange.minVariantPrice;
                return (
                  <Link
                    key={product.node.id}
                    to={`/product/${product.node.handle}`}
                    className="group flex flex-col"
                  >
                    <div className="relative overflow-hidden bg-card aspect-[4/5] mb-4">
                      <ProductImageCarousel
                        images={product.node.images.edges.map((e) => e.node)}
                        title={product.node.title}
                        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <h3 className="text-sm font-medium tracking-tight text-foreground mb-1 line-clamp-2">{product.node.title}</h3>
                    <p className="text-sm text-foreground font-semibold">
                      From {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
                    </p>
                  </Link>
                );
              })}
            </div>

            {pageInfo.hasNextPage && (
              <div ref={sentinelRef} className="flex justify-center py-12">
                {loadingMore && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
