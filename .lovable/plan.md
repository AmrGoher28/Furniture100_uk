## Goal

Push Furniture100 from "clean monochrome" to "Aesop / Apple-quiet". No new features, no palette changes — just sharper typography, more whitespace, calmer hierarchy, fewer competing elements.

Fully monochrome (white / #FAFAFA / #111 / #ECECEC border). Hero slider stays — refined, not replaced.

## 1. Homepage rhythm

Re-tune sections so each one feels deliberate and the page reads top-to-bottom like an editorial spread.

- **Hero** — refine the existing slider: looser headline tracking, slower (8s) crossfade, indicators reduced to two thin static lines, no hover-pause flicker.
- **TrustBar** — drop to a single quiet line under the hero (small caps, generous spacing, no icons on mobile, icons-as-hairlines on desktop). Currently competes with the hero.
- **FeaturedCategories** — rebuild as an editorial 3-up: large square category images, label below in small caps, no card chrome. Remove "Shop now" affordance — the whole tile is the link.
- **BestSellers** — section heading drops to a single left-aligned line with a thin "View all →" link top-right. Tighter 4-up grid on desktop, 2-up on mobile. Uses the new product card (see §2).
- **LifestyleBanner** — full-bleed editorial image with a single short line of copy (max-w-md) bottom-left. Remove dual-CTA pattern if present.
- **WhyChooseUs** — convert to a 3-column type-only band (no icons), generous py-32, hairline divider above and below.
- **CustomerReviews** — single featured quote large and centered, with three smaller quotes beneath. Removes the carousel feel.
- **Newsletter** — simplify to one centered line of copy + inline email field with a thin underline (no boxed card).
- Standardize section padding to `py-24 md:py-32` and remove any colored section backgrounds — everything sits on white with only `#FAFAFA` used as a deliberate separator (max 1–2 times on the page).

## 2. Product cards & grid

Currently borderless but still feels dense. Push toward Aesop restraint.

- Aspect ratio: square → **4/5 portrait** on desktop, square on mobile. Furniture looks better tall.
- Image background: `#FAFAFA`. No border, no shadow, no radius (or a near-imperceptible 2px).
- Hover: image scales to 1.04 over 900ms with `ease-out`. No overlay, no quick-add button on hover.
- Meta block under image: product name in `text-sm font-medium`, price in `text-sm text-muted-foreground` directly under it, both left-aligned. Single line each, truncated. **No badges, no star ratings, no "from £…" prefix on the card.**
- Grid: `gap-x-6 gap-y-16` (lots of vertical breathing room between rows). 2-up mobile / 3-up tablet / 4-up desktop.
- Category page hero: drop the dark image overlay band — replace with a single H1 + count line on white (`Lounge Chairs · 24 pieces`), no breadcrumb image.
- Filters/sort: move to a thin sticky bar with text-only triggers ("Filter" / "Sort by: Featured"), no pill chips, no icons.

## 3. Product detail page

Currently feature-rich; needs to feel like an editorial product page, not a spec sheet.

- **Layout**: image column 60%, details column 40% on desktop (currently 50/50). More image presence.
- **Gallery**: main image in 4/5 portrait, thumbnails moved below image as small squares with a hairline border on selected. Remove the "View All N" overlay on the last thumb.
- **Title block**: H1 in `text-2xl md:text-3xl`, price directly below in `text-xl font-normal` (not bold — bold price reads loud). Klarna line drops to `text-xs text-muted-foreground`.
- **Variant selectors**: text-only options separated by `·` for swatches/size, only switching to pill buttons when there are >4 options. Selected = underlined, unselected = muted.
- **Add to basket**: single full-width black pill, `h-14`. Quantity moves to a small stepper below it (not beside).
- **Trust badges / delivery banner / Klarna**: consolidate into one quiet 3-line block ("Free UK delivery · 30 day returns · Klarna available"), no icons.
- **Description**: drops the `DESCRIPTION` eyebrow label. Just the prose at `text-base leading-[1.7] max-w-prose`.
- **Specs & FAQ**: collapse into a single shadcn Accordion ("Details", "Dimensions", "Delivery & returns", "FAQ") — closed by default.
- **Reviews**: stays but tightens to a single quote-led layout matching homepage.
- **SimilarProducts**: uses the new card style from §2.
- **Mobile sticky bar**: thin bottom bar with price left, "Add to basket" right — no extra icons.

## 4. Navigation & footer

- **Navbar** — drop to `h-14`, logo in `tracking-[0.2em] text-sm font-medium uppercase`. Nav links in `text-xs uppercase tracking-[0.15em]` with a thin underline-on-hover (no color shift). Search and cart icons as 16px line icons only. Mega menu becomes a single full-width panel with type-only columns (no category thumbnails) — calmer than current.
- **Footer** — strip to 4 columns of small uppercase headings + plain text links, a single hairline divider, and a quiet bottom row with the legal line and a small "Furniture100" wordmark right-aligned. Remove any colored CTA, social icon row, or repeated newsletter form.

## 5. Motion & micro-interactions

- All scroll-reveal: opacity 0 → 1 + translateY(12px), 700ms ease-out, threshold 0.15. Already exists via `useReveal` — apply consistently to every section's top-level wrapper.
- Hover transitions standardized: `transition-[opacity,transform,color] duration-500 ease-out`.
- Remove any remaining `hover:scale-105`, `shadow-lg`, `backdrop-blur` from non-overlay surfaces.

## Out of scope

- No new pages, no new functionality, no copy rewrites beyond removing labels noted above.
- Shopify integration, cart store, auth, admin tools — untouched.
- No palette/font changes. No accent color introduced.

## Technical notes

- Edits land in: `Hero.tsx`, `TrustBar.tsx`, `FeaturedCategories.tsx`, `BestSellers.tsx`, `LifestyleBanner.tsx`, `WhyChooseUs.tsx`, `CustomerReviews.tsx`, `Newsletter.tsx`, `Footer.tsx`, `Navbar.tsx`, `ProductGrid.tsx`, `pages/CategoryPage.tsx`, `pages/ProductDetail.tsx`, plus the `product/*` subcomponents (`ProductTrustBadges`, `DeliveryBanner`, `ProductSpecs`, `ProductFAQ`). Consolidations may delete `ProductTrustBadges` + `DeliveryBanner` in favor of an inline 3-line block.
- A new shared `<SectionHeader>` component for the left-aligned heading + right-aligned link pattern used by BestSellers / SimilarProducts.
- A new shared `<ProductCard>` so the homepage, category grid, and similar-products all render identically (currently `ProductGrid.tsx` has its own card markup).
- Standardize on `useReveal` for entrance animations — remove any ad-hoc scroll/fade code.
