import { supabase } from "@/integrations/supabase/client";

export interface ProductCategoryMapping {
  id: string;
  product_handle: string;
  category_slug: string;
  subcategory_slug: string | null;
  is_best_seller: boolean;
}

export async function fetchAllMappings(): Promise<ProductCategoryMapping[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*");
  if (error) {
    console.error("Failed to fetch product categories:", error);
    return [];
  }
  return data as ProductCategoryMapping[];
}

export async function upsertMapping(
  product_handle: string,
  category_slug: string,
  subcategory_slug: string | null,
  is_best_seller: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from("product_categories")
    .upsert(
      { product_handle, category_slug, subcategory_slug, is_best_seller },
      { onConflict: "product_handle" }
    );
  if (error) {
    console.error("Failed to upsert product category:", error);
    return false;
  }
  return true;
}

export async function deleteMapping(product_handle: string): Promise<boolean> {
  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("product_handle", product_handle);
  if (error) {
    console.error("Failed to delete product category:", error);
    return false;
  }
  return true;
}

export async function fetchBestSellerHandles(): Promise<string[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("product_handle")
    .eq("is_best_seller", true);
  if (error) {
    console.error("Failed to fetch best sellers:", error);
    return [];
  }
  return (data || []).map((r) => r.product_handle);
}

export async function fetchMappingsByCategory(categorySlug: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("product_handle")
    .eq("category_slug", categorySlug);
  if (error) {
    console.error("Failed to fetch category mappings:", error);
    return [];
  }
  return (data || []).map((r) => r.product_handle);
}
