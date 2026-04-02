

# SWIFLIVING — Luxury Furniture Store

## Brand & Design System
- **Palette**: Warm neutrals — cream (#FAF8F5), stone (#C4B5A3), bark brown (#5C4A3A), near-black (#1A1A1A). No bright colors, no gradients.
- **Typography**: Playfair Display (serif) for headings, Inter (light weight) for body text — both from Google Fonts
- **Spacing**: Generous whitespace throughout, editorial layout inspired by luxury print magazines
- **Overall feel**: Calm, confident, expensive showroom

## Pages & Sections

### 1. Hero Section (Homepage)
- Full-width lifestyle image placeholder with brand statement: "Furniture Worth Living With"
- Subtle CTA button: "Browse the Collection"
- Minimal navigation bar with SWIFLIVING logo, nav links (Collection, About), and cart icon

### 2. Product Collection Grid
- Filterable by category: Seating, Tables, Storage, Lighting
- Clean grid layout with large product images, product name, and starting price
- Products loaded from Shopify Storefront API (real data, no mocks)
- If no products exist yet, shows elegant "No products found" message

### 3. Individual Product Pages (`/product/[handle]`)
- Large product imagery
- Product name, material/description, price
- Variant selector for options like fabric/finish (using Shopify variants)
- "Add to Cart" button with smooth interaction
- Loads real product data from Shopify

### 4. Cart Drawer
- Slide-out cart panel (Sheet component)
- Quantity controls, remove items
- Total price display
- "Checkout" button → opens Shopify checkout in new tab
- Full Zustand state management synced with Shopify Storefront API

### 5. About Section
- Short brand story about artisan-crafted furniture
- A few impressive stats (e.g., years of craft, countries, artisans)
- Clean, editorial layout

### 6. Footer
- SWIFLIVING logo
- Navigation links
- Location info
- Minimal, on-brand styling

## Technical Implementation
- Shopify Storefront API (2025-07) for all product data and cart/checkout
- Zustand for persistent cart state
- Cart sync hook for checkout completion detection
- React Router for collection and product detail pages
- Fully responsive (mobile-first)
- Custom CSS variables for the luxury color palette

## What You'll Need to Do After
- Add products via Shopify admin (or tell me what products to create)
- Configure Stripe as payment processor in Shopify admin
- Add real product photography

