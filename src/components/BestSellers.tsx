import { useEffect, useState } from "react";
import { fetchProductsPage, ShopifyProduct, fetchProductsByHandles } from "@/lib/shopify";
import { fetchBestSellerHandles } from "@/lib/productCategories";
import { Loader2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "./ProductCard";

export const BestSellers = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const bestHandles = await fetchBestSellerHandles();
        if (bestHandles.length > 0) {
          const mappedProducts = await fetchProductsByHandles(bestHandles);
          if (mappedProducts.length > 0) {
            setProducts(mappedProducts.slice(0, 4));
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

  return (
    <section id="best-sellers" className="py-24 md:py-32 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Best Sellers"
          title="The pieces everyone's talking about."
          linkLabel="View all"
          linkHref="/shop"
          className="mb-14 md:mb-20"
        />

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-14 md:gap-y-20">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
