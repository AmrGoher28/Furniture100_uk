

# Add Subtle Dark Overlays to Image Sections

## Problem
Text over images (Hero, Lifestyle Banner, Category cards) can be hard to read depending on the image brightness. No overlays currently exist.

## Changes

### 1. Hero — full dark overlay
**`src/components/Hero.tsx`**
- Add a `<div className="absolute inset-0 bg-black/30 z-[1]" />` after the image slides
- Bump the text content `z-10` stays above (already is)

### 2. Lifestyle Banner — full dark overlay
**`src/components/LifestyleBanner.tsx`**
- Add `<div className="absolute inset-0 bg-black/35" />` after the `<img>`
- Text already has `z-10`

### 3. Featured Categories — bottom gradient on each card
**`src/components/FeaturedCategories.tsx`**
- Replace the plain `<div className="absolute bottom-0 ...">` wrapper with a gradient overlay: `<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">`
- This ensures category names are always readable regardless of the image

All overlays are subtle (30-35% black for full overlays, 60% gradient for card bottoms) to maintain the luxury aesthetic.

