

# Move Categories to Navbar + Add Furniture Imagery

## What Changes

### 1. Navbar with category navigation
Move the main category links (All, Office, Dining Room, Living Room, Seating) into the Navbar as a second row beneath the logo bar. Clicking a category scrolls to the collection section and filters products. The Navbar becomes two rows:
- **Top row**: SWIFLIVING logo | About link + Cart icon
- **Bottom row**: Category links (All, Office, Dining Room, Living Room, Seating) — horizontally centered, same uppercase styling

Sub-categories remain in the ProductGrid section, appearing below the section header when a non-"All" category is active.

### 2. Hero with furniture background image
Replace the plain `bg-muted/30` overlay with a high-quality Unsplash furniture/interior photo as a full-bleed background. Add a dark overlay so the white text remains legible. This eliminates the "too white" feel immediately.

### 3. Lifestyle image strips between sections
Add 1-2 full-width lifestyle furniture images (from Unsplash) between the product grid and the About section — editorial-style image breaks that add warmth and visual richness.

## Files to Change

- **`src/components/Navbar.tsx`** — Add second row with category links; accept `activeCategory` + `onCategoryChange` props (lifted state)
- **`src/components/Hero.tsx`** — Add Unsplash background image with dark overlay
- **`src/components/ProductGrid.tsx`** — Remove the main category bar (keep sub-categories only); accept `activeCategory` as prop
- **`src/pages/Index.tsx`** — Lift `activeCategory` state here, pass to Navbar and ProductGrid; add a lifestyle image section between ProductGrid and About

## Technical Details
- Category state lifted to `Index.tsx` so Navbar and ProductGrid share it
- Navbar category click: sets active category + smooth-scrolls to `#collection`
- Unsplash images used via direct URL (free, no API key needed) — curated furniture/interior shots
- Navbar height increases slightly to accommodate two rows; hero padding adjusted accordingly

