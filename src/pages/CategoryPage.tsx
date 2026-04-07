import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ShopifyProduct, fetchProductsByHandles, fetchProductsPage, ProductsPageInfo } from "@/lib/shopify";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { fetchMappingsByCategory } from "@/lib/productCategories";
import { Loader2, SlidersHorizontal, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";

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

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when category or sort changes
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

  const title = category?.name || "All Products";

  return (
    <Layout>
      {/* Hero banner – reduced height, editorial feel */}
      <section className="relative h-28 md:h-40 flex items-center justify-center bg-secondary overflow-hidden">
        {category?.image && (
          <>
            <img src={category.image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/20" />
          </>
        )}
        <div className="relative z-10 text-center">
          <nav className="text-[10px] tracking-[0.15em] uppercase text-white/60 mb-1.5">
            <Link to="/" className="hover:text-white/90 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{title}</span>
          </nav>
          <h1 className={`font-serif font-normal text-2xl md:text-4xl ${category?.image ? "text-white" : "text-foreground"}`}>
            {title}
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-20 px-6 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          {/* Toolbar – subtle */}
          <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
            <p className="text-xs text-muted-foreground/70 font-light">
              {loading ? "Loading…" : `${sortedProducts.length} product${sortedProducts.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 px-3 py-1.5 rounded-md"
              >
                <SlidersHorizontal className="w-3 h-3" />
                Filters
              </button>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-transparent border-none text-xs text-muted-foreground cursor-pointer focus:outline-none pr-5"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/50" />
              </div>
            </div>
          </div>

          <div className="flex gap-12 md:gap-16">
            {/* Sidebar – refined */}
            <aside className="hidden md:block w-48 shrink-0">
              <div className="space-y-3">
                <Link
                  to="/shop"
                  className={`block text-sm font-light transition-colors ${!category ? "text-foreground border-b border-foreground pb-0.5 inline-block" : "text-muted-foreground/70 hover:text-foreground"}`}
                >
                  All Products
                </Link>
                {CATEGORIES.map((cat) => (
                  <div key={cat.slug}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className={`block text-sm font-light transition-colors ${cat.slug === slug ? "text-foreground border-b border-foreground pb-0.5 inline-block" : "text-muted-foreground/70 hover:text-foreground"}`}
                    >
                      {cat.name}
                    </Link>
                    {/* Nested subcategories */}
                    {cat.slug === slug && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="pl-4 mt-2 space-y-2">
                        {cat.subcategories.map((sub) => (
                          <span key={sub.slug} className="block text-xs font-light text-muted-foreground/60">
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Mobile filters overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 bg-background p-8 overflow-y-auto md:hidden animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm font-light tracking-wide">Filters</p>
                  <button onClick={() => setShowFilters(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                </div>
                <div className="space-y-3">
                  <Link to="/shop" onClick={() => setShowFilters(false)} className="block text-sm font-light text-muted-foreground hover:text-foreground">All Products</Link>
                  {CATEGORIES.map((cat) => (
                    <div key={cat.slug}>
                      <Link to={`/category/${cat.slug}`} onClick={() => setShowFilters(false)} className="block text-sm font-light text-muted-foreground hover:text-foreground">
                        {cat.name}
                      </Link>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-4 mt-1.5 space-y-1.5">
                          {cat.subcategories.map((sub) => (
                            <span key={sub.slug} className="block text-xs font-light text-muted-foreground/60">
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1">
              {loading && products.length === 0 ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                </div>
              ) : sortedProducts.length === 0 && !loading ? (
                <div className="text-center py-24">
                  <p className="text-xl font-light mb-2">No products found</p>
                  <p className="text-sm text-muted-foreground/60 font-light">Check back soon for new arrivals.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-14">
                    {paginatedProducts.map((product) => {
                      const images = product.node.images.edges;
                      const firstImg = images[0]?.node;
                      const secondImg = images[1]?.node;
                      const price = product.node.priceRange.minVariantPrice;

                      return (
                        <Link key={product.node.id} to={`/product/${product.node.handle}`} className="group block">
                          <div className="aspect-[4/5] bg-card rounded-lg overflow-hidden mb-4 relative">
                            {firstImg && (
                              <img
                                src={firstImg.url}
                                alt={firstImg.altText || product.node.title}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${secondImg ? "group-hover:opacity-0" : ""}`}
                                loading="lazy"
                              />
                            )}
                            {secondImg && (
                              <img
                                src={secondImg.url}
                                alt={secondImg.altText || product.node.title}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <h3 className="text-sm font-light mb-1 text-foreground/80">{product.node.title}</h3>
                          <p className="text-sm text-muted-foreground font-normal">
                            £{parseFloat(price.amount).toFixed(0)}
                          </p>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 pt-14 pb-4">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 text-muted-foreground/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {getPageNumbers().map((p, i) =>
                        p === "..." ? (
                          <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-muted-foreground/40 select-none">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`min-w-[28px] h-7 text-xs transition-colors ${
                              p === currentPage
                                ? "text-foreground border-b border-foreground"
                                : "text-muted-foreground/50 hover:text-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 text-muted-foreground/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Infinite scroll sentinel for loading more from API */}
                  {pageInfo.hasNextPage && !usedDbMapping && (
                    <div ref={sentinelRef} className="flex justify-center py-4">
                      {loadingMore && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" />}
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
