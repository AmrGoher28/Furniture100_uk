

# Redesign Navbar Layout — Centered Logo, Search Bar, Account Tab, Dark Categories

## Changes to `src/components/Navbar.tsx`

### Top Row — 3-column layout
```text
[ 🔍 Search bar ]     [ SWIFLIVING ]     [ Account | Cart ]
```

- **Left**: Search input with a search icon (using lucide `Search` icon). Styled minimal — border-bottom only or subtle rounded input matching the luxury aesthetic. Searches products (for now just UI, can wire to Shopify search later).
- **Center**: SWIFLIVING logo centered using flex justify-center
- **Right**: Account icon (lucide `User`) + existing CartDrawer. Move "About" link to footer or remove from top row.

### Category Row
- Change category text color from `text-muted-foreground` to `text-foreground` (black/near-black) so they're more visible
- Active state keeps the bark underline

### New state
- `searchQuery` state for the search input
- `searchOpen` state to toggle search on mobile (optional)

### Account tab
- For now, renders as a `User` icon button (no auth wired yet — placeholder that can link to a future login page)

## Files Changed
- `src/components/Navbar.tsx` — restructure top row, add search input, add account icon, darken category text

