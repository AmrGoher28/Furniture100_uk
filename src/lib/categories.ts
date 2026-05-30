import categoryLoungeChairs from "@/assets/category-lounge-chairs.png";
import categorySofas from "@/assets/category-sofas.webp";
import categoryOfficeChairs from "@/assets/category-office-chairs.webp";
import categoryDining from "@/assets/category-dining.webp";
import categoryMirrors from "@/assets/category-mirrors.webp";
import categoryBarStools from "@/assets/category-bar-stools.png";

export interface SubCategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  subcategories: SubCategory[];
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "Accent & Lounge Chairs",
    slug: "lounge-chairs",
    image: categoryLoungeChairs,
    subcategories: [
      { name: "Swivel Lounge Chairs", slug: "swivel-lounge-chairs" },
      { name: "Club Chairs", slug: "club-chairs" },
      { name: "Accent Chairs", slug: "accent-chairs" },
      { name: "Recliner Chairs", slug: "recliner-chairs" },
    ],
  },
  {
    name: "Office Chairs",
    slug: "office-chairs",
    image: categoryOfficeChairs,
    subcategories: [
      { name: "Leather Office Chairs", slug: "leather-office-chairs" },
      { name: "Fabric Office Chairs", slug: "fabric-office-chairs" },
      { name: "Executive Chairs", slug: "executive-chairs" },
    ],
  },
  {
    name: "Dining Chairs",
    slug: "dining-chairs",
    image: categoryDining,
    subcategories: [
      { name: "Wooden Dining Chairs", slug: "wooden-dining-chairs" },
      { name: "Velvet Dining Chairs", slug: "velvet-dining-chairs" },
      { name: "Boucle Dining Chairs", slug: "boucle-dining-chairs" },
    ],
  },
  {
    name: "Bar Stools",
    slug: "bar-stools",
    image: categoryBarStools,
    subcategories: [
      { name: "Counter Stools", slug: "counter-stools" },
      { name: "Swivel Bar Stools", slug: "swivel-bar-stools" },
      { name: "Velvet Bar Stools", slug: "velvet-bar-stools" },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
