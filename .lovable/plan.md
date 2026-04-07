

## Simplify Mobile Hero & Reduce Redundancy

Four targeted changes, all mobile-only (desktop unchanged).

### 1. Remove "Make an offer" subtext from Hero
**`src/components/Hero.tsx`** — Hide the `<p>` tag on mobile using `hidden md:block` so it only shows on desktop.

### 2. Add bottom gradient overlay on Hero
**`src/components/Hero.tsx`** — Replace the flat `bg-black/30` overlay with a bottom-up gradient on mobile: `bg-gradient-to-t from-black/60 via-black/20 to-transparent`. Keep the existing flat overlay for desktop using responsive classes.

### 3. Hide TrustBar on mobile
**`src/components/TrustBar.tsx`** — Add `hidden md:block` to the outer `<section>` so the scrolling trust strip is only visible on desktop.

### 4. Add spacing between Hero and FeaturedCategories on mobile
**`src/pages/Index.tsx`** — Wrap the `<FeaturedCategories />` in a div with `mt-6 md:mt-0` (or similar) to add breathing room on mobile only.

### Files Modified
- `src/components/Hero.tsx` — hide subtext on mobile, add gradient overlay
- `src/components/TrustBar.tsx` — hide on mobile
- `src/pages/Index.tsx` — mobile spacing tweak

