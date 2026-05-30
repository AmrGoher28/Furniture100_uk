import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { fetchProductsPage, ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { fetchAllMappings, upsertMapping, deleteMapping, ProductCategoryMapping } from "@/lib/productCategories";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Save, Trash2, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface RowState {
  category_slug: string;
  subcategory_slug: string;
  is_best_seller: boolean;
  dirty: boolean;
  saving: boolean;
}

const AUTH_REQUIRED_MESSAGE = "Please sign in on this site before saving category changes";

const AdminCategories = () => {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [mappings, setMappings] = useState<ProductCategoryMapping[]>([]);
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const mapsPromise = fetchAllMappings();
        let allProducts: ShopifyProduct[] = [];
        let cursor: string | null = null;
        let hasNext = true;

        while (hasNext) {
          const { products: page, pageInfo } = await fetchProductsPage(250, cursor);
          allProducts = [...allProducts, ...page];
          hasNext = pageInfo.hasNextPage;
          cursor = pageInfo.endCursor;
        }

        const maps = await mapsPromise;
        const prods = allProducts;
        setProducts(prods);
        setMappings(maps);

        const initial: Record<string, RowState> = {};
        prods.forEach((p) => {
          const handle = p.node.handle;
          const existing = maps.find((m) => m.product_handle === handle);
          initial[handle] = {
            category_slug: existing?.category_slug || "",
            subcategory_slug: existing?.subcategory_slug || "",
            is_best_seller: existing?.is_best_seller || false,
            dirty: false,
            saving: false,
          };
        });
        setRows(initial);
      } catch (e) {
        console.error("Failed to load:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateRow = (handle: string, partial: Partial<RowState>) => {
    setRows((prev) => ({
      ...prev,
      [handle]: { ...prev[handle], ...partial, dirty: true },
    }));
  };

  const handleSave = async (handle: string) => {
    if (!user) {
      toast.error(AUTH_REQUIRED_MESSAGE);
      return;
    }

    const row = rows[handle];
    if (!row || !row.category_slug) {
      toast.error("Please select a category first");
      return;
    }

    setRows((prev) => ({ ...prev, [handle]: { ...prev[handle], saving: true } }));
    const ok = await upsertMapping(handle, row.category_slug, row.subcategory_slug || null, row.is_best_seller);

    if (ok) {
      toast.success("Saved");
      setRows((prev) => ({ ...prev, [handle]: { ...prev[handle], saving: false, dirty: false } }));
    } else {
      toast.error("Failed to save");
      setRows((prev) => ({ ...prev, [handle]: { ...prev[handle], saving: false } }));
    }
  };

  const handleRemove = async (handle: string) => {
    if (!user) {
      toast.error(AUTH_REQUIRED_MESSAGE);
      return;
    }

    const ok = await deleteMapping(handle);
    if (ok) {
      toast.success("Mapping removed");
      setRows((prev) => ({
        ...prev,
        [handle]: { category_slug: "", subcategory_slug: "", is_best_seller: false, dirty: false, saving: false },
      }));
    } else {
      toast.error("Failed to remove");
    }
  };

  const getSubcategories = (catSlug: string) => {
    const cat = CATEGORIES.find((c) => c.slug === catSlug);
    return cat?.subcategories || [];
  };

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const unassigned = products.filter((p) => !rows[p.node.handle]?.category_slug);
  const assigned = products.filter((p) => rows[p.node.handle]?.category_slug);

  return (
    <Layout>
      <section className="py-8 md:py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl mb-2">Product Category Manager</h1>
          <p className="text-muted-foreground mb-4">
            Assign products to categories. {unassigned.length > 0 && (
              <span className="text-destructive font-medium">{unassigned.length} unassigned</span>
            )}
          </p>

          {!user && (
            <div className="mb-6 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground">
              You&apos;re currently not signed in on this site, so saves will be blocked. Sign in first, then come back here to manage categories.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Subcategory</th>
                  <th className="pb-3 pr-4 font-medium text-center">Best Seller</th>
                  <th className="pb-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...unassigned, ...assigned].map((product) => {
                  const handle = product.node.handle;
                  const row = rows[handle];
                  const image = product.node.images.edges[0]?.node;
                  const isUnassigned = !row?.category_slug;
                  const subs = row?.category_slug ? getSubcategories(row.category_slug) : [];

                  return (
                    <tr
                      key={handle}
                      className={`border-b transition-colors ${isUnassigned ? "bg-destructive/5" : ""}`}
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={image.url}
                              alt={product.node.title}
                              className="w-10 h-10 rounded object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                              -
                            </div>
                          )}
                          <span className="font-medium truncate max-w-[200px]">{product.node.title}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={row?.category_slug || ""}
                          onChange={(e) => updateRow(handle, { category_slug: e.target.value, subcategory_slug: "" })}
                          className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm"
                        >
                          <option value="">- Select -</option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={row?.subcategory_slug || ""}
                          onChange={(e) => updateRow(handle, { subcategory_slug: e.target.value })}
                          disabled={subs.length === 0}
                          className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm disabled:opacity-50"
                        >
                          <option value="">- None -</option>
                          {subs.map((sub) => (
                            <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={row?.is_best_seller || false}
                            onCheckedChange={(v) => updateRow(handle, { is_best_seller: v })}
                          />
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSave(handle)}
                            disabled={!row?.dirty || row?.saving}
                            className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 transition-colors"
                            title={user ? "Save" : AUTH_REQUIRED_MESSAGE}
                          >
                            {row?.saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : row?.dirty ? (
                              <Save className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </button>
                          {!isUnassigned && (
                            <button
                              onClick={() => handleRemove(handle)}
                              className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                              title={user ? "Remove mapping" : AUTH_REQUIRED_MESSAGE}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminCategories;
