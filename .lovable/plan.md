

# Center the Last Category Card on Mobile

## Problem
With 5 category cards in a 2-column mobile grid, the 5th card (Dining) sits alone on the bottom-left, looking unbalanced.

## Solution
Make the last (odd) item span the full row and limit its width to match the other cards, centering it with `mx-auto`. This keeps the 2-column layout for the first 4 items and centers the 5th.

## Changes

**`src/components/FeaturedCategories.tsx`**
- Wrap the map to conditionally add `col-span-2 max-w-[calc(50%-0.5rem)] mx-auto` on the last item when the total count is odd, but only on mobile (use responsive classes so it resets on `lg:` where it's a 5-column grid).

