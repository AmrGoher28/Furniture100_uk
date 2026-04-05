import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

export const BestSellers = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 4 });
        setProducts(data?.data?.products?.edges || []);
      } catch (e) {
        console.error("Failed to load best sellers:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl mb-3">Our Best Sellers</h2>
          <p className="text-muted-foreground font-light">The pieces everyone is talking about</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              return (
                <Link
                  key={product.node.id}
                  to={`/product/${product.node.handle}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] bg-secondary overflow-hidden rounded-sm mb-4 transition-shadow duration-300 group-hover:shadow-md">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium mb-1 group-hover:text-gold transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {product.node.title}
                  </h3>
                  <p className="text-base font-semibold">
                    £{parseFloat(price.amount).toFixed(2)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
