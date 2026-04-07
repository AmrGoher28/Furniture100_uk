import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useProductOverrides(productHandle: string | undefined) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productHandle) return;
    const load = async () => {
      const { data } = await supabase
        .from("product_overrides")
        .select("field_key, field_value")
        .eq("product_handle", productHandle);
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r) => { if (r.field_value) map[r.field_key] = r.field_value; });
        setOverrides(map);
      }
    };
    load();
  }, [productHandle]);

  const saveOverride = useCallback(async (fieldKey: string, value: string) => {
    if (!productHandle) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("product_overrides")
        .upsert(
          { product_handle: productHandle, field_key: fieldKey, field_value: value },
          { onConflict: "product_handle,field_key" }
        );
      if (error) throw error;
      setOverrides((prev) => ({ ...prev, [fieldKey]: value }));
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  }, [productHandle]);

  return { overrides, saveOverride, loading };
}
