# Furniture100 — Monochrome Premium Redesign

Visual/UX overhaul only. All routes, products, cart, auth, admin, Shopify integration, and business logic stay exactly as-is. No component APIs change — only styles, tokens, typography, spacing, and a few structural tweaks to hero/nav/grid.

> Note: this replaces the current warm-walnut + Playfair direction saved in project memory. I'll update memory after you approve.

## Design tokens (the foundation)

Rewrite `src/index.css` `:root` so every existing semantic class flips to monochrome automatically — no component-by-component color hunt needed.

- `--background`: `#FFFFFF`
- `--surface / --card / --secondary / --muted`: `#FAFAFA`
- `--foreground`: `#111111`
- `--muted-foreground`: neutral gray `#6B6B6B`
- `--border / --input`: `#ECECEC`
- `--primary`: `#111111` (solid black buttons), `--primary-foreground`: `#FFFFFF`
- `--accent`: single restrained accent — **proposed: same near-black `#111`** so the palette stays truly monochrome. If you'd like one color accent (e.g. a signal red `#E11900` Nike-style, or a deep blue), tell me which and I'll wire it in.
- Retire `--walnut`, `--walnut-dark`, `--gold`, warm shadows. Keep the token names in `tailwind.config.ts` so existing `text-gold` / `bg-walnut` references compile, but remap them to neutrals (gold → foreground, walnut → foreground) to avoid touching every file.
- Radius: `--radius: 9999px` for buttons (pill), `0.5rem` elsewhere via utility overrides.

## Typography

- Swap Playfair Display → **Inter** (already loaded by Tailwind defaults; add `@import` for weights 300/400/500/700 in `index.html`).
- Body: Inter 400, line-height 1.6.
- Headings: Inter 600–700, tight tracking (`-0.02em`), large scale. Update the `h1..h6` block in `index.css`.
- Hero H1: ~clamp(2.5rem, 6vw, 5.5rem), tracking tighter.

## Layout & components

1. **Navbar** (`src/components/Navbar.tsx`)
   - Transparent over hero on the home route; solid white + subtle bottom border once scrolled (`scrolled` state already exists — just restyle).
   - Logo wordmark restyled in Inter (drop the serif + gold "100" accent, keep text "FURNITURE100").
   - Remove backdrop-blur tint; use plain `bg-white` when scrolled, `bg-transparent` over hero.
   - Icons: thinner stroke, black, generous spacing.

2. **Hero** (`src/components/Hero.tsx`)
   - Keep slideshow logic and LCP `<picture>` setup (don't regress earlier SEO fixes).
   - Full-bleed (100vw, ~90vh on desktop, 70vh mobile). Remove the dark overlay or reduce to a very soft 10% bottom-gradient only if legibility requires.
   - One short headline + one pill CTA. Drop the secondary "Don't like the price?" line from the hero (it can live elsewhere if you want — confirm).
   - Dots → minimal thin lines bottom-left, monochrome.

3. **Product grid / cards** (`src/components/ProductGrid.tsx`, `BestSellers`, `FeaturedCategories`, `SimilarProducts`, category & shop pages)
   - Remove borders, shadows, card backgrounds. Just image (square or 4:5), name, price.
   - Generous gap (`gap-x-8 gap-y-14`).
   - Hover: gentle image scale `1.03` over 500ms, no shadow.

4. **Sections** (Index page bands: TrustBar, FeaturedCategories, BestSellers, LifestyleBanner, WhyChooseUs, CustomerReviews, Newsletter)
   - Standardize vertical padding `py-24 md:py-32`, max-width `max-w-7xl mx-auto px-6`.
   - Section headings left-aligned, large, with a short sub-label above in uppercase tracked text.
   - Strip decorative dividers and warm shadows.

5. **Buttons** — update `src/components/ui/button.tsx` variants:
   - `default`: solid black, white text, pill (`rounded-full`), `px-8 h-12`, hover `bg-neutral-800`.
   - `outline`: 1px black border, transparent, pill, hover invert.
   - Remove `destructive` color shifts where used for primary actions on storefront (admin keeps semantic destructive).

6. **Footer** — flatten to white background, black text, thin top border, single-column on mobile.

7. **Announcement bar** — black background, white text, tight, dismissible behavior unchanged.

## Motion

Add lightweight scroll-reveal via a tiny IntersectionObserver hook (reuse existing `LazySection` pattern) applied to section wrappers: opacity 0 → 1, translateY 16px → 0, 600ms ease-out, once. No library needed.

## What I will NOT touch

- Routing, data fetching, Shopify calls, cart store, auth, admin pages logic, edge functions, Supabase schema.
- File names, exports, props.
- Earlier SEO/perf work: lazy routes in `App.tsx`, deferred gtag, preconnects, preloaded LCP image, `<picture>` srcset.
- Product detail page internals (will only restyle surface — typography, spacing, buttons).

## Files to edit

```
src/index.css                         tokens, fonts, base styles
index.html                            Inter font link (replace Playfair link)
tailwind.config.ts                    remap walnut/gold to neutrals, add tracking scale
src/components/ui/button.tsx          pill + monochrome variants
src/components/Navbar.tsx             transparent-over-hero, restyled logo
src/components/AnnouncementBar.tsx    black bar
src/components/Hero.tsx               full-bleed, simplified copy, minimal dots
src/components/TrustBar.tsx           flat monochrome
src/components/FeaturedCategories.tsx clean cards
src/components/BestSellers.tsx        borderless grid
src/components/ProductGrid.tsx        borderless cards, hover zoom
src/components/LifestyleBanner.tsx    full-bleed image + minimal text
src/components/WhyChooseUs.tsx        large type, generous spacing
src/components/CustomerReviews.tsx    simplified
src/components/Newsletter.tsx         minimal input + pill button
src/components/Footer.tsx             flattened
src/components/LazySection.tsx        add reveal animation variant (or new useReveal hook)
src/pages/ShopAll.tsx, CategoryPage.tsx, ProductDetail.tsx   spacing/typography pass
mem://index.md                        update saved design direction
```

## Questions before I build

1. **Accent color**: pure monochrome (recommended, most Apple-like), or one restrained accent like a signal red, deep blue, or a single warm hue for sale/CTA highlights?
2. **Hero secondary line** ("Don't like the price? Make an offer.") — drop from hero, move to a dedicated band, or keep but restyled?
3. **Logo treatment**: keep wordmark "FURNITURE100" in Inter bold, or want me to render just "F100" / a different mark?
