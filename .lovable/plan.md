

# Add Category & Sub-Category Navigation

## Overview
Replace the current flat category filter with a two-tier navigation: main categories across the top, with sub-categories appearing below when a main category is selected.

## Category Hierarchy
```text
All
Office         → Desks, Office Chairs, Bookshelves
Dining Room    → Dining Tables, Dining Chairs, Sideboards
Living Room    → Sofas, Coffee Tables, TV Units, Shelving
Seating        → Armchairs, Accent Chairs, Benches, Stools
```

## Changes

### `src/components/ProductGrid.tsx`
- Replace `CATEGORIES` array with a `CATEGORIES` map containing main categories and their sub-categories
- Add `activeSubCategory` state (defaults to "All" within each category)
- Render main category bar as a full-width horizontal strip with uppercase labels, active state uses bark-brown bottom border
- When a main category (not "All") is selected, render a second row of sub-category pills below
- Update filtering logic: if sub-category is active, filter by sub-category term; if main category is active with no sub-category, filter by main category term; "All" shows everything
- On main category change, reset sub-category to null (show all within that category)
- Styling: consistent with luxury aesthetic — stone borders, bark accents, generous spacing, horizontally scrollable on mobile

No other files change.

