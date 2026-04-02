

# Fix Navbar Hover Background — Missing CSS Variable

## Problem
The `--cream` CSS custom property is referenced in the Navbar but never defined in `src/index.css`. This means `bg-[hsl(var(--cream))]` resolves to transparent, making the navbar invisible on hover.

## Fix

### `src/index.css`
Add the missing custom properties to `:root`:
```css
--cream: 34 33% 97%;
--stone: 28 18% 70%;
--bark: 24 20% 29%;
--near-black: 0 0% 10%;
```

These match the brand palette (cream #FAF8F5, stone #C4B5A3, bark #5C4A3A, near-black #1A1A1A) converted to HSL without the `hsl()` wrapper, consistent with how shadcn variables are defined.

No other files need changes.

