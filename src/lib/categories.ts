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
    name: "Lounge Chairs",
    slug: "lounge-chairs",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    subcategories: [
      { name: "Lounge Chair and Ottoman Sets", slug: "lounge-chair-ottoman-sets" },
      { name: "Swivel Lounge Chairs", slug: "swivel-lounge-chairs" },
      { name: "Club Chairs", slug: "club-chairs" },
      { name: "Accent Chairs", slug: "accent-chairs" },
      { name: "Recliner Chairs", slug: "recliner-chairs" },
      { name: "Rocking Chairs", slug: "rocking-chairs" },
      { name: "Egg Chairs", slug: "egg-chairs" },
    ],
  },
  {
    name: "Sofas",
    slug: "sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    subcategories: [
      { name: "2 Seater Sofas", slug: "2-seater-sofas" },
      { name: "3 Seater Sofas", slug: "3-seater-sofas" },
      { name: "Sofa Beds", slug: "sofa-beds" },
      { name: "Loveseats", slug: "loveseats" },
    ],
  },
  {
    name: "Office Chairs",
    slug: "office-chairs",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
    subcategories: [
      { name: "Leather Office Chairs", slug: "leather-office-chairs" },
      { name: "Fabric Office Chairs", slug: "fabric-office-chairs" },
      { name: "Vintage Style Office Chairs", slug: "vintage-office-chairs" },
      { name: "Executive Chairs", slug: "executive-chairs" },
    ],
  },
  {
    name: "Dining",
    slug: "dining",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    subcategories: [
      { name: "Dining Chairs", slug: "dining-chairs" },
      { name: "Bar Stools", slug: "bar-stools" },
    ],
  },
  {
    name: "Mirrors",
    slug: "mirrors",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    subcategories: [
      { name: "Full Length Mirrors", slug: "full-length-mirrors" },
      { name: "Wall Mirrors", slug: "wall-mirrors" },
      { name: "Arched Mirrors", slug: "arched-mirrors" },
    ],
  },
  {
    name: "Lighting",
    slug: "lighting",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&q=80",
    subcategories: [
      { name: "Floor Lamps", slug: "floor-lamps" },
      { name: "Desk Lamps", slug: "desk-lamps" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    subcategories: [
      { name: "Drinks Trolleys", slug: "drinks-trolleys" },
      { name: "Coffee Tables", slug: "coffee-tables" },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
