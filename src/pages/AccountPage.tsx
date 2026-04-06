import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, LogOut, Package, Trash2 } from "lucide-react";

const AccountPage = () => {
  const { user, loading, signOut } = useAuth();
  const { items: wishlistItems, loading: wishlistLoading, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="py-24 text-center text-muted-foreground">Loading...</div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <section className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1
                className="text-3xl md:text-4xl mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                My Account
              </h1>
              <p className="text-sm text-muted-foreground font-light">{user.email}</p>
            </div>
            <button
              onClick={async () => { await signOut(); navigate("/"); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Wishlist */}
          <div className="mb-12">
            <h2 className="flex items-center gap-2 text-lg font-medium mb-6">
              <Heart className="w-5 h-5 text-gold" />
              Saved Items
            </h2>
            {wishlistLoading ? (
              <p className="text-sm text-muted-foreground font-light">Loading...</p>
            ) : wishlistItems.length === 0 ? (
              <div className="bg-secondary/50 rounded-lg p-8 text-center">
                <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-light text-sm">No saved items yet</p>
                <Link to="/shop" className="text-gold text-sm hover:underline mt-2 inline-block">
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="group relative">
                    <Link to={`/product/${item.product_handle}`}>
                      <div className="aspect-square bg-secondary rounded-lg overflow-hidden mb-2">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <h3 className="text-xs font-light text-foreground line-clamp-2">{item.product_title}</h3>
                      {item.product_price && (
                        <p className="text-xs text-muted-foreground mt-0.5">£{parseFloat(item.product_price).toFixed(2)}</p>
                      )}
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.product_handle)}
                      className="absolute top-2 right-2 w-7 h-7 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders placeholder */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-medium mb-6">
              <Package className="w-5 h-5 text-gold" />
              Order History
            </h2>
            <div className="bg-secondary/50 rounded-lg p-8 text-center">
              <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-light text-sm">
                Orders placed through checkout will appear here
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1 font-light">
                Coming soon — orders sync from Shopify
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AccountPage;
