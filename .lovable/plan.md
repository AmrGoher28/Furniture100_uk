

# Premium Visual Overhaul — Furniture100

This is a comprehensive visual refinement across the entire site covering typography, colors, spacing, hero, product cards, navigation, footer, and trust signals. All 8 points addressed in one pass.

---

## 1. Typography & Spacing

**`src/index.css`**
- Keep Playfair Display for headings, Inter for body (already set)
- Set body `line-height: 1.6` and `font-weight: 300`
- Add a utility for generous section spacing

**All section components** — increase vertical padding from `py-16 md:py-24` to `py-20 md:py-28` across: FeaturedCategories, BestSellers, WhyChooseUs, CustomerReviews, SocialFeed, Newsletter, LifestyleBanner

## 2. Hero Section — Left-aligned, commanding

**`src/components/Hero.tsx`**
- Left-align all text (`text-left`, positioned left within a 2-column or max-w layout)
- Larger heading: `text-5xl md:text-7xl lg:text-8xl`
- Reduce subtitle text, keep it short and understated
- Single CTA button — solid muted tone (charcoal/dark with subtle border), remove the secondary "View Best Sellers" button
- Stronger dark gradient overlay (left-to-right gradient for left-aligned text readability)

## 3. Colour Palette

**`src/index.css`** — update CSS variables:
- `--background`: warm off-white `40 33% 98%` (≈ #FAF8F5) instead of current value
- `--foreground`: deep charcoal `0 0% 17%` (≈ #2C2C2C) instead of pure near-black
- `--secondary`: warmer warm-grey `40 10% 95%`
- Keep gold accent as-is (already warm/muted)
- Remove any saturated/neon colors (none currently present, just confirm)
- `--card`: warm white to match background feel

## 4. Product Cards — Minimal, elegant

**`src/components/BestSellers.tsx`** (and any product grid)
- Change aspect ratio from `aspect-square` to `aspect-[4/5]`
- Remove rounded-lg borders, use `rounded-sm` or none
- Remove the "Add to Basket" button from card face — show only product name and price
- Add subtle hover: image scales to 1.03, card gets light shadow elevation
- Generous padding below image for text
- Clean sans-serif font for product name (already Inter)

## 5. Navigation — Clean & minimal

**`src/components/Navbar.tsx`**
- Remove the phone number top bar entirely
- Logo left, centered links (Shop, About, Contact — remove "Home", just use logo), cart/search/account right
- Remove background color — transparent initially. Add a scroll listener: on scroll > 10px, add `bg-background/95 backdrop-blur-sm` and border
- Cleaner logo with `tracking-[0.15em] uppercase` styling
- Categories dropdown stays on hover, but not shown as a top-level nav item text — integrate under "Shop" or keep as separate hover
- Keep hamburger menu on mobile only

## 6. Footer — Dark & professional

**`src/components/Footer.tsx`**
- Background: `bg-[#1A1A1A]` (near-black)
- Text: light grey `text-neutral-400`
- 4 columns: Shop, Company, Support, Newsletter signup
- Social icons as simple monochrome lucide icons (Instagram, Facebook, Pinterest)
- Thin `border-t border-neutral-800` separator
- Small consistent font sizes throughout
- Payment icons in muted grey at bottom

## 7. Consistency & Polish

- All buttons: consistent `rounded-md` (6px), same padding `px-6 py-3`
- All hover states: `transition-all duration-300 ease-in-out`
- Product images within sections use consistent aspect ratios
- Remove placeholder review text, replace with believable sample reviews
- Trust bar icons use consistent muted styling

## 8. Trust Bar — Slim & elegant

**`src/components/TrustBar.tsx`**
- Slim single row, light background (warm off-white or transparent)
- Small uppercase text, muted color, letter-spacing
- Minimal line icons in muted-foreground color (not gold)
- 4 items only: Free Delivery, 30-Day Returns, Secure Checkout, UK Nationwide
- Reduce vertical padding to `py-4 md:py-5`

---

## Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Background to warm off-white, foreground to charcoal, body line-height 1.6, font-weight 300 |
| `src/components/Hero.tsx` | Left-aligned, single CTA, gradient overlay, larger type |
| `src/components/Navbar.tsx` | Remove phone bar, transparent-on-top with scroll effect, cleaner links |
| `src/components/Footer.tsx` | Dark bg #1A1A1A, 4 columns, monochrome social icons, newsletter column |
| `src/components/TrustBar.tsx` | Slim, 4 items, muted uppercase, smaller padding |
| `src/components/BestSellers.tsx` | 4:5 cards, no add-to-basket button, hover scale 1.03, name+price only |
| `src/components/FeaturedCategories.tsx` | Increased section spacing |
| `src/components/WhyChooseUs.tsx` | Increased spacing, consistent transitions |
| `src/components/CustomerReviews.tsx` | Real-looking sample reviews, spacing bump |
| `src/components/SocialFeed.tsx` | Spacing bump |
| `src/components/Newsletter.tsx` | Spacing bump |
| `src/components/LifestyleBanner.tsx` | Spacing bump |

