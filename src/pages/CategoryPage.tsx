import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { fetchMappingsByCategory } from "@/lib/productCategories";
import { Loader2, ShoppingBag, SlidersHorizontal, ChevronDown, X } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [prodData, dbHandles] = await Promise.all([
          storefrontApiRequest(PRODUCTS_QUERY, { first: 50 }),
          category ? fetchMappingsByCategory(category.slug) : Promise.resolve([]),
        ]);
        const allProducts: ShopifyProduct[] = prodData?.data?.products?.edges || [];
        if (category) {
          // Use DB mappings first; fall back to keyword matching for unmapped products
          const dbSet = new Set(dbHandles);
          const dbMatched = allProducts.filter((p) => dbSet.has(p.node.handle));
          
          if (dbMatched.length > 0) {
            setProducts(dbMatched);
          } else {
            // Fallback: keyword matching
            const term = category.name.toLowerCase();
            const filtered = allProducts.filter((p) => {
              const t = p.node.title.toLowerCase();
              const d = p.node.description.toLowerCase();
              return t.includes(term) || d.includes(term) ||
                category.subcategories.some((s) => t.includes(s.name.toLowerCase()) || d.includes(s.name.toLowerCase()));
            });
            setProducts(filtered);
          }
        } else {
          setProducts(allProducts);
        }
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug, category]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-asc") return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
    if (sort === "price-desc") return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
    return 0;
  });

  const handleAddToCart = (e: React.MouseEvent, product: ShopifyProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
  };

  const title = category?.name || "All Products";

  return (
    <Layout>
      {/* Hero banner */}
      <section className="relative h-48 md:h-64 flex items-center justify-center bg-secondary overflow-hidden">
        {category?.image && (
          <>
            <img src={category.image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/40" />
          </>
        )}
        <div className="relative z-10 text-center">
          <nav className="text-xs text-white/70 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{title}</span>
          </nav>
          <h1 className={`text-3xl md:text-5xl ${category?.image ? "text-white" : "text-foreground"}`}>{title}</h1>
        </div>
      </section>

      <section className="py-8 md:py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-1.5 text-sm border border-border px-3 py-1.5 rounded-md"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-background border border-border rounded-md px-3 py-1.5 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden md:block w-56 shrink-0">
              <p className="text-sm font-semibold mb-4">Categories</p>
              <div className="space-y-2 mb-8">
                <Link
                  to="/shop"
                  className={`block text-sm transition-colors ${!category ? "text-gold font-medium" : "text-muted-foreground hover:text-foreground"}`}
                >
                  All Products
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className={`block text-sm transition-colors ${cat.slug === slug ? "text-gold font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {category && category.subcategories.length > 0 && (
                <>
                  <p className="text-sm font-semibold mb-4">Subcategories</p>
                  <div className="space-y-2">
                    {category.subcategories.map((sub) => (
                      <span key={sub.slug} className="block text-sm text-muted-foreground">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </aside>

            {/* Mobile filters overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 bg-background p-6 overflow-y-auto md:hidden animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-lg font-semibold">Filters</p>
                  <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
                </div>
                <p className="text-sm font-semibold mb-3">Categories</p>
                <div className="space-y-2 mb-6">
                  <Link to="/shop" onClick={() => setShowFilters(false)} className="block text-sm text-muted-foreground hover:text-foreground">All Products</Link>
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.slug} to={`/category/${cat.slug}`} onClick={() => setShowFilters(false)} className="block text-sm text-muted-foreground hover:text-foreground">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-2xl mb-3">No products found</p>
                  <p className="text-muted-foreground">Check back soon for new arrivals.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {sortedProducts.map((product) => {
                    const image = product.node.images.edges[0]?.node;
                    const price = product.node.priceRange.minVariantPrice;
                    return (
                      <Link key={product.node.id} to={`/product/${product.node.handle}`} className="group block">
                        <div className="aspect-square bg-secondary overflow-hidden rounded-lg mb-4">
                          {image ? (
                            <img src={image.url} alt={image.altText || product.node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                          )}
                        </div>
                        <h3 className="text-sm font-medium mb-1 group-hover:text-gold transition-colors">{product.node.title}</h3>
                        <p className="text-base font-semibold mb-3">£{parseFloat(price.amount).toFixed(2)}</p>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Basket
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
