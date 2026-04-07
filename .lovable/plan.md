

## 1. Klarna Payment Messaging on Product Page

**File: `src/pages/ProductDetail.tsx`**

Replace the current minimal Klarna line (line 213-215) with an enhanced component:
- Show "Or 3 interest-free payments of **£XX.XX** with [Klarna logo]"
- Calculate dynamically: `(price / 3).toFixed(2)`
- Style: `text-xs text-muted-foreground` — slightly smaller than price
- "Klarna" text links to a small popover/dialog explaining how Klarna works (pay in 3, no interest, soft credit check)
- Use a small inline Klarna pink logo (SVG or text badge)
- Add a `useState` for the modal open state, use the existing `Dialog` component for the explainer

**New: `src/components/KlarnaInfo.tsx`**
- Small reusable component containing:
  - The Klarna messaging line with dynamic price
  - A `Dialog` modal triggered by clicking "Klarna" / "Learn more"
  - Modal content: brief explanation of Klarna Pay in 3 (3 equal payments, no interest, example breakdown)
  - Styled minimal and on-brand

---

## 2. Font Consistency Audit & Fixes

**Root styles are correct** in `src/index.css`: Playfair Display for headings, Inter 300 for body. The issue is inline `style={{ fontFamily: ... }}` overrides scattered across components that sometimes conflict or are redundant.

**Files to fix:**

| File | Issue | Fix |
|---|---|---|
| `src/pages/ProductDetail.tsx` line 210 | Price has explicit `fontFamily: Inter` — redundant (body default) | Remove `style` attr |
| `src/pages/AboutPage.tsx` line 48 | Value card headings forced to Inter — these are `<h3>` so should be Playfair per brand | Remove `style` attr, let CSS handle it |
| `src/pages/AboutPage.tsx` line 61 | Stats forced to Playfair — redundant for `<p>` used as display text | Keep but ensure consistent |
| `src/components/WhyChooseUs.tsx` line 37 | `<h3>` forced to Inter — should be Playfair | Remove `style` attr |
| `src/components/BestSellers.tsx` line 89 | `<h3>` forced to Inter — should be Playfair | Remove `style` attr |
| `src/components/Footer.tsx` line 10 | Brand name forced to Playfair — redundant but harmless | Keep (it's a `<span>` not heading) |
| `src/components/Navbar.tsx` lines 64, 112 | Brand name forced to Playfair — redundant but harmless | Keep (it's a `<span>`) |
| `src/pages/AuthPage.tsx` line 66 | `<h1>` forced to Playfair — redundant | Remove `style` attr |
| `src/pages/AccountPage.tsx` line 36 | `<h1>` forced to Playfair — redundant | Remove `style` attr |

**Key principle**: All `<h1>`–`<h6>` get Playfair automatically from CSS. Remove all redundant inline `fontFamily` on headings. For `<h3>` tags that were incorrectly forced to Inter (WhyChooseUs, BestSellers, AboutPage values), remove the override so they use the correct serif heading font.

**Files modified:**
- `src/pages/ProductDetail.tsx` — Klarna component + remove price font override
- `src/components/KlarnaInfo.tsx` — new component
- `src/pages/AboutPage.tsx` — remove redundant font overrides
- `src/pages/AuthPage.tsx` — remove redundant font override
- `src/pages/AccountPage.tsx` — remove redundant font override
- `src/components/WhyChooseUs.tsx` — remove incorrect Inter override on h3
- `src/components/BestSellers.tsx` — remove incorrect Inter override on h3

