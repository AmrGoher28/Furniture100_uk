import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReviewSummary {
  count: number;
  avgRating: number;
}

const STARS_MAP: Record<string, number> = {
  Positive: 5,
  Neutral: 3,
  Negative: 1,
};

let cachedSummaries: Record<string, ReviewSummary> | null = null;

export const useProductReviews = () => {
  const [summaries, setSummaries] = useState<Record<string, ReviewSummary>>(cachedSummaries || {});
  const [loaded, setLoaded] = useState(!!cachedSummaries);

  useEffect(() => {
    if (cachedSummaries) return;

    const fetch = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("product_handle, rating")
        .not("product_handle", "is", null);

      if (error || !data) return;

      const map: Record<string, ReviewSummary> = {};
      for (const row of data) {
        const handle = row.product_handle!;
        if (!map[handle]) map[handle] = { count: 0, avgRating: 0 };
        map[handle].count++;
        map[handle].avgRating += STARS_MAP[row.rating] || 5;
      }
      for (const key of Object.keys(map)) {
        map[key].avgRating = map[key].avgRating / map[key].count;
      }

      cachedSummaries = map;
      setSummaries(map);
      setLoaded(true);
    };
    fetch();
  }, []);

  return { summaries, loaded };
};
