

## Redesign Category/Shop Page + Mobile 2-Column Grid

Two changes to `src/pages/CategoryPage.tsx`:

### 1. High-End Minimal Redesign
- **Product cards**: Remove "Add to Basket" buttons, star ratings, and `handleAddToCart`/`ShoppingBag`/`useProductReviews` imports. Cards show only image → name → price. Name: `text-sm font-light`, price: `text-sm text-muted-foreground font-normal`.
- **Image hover**: Replace `ProductImageCarousel` with a simple `<img>` that scales to 1.03 on hover and swaps to the second image if available (using `group-hover` + CSS opacity swap).
- **Hero banner**: Reduce height ~40% (`h-28 md:h-40`), lighter overlay, serif title (`font-serif font-normal text-2xl md:text-4xl`).
- **Sidebar**: Lighter font weights (`font-light`), more spacing (`space-y-3`), active state = underline instead of gold color. Remove "Subcategories" heading, nest them indented under parent.
- **Sort/count bar**: Smaller (`text-xs`), lighter color, less visual weight.
- **Spacing**: Increase grid gaps (`gap-8 md:gap-14`), more section padding (`py-12 md:py-20`), aspect ratio `aspect-[4/5]`.

### 2. Mobile 2-Column Grid
- Change `grid-cols-1 sm:grid-cols-2` → `grid-cols-2 lg:grid-cols-3` so mobile always shows 2 products side-by-side.
- Tighter gap on mobile (`gap-4 md:gap-14`).

### Also update the homepage ProductGrid
- In `src/components/ProductGrid.tsx`, change `grid-cols-1 md:grid-cols-2` → `grid-cols-2 lg:grid-cols-3` for consistent 2-column mobile grid across the site.

### Files Modified
- `src/pages/CategoryPage.tsx` — main redesign + mobile grid
- `src/components/ProductGrid.tsx` — mobile grid only (line 119)

