

# Hover Mega-Menu + Hero Slideshow

## Overview
When hovering over a category (Office, Dining Room, etc.) in the navbar, a dropdown overlay appears showing sub-categories. Simultaneously, the Hero background image changes to match the hovered category with a smooth crossfade slideshow effect.

## Changes

### 1. `src/components/Navbar.tsx`
- Add `hoveredCategory` state
- On hover of a category button, show a dropdown panel beneath the category row (absolute positioned, full-width, semi-transparent dark background with backdrop-blur)
- Dropdown displays the sub-categories as clickable links in a horizontal row, styled with the luxury aesthetic
- On mouse leave from the navbar/dropdown area, hide the panel
- Pass `hoveredCategory` up to parent via a new `onCategoryHover` callback prop

### 2. `src/components/Hero.tsx`
- Accept `hoveredCategory` prop
- Define a map of category → array of Unsplash image URLs (curated furniture shots per category: office desks, dining tables, sofas, accent chairs, etc.)
- Default: current sofa image
- On hover: crossfade slideshow cycles through 3-4 images for the hovered category using `setInterval` + CSS opacity transitions
- Clean up interval on category change or mouse leave

### 3. `src/pages/Index.tsx`
- Add `hoveredCategory` state, pass down to both `Navbar` (callback) and `Hero` (display)

### 4. `src/pages/ProductDetail.tsx`
- Pass dummy/no-op `onCategoryHover` prop to Navbar

## Category Images
- **Office**: Modern desks, office setups
- **Dining Room**: Dining tables, elegant place settings
- **Living Room**: Sofas, cozy living spaces
- **Seating**: Accent chairs, armchairs, benches
- **Default/All**: Current hero image

## UX Details
- Dropdown uses `animate-fade-in` for smooth entry
- Hero images crossfade with CSS `opacity` transition (duration ~700ms)
- Slideshow interval: ~3 seconds per image while hovering
- Sub-category click: sets active category + sub-category, scrolls to collection, closes dropdown

