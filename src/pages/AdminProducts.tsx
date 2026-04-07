import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Pencil, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { fetchProductsPage, type ShopifyProduct } from "@/lib/shopify";
import { useAuth } from "@/hooks/useAuth";
import { ProductEditModal } from "@/components/admin/ProductEditModal";
import { ProductAITools } from "@/components/admin/ProductAITools";

const PRODUCTS_PER_PAGE = 24;

const AdminProducts = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Editing
  const [editProduct, setEditProduct] = useState<ShopifyProduct | null>(null);
  const [aiProduct, setAiProduct] = useState<ShopifyProduct | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const loadProducts = async (cursor: string | null = null, query?: string) => {
    setLoading(true);
    try {
      const { products: fetched, pageInfo } = await fetchProductsPage(
        PRODUCTS_PER_PAGE,
        cursor,
        query || undefined
      );
      setProducts(fetched);
      setHasNextPage(pageInfo.hasNextPage);
      if (pageInfo.endCursor && !cursors.includes(pageInfo.endCursor)) {
        setCursors((prev) => [...prev, pageInfo.endCursor]);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = () => {
    setCurrentPage(0);
    setCursors([null]);
    loadProducts(null, searchQuery);
  };

  const handleNextPage = () => {
    const nextCursor = cursors[currentPage + 1] || cursors[cursors.length - 1];
    setCurrentPage((p) => p + 1);
    loadProducts(nextCursor, searchQuery);
  };

  const handlePrevPage = () => {
    if (currentPage <= 0) return;
    const prevCursor = currentPage - 1 === 0 ? null : cursors[currentPage - 1];
    setCurrentPage((p) => p - 1);
    loadProducts(prevCursor, searchQuery);
  };

  const getStatusBadges = (p: ShopifyProduct) => {
    const badges: { color: string; label: string }[] = [];
    if (!p.node.description) badges.push({ color: "bg-destructive", label: "No description" });
    if (p.node.images.edges.length === 0) badges.push({ color: "bg-amber-500", label: "No images" });
    else if (p.node.images.edges.length === 1) badges.push({ color: "bg-orange-400", label: "1 image" });
    return badges;
  };

  const handleApplyDescription = (_desc: string) => {
    // handled by modal flow
  };

  if (authLoading) return <Layout><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-medium">Product Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Edit products, manage images, and use AI tools</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search products..."
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const img = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              const badges = getStatusBadges(product);

              return (
                <div
                  key={product.node.id}
                  className="group border border-border rounded-lg overflow-hidden bg-background hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] bg-muted relative">
                    {img ? (
                      <img src={img.url} alt={img.altText || product.node.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                    {/* Status badges */}
                    {badges.length > 0 && (
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {badges.map((b, i) => (
                          <span key={i} className={`${b.color} text-white text-[10px] px-2 py-0.5 rounded-full`}>
                            {b.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <p className="text-sm font-light leading-snug line-clamp-2">{product.node.title}</p>
                    <p className="text-sm text-muted-foreground">
                      £{parseFloat(price.amount).toFixed(2)}
                    </p>
                    {product.node.description ? (
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.node.description}</p>
                    ) : (
                      <p className="text-xs text-destructive/70 italic">Missing description</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                        onClick={() => setEditProduct(product)}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                        onClick={() => setAiProduct(product)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-muted-foreground">Page {currentPage + 1}</span>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <ProductEditModal
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          product={{
            id: editProduct.node.id,
            title: editProduct.node.title,
            description: editProduct.node.description,
            handle: editProduct.node.handle,
            price: editProduct.node.priceRange.minVariantPrice.amount,
            currencyCode: editProduct.node.priceRange.minVariantPrice.currencyCode,
            images: editProduct.node.images.edges.map((e) => e.node),
            variantId: editProduct.node.variants.edges[0]?.node.id,
          }}
          onSaved={() => loadProducts(currentPage === 0 ? null : cursors[currentPage], searchQuery)}
        />
      )}

      {/* AI Tools */}
      {aiProduct && (
        <ProductAITools
          open={!!aiProduct}
          onOpenChange={(open) => !open && setAiProduct(null)}
          product={{
            id: aiProduct.node.id,
            title: aiProduct.node.title,
            description: aiProduct.node.description,
            imageUrl: aiProduct.node.images.edges[0]?.node.url,
          }}
          onApplyDescription={(desc) => {
            // Open edit modal with the new description pre-filled
            setAiProduct(null);
            // We'll just set the edit product and the user can paste
            setEditProduct(aiProduct);
          }}
        />
      )}
    </Layout>
  );
};

export default AdminProducts;
