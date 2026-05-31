import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { ShopifyProduct, fetchProductsByHandles, fetchProductsPage, ProductsPageInfo } from "@/lib/shopify";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { fetchMappingsByCategory } from "@/lib/productCategories";
import { Loader2, ChevronDown, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import shopAllHero from "@/assets/shop-all-hero.webp";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const FILTER_GROUPS = ["Category", "Colour", "Material", "Price"] as const;

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
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSub(null);
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

  // When user picks a non-default sort, eagerly load remaining pages so the sort applies to the full catalogue.
  useEffect(() => {
    if (sort !== "featured" && pageInfo.hasNextPage && !loadingMore && !usedDbMapping) {
      loadMore();
    }
  }, [sort, pageInfo.hasNextPage, loadingMore, usedDbMapping, loadMore]);

  const baseProducts = category && !usedDbMapping
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

  const displayProducts = activeSub
    ? baseProducts.filter((p) => {
        const t = p.node.title.toLowerCase();
        const d = p.node.description.toLowerCase();
        const term = activeSub.toLowerCase();
        return t.includes(term) || d.includes(term);
      })
    : baseProducts;

  const sortedProducts = [...displayProducts].sort((a, b) => {
    if (sort === "price-asc") return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
    if (sort === "price-desc") return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
    if (sort === "newest") {
      const ad = a.node.createdAt ? new Date(a.node.createdAt).getTime() : 0;
      const bd = b.node.createdAt ? new Date(b.node.createdAt).getTime() : 0;
      return bd - ad;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [slug, sort, activeSub]);

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
  const heroImage = category?.image ?? shopAllHero;
  const subcategories = category?.subcategories ?? [];

  const seoPath = slug ? `/category/${slug}` : "/shop";
  const seoTitle = slug ? `${title} | Furniture100` : "Shop All Furniture | Furniture100";
  const seoDesc = slug
    ? `Shop premium ${title.toLowerCase()} at Furniture100. Free UK delivery and 30-day returns on every order.`
    : "Browse our full collection of premium furniture - sofas, lounge chairs, dining, lighting and more. Free UK delivery.";

  const categoryJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: seoTitle,
      description: seoDesc,
      url: `https://furniture100.co.uk${seoPath}`,
      isPartOf: { "@type": "WebSite", name: "Furniture100", url: "https://furniture100.co.uk" },
      ...(sortedProducts.length > 0 && {
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: sortedProducts.length,
          itemListElement: sortedProducts.slice(0, 24).map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: `https://furniture100.co.uk/product/${p.node.handle}`,
            name: p.node.title,
          })),
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://furniture100.co.uk/" },
        { "@type": "ListItem", position: 2, name: "Shop", item: "https://furniture100.co.uk/shop" },
        ...(slug ? [{ "@type": "ListItem", position: 3, name: title, item: `https://furniture100.co.uk${seoPath}` }] : []),
      ],
    },
  ];

  return (
    <Layout>
      <Seo title={seoTitle.slice(0, 60)} description={seoDesc.slice(0, 155)} path={seoPath} jsonLd={categoryJsonLd} />


      {/* Editorial hero banner with overlaid title */}
      <section className="relative bg-[#F4EFE6]">
        <div className="relative h-[280px] md:h-[440px] overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#F4EFE6] to-[#E5DDC9]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-8 md:pb-14">
            <nav className="text-[10px] tracking-[0.2em] uppercase text-white/85 mb-3 md:mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span>{title}</span>
            </nav>
            <h1
              className="text-white uppercase font-medium"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.75rem)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Subcategory pill rail */}
        {subcategories.length > 0 && (
          <div className="border-b border-border bg-background">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex gap-2 md:gap-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveSub(null)}
                className={`shrink-0 text-[10px] md:text-[11px] tracking-[0.18em] uppercase px-4 h-9 rounded-full border transition-colors whitespace-nowrap ${
                  !activeSub
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
                }`}
              >
                All {title}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSub(sub.name)}
                  className={`shrink-0 text-[10px] md:text-[11px] tracking-[0.18em] uppercase px-4 h-9 rounded-full border transition-colors whitespace-nowrap ${
                    activeSub === sub.name
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sticky filter toolbar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-foreground/80 hover:text-foreground transition-colors h-9 px-3"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
              All Filters
            </button>
            <div className="hidden md:flex items-center gap-1">
              {FILTER_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-foreground/80 hover:text-foreground transition-colors h-9 px-3"
                >
                  {g}
                  <ChevronDown className="w-3 h-3" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <p className="hidden sm:block text-[11px] tracking-[0.1em] text-muted-foreground">
              Showing <span className="text-foreground">{Math.min(ITEMS_PER_PAGE, paginatedProducts.length)}</span> of {count}
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none bg-transparent border-none text-[11px] tracking-[0.15em] uppercase text-foreground/80 hover:text-foreground cursor-pointer focus:outline-none pr-5 transition-colors"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>Sort: {o.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / all-filters drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto animate-fade-in">
          <div className="max-w-md mx-auto p-8">
            <div className="flex items-center justify-between mb-10">
              <p className="text-[11px] tracking-[0.18em] uppercase font-medium">All Filters</p>
              <button onClick={() => setShowFilters(false)} aria-label="Close">
                <X className="w-4 h-4 text-foreground" strokeWidth={1.5} />
              </button>
            </div>
            <div className="mb-10">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Browse</p>
              <div className="space-y-3">
                <Link to="/shop" onClick={() => setShowFilters(false)} className="block text-sm text-foreground">All Categories</Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    onClick={() => setShowFilters(false)}
                    className={`block text-sm transition-colors ${cat.slug === slug ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            {subcategories.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Refine</p>
                <div className="space-y-3">
                  <button onClick={() => { setActiveSub(null); setShowFilters(false); }} className={`block text-sm ${!activeSub ? "text-foreground" : "text-muted-foreground"}`}>All {title}</button>
                  {subcategories.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => { setActiveSub(s.name); setShowFilters(false); }}
                      className={`block text-sm transition-colors ${activeSub === s.name ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product grid */}
      <section className="py-10 md:py-14 px-2.5 md:px-12">
        <div className="max-w-7xl mx-auto">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 md:gap-x-5 gap-y-12 md:gap-y-14">
                {paginatedProducts.map((product, idx) => {
                  const available = product.node.variants.edges.some((v) => v.node.availableForSale);
                  const status = available ? "In Stock" : "Pre-order";
                  return (
                    <ProductCard
                      key={product.node.id}
                      product={product}
                      status={status}
                      statusVariant={available ? "in-stock" : "pre-order"}
                      priority={idx < 4}
                    />
                  );
                })}
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
      </section>
    </Layout>
  );
};

export default CategoryPage;
