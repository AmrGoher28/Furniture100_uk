

# Hero Slideshow with Uploaded Images

## What Changes
Replace the static hero image in `src/components/Hero.tsx` with an auto-rotating slideshow using the 2 uploaded images + 1 Unsplash placeholder as a third slide.

## Steps

### 1. Copy uploaded images to project
- `user-uploads://replicate-prediction-pr3dd3y7sxrmy0cxbs3b66eskg.jpg` → `src/assets/hero-slide-1.jpg`
- `user-uploads://replicate-prediction-m8ax74v445rmr0cxbs09ct1sqc.jpg` → `src/assets/hero-slide-2.jpg`

### 2. Rebuild `src/components/Hero.tsx`
- Import both images from `@/assets/`
- Define a 3-slide array: slide 1 (lounge chairs), slide 2 (office/lounge), slide 3 (Unsplash lifestyle placeholder)
- Add `currentSlide` state with `useEffect` auto-advancing every 5 seconds
- Render all 3 images stacked absolutely, using `opacity` + `transition-opacity duration-1000` for smooth crossfade
- Navigation dots at the bottom (clickable, gold active dot)
- Text overlay stays the same on all slides
- Pause auto-rotation on hover (optional nice touch)

### Technical Detail
- Images imported as ES6 modules for Vite bundling
- No external carousel library needed — simple state + CSS transitions
- Accessible: dots have aria-labels, images have alt text

