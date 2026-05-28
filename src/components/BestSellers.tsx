import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductsPage, ShopifyProduct, fetchProductsByHandles } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { fetchBestSellerHandles } from "@/lib/productCategories";
import { Loader2 } from "lucide-react";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import { useProductReviews } from "@/hooks/useProductReviews";
import ProductStars from "@/components/ProductStars";

export const BestSellers = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const { summaries } = useProductReviews();

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const bestHandles = await fetchBestSellerHandles();
        if (bestHandles.length > 0) {
          const mappedProducts = await fetchProductsByHandles(bestHandles);
          if (mappedProducts.length > 0) {
            setProducts(mappedProducts);
            return;
          }
        }
        const { products: firstPage } = await fetchProductsPage(4);
        setProducts(firstPage);
      } catch (e) {
        console.error("Failed to load best sellers:", e);
      } finally {
        setLoading(false);
      }
    };
    loadBestSellers();
  }, []);

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

  return (
    <section id="best-sellers" className="py-24 md:py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12 md:mb-16">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-5 font-medium">Best Sellers</p>
            <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 3.25rem)", letterSpacing: "-0.03em" }}>
              The pieces everyone's talking about.
            </h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-16">
            {products.map((product) => {
              const price = product.node.priceRange.minVariantPrice;
              return (
                <Link key={product.node.id} to={`/product/${product.node.handle}`} className="group flex flex-col">
                  <div className="relative overflow-hidden bg-card aspect-square mb-4">
                    <ProductImageCarousel
                      images={product.node.images.edges.map((e) => e.node)}
                      title={product.node.title}
                      className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="text-sm font-medium tracking-tight text-foreground mb-1 line-clamp-2">
                    {product.node.title}
                  </h3>
                  {summaries[product.node.handle] && (
                    <div className="mb-1">
                      <ProductStars rating={summaries[product.node.handle].avgRating} count={summaries[product.node.handle].count} />
                    </div>
                  )}
                  <p className="text-sm text-foreground font-semibold">
                    £{parseFloat(price.amount).toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="mt-4 self-start text-xs font-medium tracking-tight text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    Add to basket
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
