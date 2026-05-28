import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { ShopifyProduct, fetchProductsByHandles, fetchProductsPage, ProductsPageInfo } from "@/lib/shopify";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { fetchMappingsByCategory } from "@/lib/productCategories";
import { Loader2, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const PAGE_SIZE = 24;
const ITEMS_PER_PAGE = 12;

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState<ProductsPageInfo>({ hasNextPage: false, endCursor: null });
  const [sort, setSort] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [usedDbMapping, setUsedDbMapping] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setProducts([]);
      setPageInfo({ hasNextPage: false, endCursor: null });
      setUsedDbMapping(false);

      try {
        if (category) {
          const dbHandles = await fetchMappingsByCategory(category.slug);
          if (dbHandles.length > 0) {
            const mappedProducts = await fetchProductsByHandles(dbHandles);
            if (mappedProducts.length > 0) {
              setProducts(mappedProducts);
              setUsedDbMapping(true);
              return;
            }
          }
        }

        const { products: firstPage, pageInfo: pi } = await fetchProductsPage(PAGE_SIZE);
        setProducts(firstPage);
        setPageInfo(pi);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [slug, category]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !pageInfo.hasNextPage || usedDbMapping) return;
    setLoadingMore(true);
    try {
      const { products: nextPage, pageInfo: pi } = await fetchProductsPage(PAGE_SIZE, pageInfo.endCursor);
      setProducts((prev) => [...prev, ...nextPage]);
      setPageInfo(pi);
    } catch (e) {
      console.error("Failed to load more products:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pageInfo, usedDbMapping]);

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

  const displayProducts = category && !usedDbMapping
    ? products.filter((p) => {
        const t = p.node.title.toLowerCase();
        const d = p.node.description.toLowerCase();
        const term = category.name.toLowerCase();
        return (
          t.includes(term) ||
          d.includes(term) ||
          category.subcategories.some(
            (s) => t.includes(s.name.toLowerCase()) || d.includes(s.name.toLowerCase())
          )
        );
      })
    : products;

  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (sort === "price-asc") return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
    if (sort === "price-desc") return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [slug, sort]);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const goToPage = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const title = category?.name || "Shop All";
  const count = sortedProducts.length;

  const seoPath = slug ? `/category/${slug}` : "/shop";
  const seoTitle = slug
    ? `${title} | Furniture100`
    : "Shop All Furniture | Furniture100";
  const seoDesc = slug
    ? `Shop premium ${title.toLowerCase()} at Furniture100. Free UK delivery and 30-day returns on every order.`
    : "Browse our full collection of premium furniture — sofas, lounge chairs, dining, lighting and more. Free UK delivery.";

  return (
    <Layout>
      <Seo title={seoTitle.slice(0, 60)} description={seoDesc.slice(0, 155)} path={seoPath} />

      {/* Calm header on white — no overlay image */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
          <nav className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground/70">{title}</span>
          </nav>
          <h1
            className="text-foreground"
            style={{
              fontSize: "clamp(1.875rem, 4vw, 3rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              fontWeight: 500,
            }}
          >
            {title}
          </h1>
          {!loading && (
            <p className="text-xs text-muted-foreground mt-3 tracking-tight">
              {count} {count === 1 ? "piece" : "pieces"}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Thin toolbar — text only */}
          <div className="flex items-center justify-between mb-12 md:mb-16 gap-4 border-b border-border pb-5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              Filter
            </button>
            <Link
              to="/shop"
              className="hidden md:block text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              All Categories
            </Link>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none bg-transparent border-none text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground cursor-pointer focus:outline-none pr-5 transition-colors"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>Sort: {o.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex gap-12 md:gap-16">
            {/* Sidebar */}
            <aside className="hidden md:block w-44 shrink-0">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-5 font-medium">
                Categories
              </p>
              <div className="space-y-3">
                <Link
                  to="/shop"
                  className={`block text-sm transition-colors ${!category ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  All
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className={`block text-sm transition-colors ${cat.slug === slug ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </aside>

            {/* Mobile filters overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 bg-background p-8 overflow-y-auto md:hidden animate-fade-in">
                <div className="flex items-center justify-between mb-10">
                  <p className="text-[11px] tracking-[0.18em] uppercase font-medium">Categories</p>
                  <button onClick={() => setShowFilters(false)} aria-label="Close">
                    <X className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="space-y-4">
                  <Link to="/shop" onClick={() => setShowFilters(false)} className="block text-sm text-foreground">All</Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setShowFilters(false)}
                      className={`block text-sm transition-colors ${cat.slug === slug ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1">
              {loading && products.length === 0 ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : sortedProducts.length === 0 && !loading ? (
                <div className="text-center py-24">
                  <p className="text-base text-foreground mb-2">No products found</p>
                  <p className="text-sm text-muted-foreground">Check back soon for new arrivals.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-14 md:gap-y-20">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.node.id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-20 pb-4">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      {getPageNumbers().map((p, i) =>
                        p === "..." ? (
                          <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted-foreground select-none">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`min-w-[28px] h-8 text-xs transition-colors ${
                              p === currentPage
                                ? "text-foreground border-b border-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}

                  {pageInfo.hasNextPage && !usedDbMapping && (
                    <div ref={sentinelRef} className="flex justify-center py-4">
                      {loadingMore && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
