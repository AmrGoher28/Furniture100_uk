

# Add White Background to Navbar on Hover

## Change
In `src/components/Navbar.tsx`, make the navbar background switch to solid white/cream when a category is hovered (mega-menu is open). Currently it uses `bg-background/90 backdrop-blur-sm` always.

## File: `src/components/Navbar.tsx`
- Change the `<nav>` element's className to be conditional on `hoveredCategory`:
  - **No hover**: keep current `bg-background/90 backdrop-blur-sm`
  - **Hovering** (mega-menu open): switch to `bg-white` (or `bg-[hsl(var(--cream))]`) with a smooth transition
- Add `transition-colors duration-300` to the nav for a smooth background change

Single file change, ~2 lines modified.

