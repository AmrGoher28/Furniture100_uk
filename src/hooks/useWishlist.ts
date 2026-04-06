import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  product_handle: string;
  product_title: string;
  product_image: string | null;
  product_price: string | null;
  created_at: string;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("wishlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setItems((data as WishlistItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (product: {
    handle: string;
    title: string;
    image?: string;
    price?: string;
  }) => {
    if (!user) {
      toast.error("Please sign in to save items");
      return false;
    }
    const { error } = await supabase.from("wishlists").insert({
      user_id: user.id,
      product_handle: product.handle,
      product_title: product.title,
      product_image: product.image || null,
      product_price: product.price || null,
    });
    if (error) {
      if (error.code === "23505") {
        toast.info("Already in your wishlist");
      } else {
        toast.error("Failed to save item");
      }
      return false;
    }
    toast.success("Added to wishlist");
    fetchWishlist();
    return true;
  };

  const removeFromWishlist = async (productHandle: string) => {
    if (!user) return;
    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_handle", productHandle);
    setItems((prev) => prev.filter((i) => i.product_handle !== productHandle));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productHandle: string) =>
    items.some((i) => i.product_handle === productHandle);

  return { items, loading, addToWishlist, removeFromWishlist, isInWishlist };
};
