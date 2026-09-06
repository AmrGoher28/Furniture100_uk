import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PublicReview {
  id: string;
  product_handle: string | null;
  rating: number | null;
  title: string | null;
  body: string | null;
  author_name: string | null;
  source: string | null;
  source_label: string | null;
  variant_label: string | null;
  verified: boolean | null;
  incentivised: boolean | null;
  reviewed_at: string | null;
  images: string[] | null;
  country: string | null;
  helpful_up: number | null;
  helpful_down: number | null;
}

export function useProductReviews(productHandle: string | undefined) {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productHandle) return;

    const load = async () => {
      setLoading(true);
      try {
        const { data: groupRow } = await supabase
          .from("product_overrides")
          .select("field_value")
          .eq("product_handle", productHandle)
          .eq("field_key", "review_group")
          .maybeSingle();

        const group = groupRow?.field_value || productHandle;

        const { data: handleRows } = await supabase
          .from("product_overrides")
          .select("product_handle")
          .eq("field_key", "review_group")
          .eq("field_value", group);

        const handles = handleRows?.length
          ? handleRows.map((r) => r.product_handle)
          : [productHandle];

        const { data } = await supabase
          .from("product_reviews_public")
          .select("*")
          .in("product_handle", handles)
          .order("reviewed_at", { ascending: false });

        setReviews((data as PublicReview[] | null) || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productHandle]);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  return { reviews, average, count: reviews.length, loading };
}
