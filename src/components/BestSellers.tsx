import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductsPage, ShopifyProduct, fetchProductsByHandles } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { fetchBestSellerHandles } from "@/lib/productCategories";
import { Loader2, ShoppingBag } from "lucide-react";
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
    <section id="best-sellers" className="py-16 md:py-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-3">Our Best Sellers</h2>
          <p className="text-muted-foreground font-light">The pieces everyone is talking about</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground font-light">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              return (
                <Link
                  key={product.node.id}
                  to={`/product/${product.node.handle}`}
                  className="group flex flex-col h-full"
                >
                  <ProductImageCarousel
                    images={product.node.images.edges.map((e) => e.node)}
                    title={product.node.title}
                    className="aspect-square bg-card rounded-xl mb-4 warm-shadow group-hover:warm-shadow-lg transition-shadow duration-300"
                  />
                  <div className="flex flex-col flex-1">
                    <h3 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
                      {product.node.title}
                    </h3>
                    {summaries[product.node.handle] && (
                      <ProductStars rating={summaries[product.node.handle].avgRating} count={summaries[product.node.handle].count} />
                    )}
                    <p className="text-base font-medium mb-3">
                      £{parseFloat(price.amount).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity mt-auto"
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
    </section>
  );
};
