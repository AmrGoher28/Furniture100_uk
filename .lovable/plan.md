

# Fix Product Page & Homepage Overlap Issues

Four issues to address:

## 1. Show Add to Basket on mobile product page
The desktop "Add to Basket" button has `hidden md:flex` — invisible on mobile. The mobile sticky bar at the bottom exists but may be obscured. Fix: make the main Add to Basket button visible on all screen sizes (remove `hidden md:flex`, use `flex`). Keep the mobile sticky bar as well for convenience while scrolling.

## 2. Better image navigation on product page
Add left/right arrow buttons over the main product image for easy toggling (especially on mobile where thumbnails are small). Arrows appear on hover (desktop) or always visible (mobile).

## 3. Remove Klarna reference
Delete the "From £X/month with Klarna. Learn more" line and the `klarnaMonthly` calculation.

## 4. Fix announcement bar / navbar overlap on homepage
The Navbar is `fixed top-0` but the AnnouncementBar sits in normal document flow above it inside Layout. On hero pages, no top padding is applied, so the Navbar covers the AnnouncementBar and both overlap the hero content.

**Fix**: Make the AnnouncementBar part of the fixed header stack. Move it inside the Navbar component (or make it fixed too) and offset the Navbar below it. Alternatively, give the Navbar `top` equal to the announcement bar height (~40px) and add matching padding to the Layout.

**Approach**: 
- Make AnnouncementBar fixed with `fixed top-0 left-0 right-0 z-50`
- Navbar gets `top-10` (40px, the bar height) instead of `top-0`
- Layout padding accounts for both: `pt-[104px] md:pt-[112px]` for non-hero pages
- Hero page gets negative margin or the hero starts below the combined header height

## Files Changed

| File | Change |
|------|--------|
| `src/pages/ProductDetail.tsx` | Show Add to Basket on mobile, add image arrows, remove Klarna |
| `src/components/AnnouncementBar.tsx` | Make fixed positioning |
| `src/components/Navbar.tsx` | Offset top to sit below announcement bar |
| `src/components/Layout.tsx` | Update padding to account for both fixed bars |

