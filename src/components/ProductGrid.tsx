import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["All", "Seating", "Tables", "Storage", "Lighting"];

export const ProductGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50 });
        setProducts(data?.data?.products?.edges || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p =>
        p.node.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
        p.node.description.toLowerCase().includes(activeCategory.toLowerCase())
      );

  return (
    <section id="collection" className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
            The Collection
          </p>
          <h2 className="text-4xl md:text-5xl">Crafted for Living</h2>
        </div>

        <div className="flex justify-center gap-6 md:gap-10 mb-16 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs tracking-[0.2em] uppercase pb-1 transition-colors ${
                activeCategory === cat
                  ? "text-foreground border-b border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl mb-3">No products found</p>
            <p className="text-muted-foreground font-light">
              New pieces are being prepared. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredProducts.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              return (
                <Link
                  key={product.node.id}
                  to={`/product/${product.node.handle}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] bg-muted/50 overflow-hidden mb-5">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="text-xs tracking-[0.2em] uppercase">No image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg mb-1">{product.node.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">
                    From {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
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
