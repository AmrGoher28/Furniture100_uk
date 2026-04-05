

# Premium Furniture100 Ecommerce Rebuild

This is a major overhaul — transforming the current minimal furniture site into a full premium UK ecommerce experience. The existing Shopify integration, cart system, and core infrastructure stay intact. Everything else gets rebuilt or heavily expanded.

Given the scale, this will be implemented in **3 phases** across multiple messages.

---

## Phase 1: Foundation — Brand, Layout, Homepage

### Colour & Typography Overhaul
**`src/index.css`** — Replace the warm cream/bark palette with the new brand system:
- Background: `#FFFFFF` / `#F9F9F7`
- Primary text: `#1A1A1A`
- Accent/gold: `#C9A84C`
- Sale red: `#C0392B`
- Keep Playfair Display + Inter, adjust weights

### New Categories Data
**`src/lib/categories.ts`** (new) — Central category/subcategory map used by navbar, category pages, and filters:
- Lounge Chairs (7 subs), Sofas (4), Office Chairs (4), Dining (2), Mirrors (3), Lighting (2), Accessories (2)

### Announcement Bar
**`src/components/AnnouncementBar.tsx`** (new) — Dark charcoal bar above header:
- "Free UK Delivery on All Orders | 30 Day Returns | Rated Excellent"

### Navbar Redesign
**`src/components/Navbar.tsx`** — Complete restructure:
- Logo left (Furniture100 in Playfair Display with gold "100")
- Centre nav: Home, Shop, Categories (dropdown), About, Contact
- Right: Search icon, Wishlist (heart) icon, Basket icon, phone number
- Mega-menu for Categories with all subcategories
- Mobile hamburger with accordion categories

### Hero Section
**`src/components/Hero.tsx`** — Redesign:
- Full-width lifestyle image background
- "Premium Furniture. Delivered Nationwide." heading
- Subheading about curated collection + free UK delivery
- Two CTAs: "Shop Now" (dark filled) + "View Best Sellers" (outlined)

### Trust Bar
**`src/components/TrustBar.tsx`** (new) — 5 icons row:
- Free UK Delivery, 30 Day Returns, Rated Excellent, Secure Checkout, UK Based Support

### Featured Categories Section
**`src/components/FeaturedCategories.tsx`** (new):
- "Shop By Category" heading
- Large image tiles grid with category name overlay + hover effect
- Links to category pages

### Best Sellers Section
**`src/components/BestSellers.tsx`** (new):
- "Our Best Sellers" with subtitle
- 4 product cards from Shopify with image, name, price, star rating placeholder, Add to Basket

### Lifestyle Banner
**`src/components/LifestyleBanner.tsx`** (new):
- Full-width image, dark overlay, "Furniture That Transforms Your Space", CTA

### Why Choose Us
**`src/components/WhyChooseUs.tsx`** (new):
- 4 columns: Free Delivery, Hassle Free Returns, Buy Now Pay Later, UK Customer Support

### Customer Reviews
**`src/components/CustomerReviews.tsx`** (new):
- 3 review card placeholders (empty structure, no fake content — per Shopify reviews policy)
- "What Our Customers Say" heading

### Social Feed
**`src/components/SocialFeed.tsx`** (new):
- "Follow Us @furniture100" with 6 lifestyle image placeholders

### Newsletter Signup
**`src/components/Newsletter.tsx`** (new):
- Dark background, "Get 10% Off Your First Order", email input, gold subscribe button

### Footer Redesign
**`src/components/Footer.tsx`** — 4 columns:
- Brand + social icons
- Quick Links
- Customer Care (Delivery, Returns, FAQs, Track Order)
- Contact (phone, email, hours)
- Bottom bar: copyright, policy links, payment icons

### Homepage Assembly
**`src/pages/Index.tsx`** — Stack all sections in order:
AnnouncementBar → Navbar → Hero → TrustBar → FeaturedCategories → BestSellers → LifestyleBanner → WhyChooseUs → CustomerReviews → SocialFeed → Newsletter → Footer

---

## Phase 2: Category & Product Pages, Routing

### Routes
**`src/App.tsx`** — Add routes:
- `/shop` — Shop All
- `/category/:slug` — Category pages
- `/about` — About Us
- `/delivery` — Delivery Information
- `/returns` — Returns Policy
- `/contact` — Contact Us
- `/privacy` — Privacy Policy
- `/terms` — Terms and Conditions

### Category Page
**`src/pages/CategoryPage.tsx`** (new):
- Hero banner with category name + breadcrumb
- Filter sidebar (price range, style toggles)
- Sort dropdown (Featured, Price low/high, Newest)
- 3-col product grid (responsive), pagination
- Products loaded from Shopify filtered by category

### Shop All Page
**`src/pages/ShopAll.tsx`** (new):
- Same layout as category page but showing all products

### Product Detail Redesign
**`src/pages/ProductDetail.tsx`** — Enhance:
- Breadcrumb navigation
- Image gallery with thumbnails
- Star rating placeholder, Klarna "from £X/month" text
- Full-width Add to Basket button (dark), wishlist button
- Trust icons row (delivery, returns, secure, support)
- Delivery timeframe text
- Specifications table
- "You May Also Like" product row

### Static Pages
New page components for About, Delivery, Returns, Contact, Privacy, Terms — clean informational layouts with Furniture100 branding

---

## Phase 3: Polish & Performance

### SEO
**`index.html`** — Updated meta tags, OG tags, schema markup placeholder

### Pixel Readiness
- Google Analytics, Facebook Pixel, TikTok Pixel — placeholder `<script>` tags in `index.html` with comment markers for real IDs

### Mobile Optimisation
- Sticky "Add to Basket" on mobile product pages
- Large tap targets throughout
- Responsive grid adjustments (1-col mobile, 2-col tablet, 3-col desktop)

### Live Chat Placeholder
- Chat widget icon (bottom-right) linking to future integration

---

## What Stays Unchanged
- `src/lib/shopify.ts` — Shopify API setup, cart mutations, all working
- `src/stores/cartStore.ts` — Zustand cart state
- `src/hooks/useCartSync.ts` — Cart sync hook
- `src/components/CartDrawer.tsx` — Cart drawer (minor style tweaks only)

## Technical Notes
- All products come from Shopify Storefront API — no mock data
- Category filtering uses product title/description/tags matching against the category map
- New pages use shared `Layout` wrapper with AnnouncementBar + Navbar + Footer
- Gold accent `#C9A84C` used for CTAs, highlights, and the "100" in the logo
- Payment icons rendered as SVG/text badges in the footer

---

## Implementation Order
Due to scale, I will implement Phase 1 first (homepage + brand overhaul), then Phase 2 (pages + routing), then Phase 3 (polish). Each phase will be a separate message after approval.

