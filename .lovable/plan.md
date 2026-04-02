

# Redesign Mega-Menu — Column Layout with Promotional Images, Remove Hero Slideshow

## Overview
Redesign the mega-menu dropdown to match the reference image: sub-categories displayed as vertical column lists with headings, plus two promotional image cards on the right side. Remove the hero image-change-on-hover behavior entirely.

## Changes

### 1. `src/components/Navbar.tsx`
- Redesign the mega-menu dropdown from a single horizontal row to a two-section layout:
  - **Left side**: Sub-categories listed vertically as clickable links (styled like the reference — normal case, light weight, with a heading underline)
  - **Right side**: Two promotional image cards with "EXPLORE" label and category name overlaid (Unsplash images matching the hovered category)
- Background changes from dark/blurred to a clean white/cream (`bg-[hsl(var(--cream))]`) to match the reference aesthetic
- Sub-category text changes from white uppercase to dark body text, more readable
- Add a subtle border-top and drop shadow for the dropdown
- Remove `onCategoryHover` prop — no longer needed

### 2. `src/components/Hero.tsx`
- Remove `hoveredCategory` prop and all slideshow logic
- Revert to a single static background image (the default sofa shot)
- Remove `CATEGORY_IMAGES` map, `useEffect`, `setInterval`, and crossfade code
- Keep the dark overlay and hero text as-is

### 3. `src/pages/Index.tsx`
- Remove `hoveredCategory` state
- Stop passing `onCategoryHover` to Navbar and `hoveredCategory` to Hero

### 4. `src/pages/ProductDetail.tsx`
- Remove `onCategoryHover` prop from Navbar usage

## Mega-Menu Layout per Category
```text
┌──────────────────────────────────────────────────────────────┐
│  Sub-cat 1        Sub-cat 2        │  [Image: EXPLORE]  [Image: EXPLORE]  │
│  ─────────        ─────────        │   category item 1   category item 2  │
│  item              item            │                                      │
│  item              item            │                                      │
│  item              item            │                                      │
│                                    │                                      │
│  [Shop Category →]                 │                                      │
└──────────────────────────────────────────────────────────────┘
```

Each category gets two curated Unsplash promo images with overlay text.

## Promotional Images Map
- **Office**: desk setup + bookshelf scene
- **Dining Room**: dining set + dining chairs
- **Living Room**: sofa scene + coffee table vignette
- **Seating**: armchair + accent chair

