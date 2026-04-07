

## Admin Product Management Dashboard

This is a large feature with 5 major parts. Products come from the **Shopify Storefront API** (read-only), so editing/uploading will need the **Shopify Admin API** via edge functions. AI features will use **Lovable AI** (Gemini).

### Architecture Overview

```text
┌─ Frontend ──────────────────────────────────┐
│  /admin/products → AdminProducts.tsx        │
│  - Product grid with status badges          │
│  - Inline editing modal per product         │
│  - Image upload + crop modal                │
│  - AI tools panel                           │
└──────────┬──────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────┐
│  Edge Functions                             │
│  1. admin-update-product  (Shopify Admin)   │
│  2. admin-upload-image    (Shopify Admin)   │
│  3. admin-ai-tools        (Lovable AI)      │
└─────────────────────────────────────────────┘
```

### Implementation Plan

#### 1. Admin Products Page (`src/pages/AdminProducts.tsx`)
- Fetch all products using existing `fetchProductsPage()` with pagination
- Display as a responsive grid of cards, each showing: thumbnail, title, price, description snippet
- **Status indicators**: red dot for missing description, yellow dot for missing images, orange for single image only
- Search/filter bar at top
- Auth-gated: redirect to `/auth` if not signed in

#### 2. Edge Function: `admin-update-product`
- Accepts product ID, updated fields (title, description, price, etc.)
- Calls Shopify Admin API (`PUT /admin/api/2025-07/products/{id}.json`) using existing `SHOPIFY_ADMIN_TOKEN` secret
- Returns updated product data
- Note: Shopify product IDs from Storefront API are GID format — will need to extract numeric ID

#### 3. Edge Function: `admin-upload-image`
- Accepts product ID + base64 image data
- Uploads to Shopify via Admin API (`POST /admin/api/2025-07/products/{id}/images.json`)
- Can also delete/reorder existing images

#### 4. Inline Editing UI
- Click any product card → opens a slide-out panel or modal
- Editable fields: title, description (rich text area), price
- Fields with empty/missing values highlighted in amber/red
- Save button calls `admin-update-product` edge function
- Image section: click image → file picker + crop tool (using `react-image-crop` or similar library)
- Live preview panel showing how the product card looks on the site

#### 5. Edge Function: `admin-ai-tools`
- Single edge function with an `action` parameter routing to different AI tasks
- **Actions**:
  - `describe`: Send product image URL to Gemini, get back improved description
  - `compare`: Send image + current description, get mismatch flags
  - `generate-angles`: Send image, request variations (Gemini image generation)
  - `generate-dimensions`: Send image, request dimension-annotated version
- Uses `LOVABLE_API_KEY` → Lovable AI gateway
- Model: `google/gemini-2.5-flash` for text tasks, `google/gemini-2.5-flash-image` for image generation

#### 6. AI Tools UI
- "AI Tools" button on each product card in the admin dashboard
- Opens a panel with 4 action buttons:
  - "Generate Description" → calls describe action, shows result, one-click apply
  - "Compare Image vs Description" → shows mismatch report
  - "Generate Angles" → shows generated images, option to upload to Shopify
  - "Generate Dimensions Image" → shows annotated image, option to save

#### 7. Navigation Update (`src/components/Navbar.tsx`)
- Add "Admin" link in desktop nav and mobile menu
- Only visible when user is authenticated (use `useAuth` hook)
- Links to `/admin/products`
- Also add sub-links to existing `/admin/offers` and `/admin/categories`

#### 8. Route Registration (`src/App.tsx`)
- Add route: `/admin/products` → `AdminProducts`

### Dependencies to Add
- `react-image-crop` — for image cropping UI

### Files Created/Modified
- **New**: `src/pages/AdminProducts.tsx` — main dashboard page
- **New**: `src/components/admin/ProductEditModal.tsx` — inline editing panel
- **New**: `src/components/admin/ProductAITools.tsx` — AI tools panel
- **New**: `src/components/admin/ProductImageManager.tsx` — image upload/crop
- **New**: `src/components/admin/ProductPreview.tsx` — live site preview
- **New**: `supabase/functions/admin-update-product/index.ts`
- **New**: `supabase/functions/admin-upload-image/index.ts`
- **New**: `supabase/functions/admin-ai-tools/index.ts`
- **Modified**: `src/App.tsx` — add route
- **Modified**: `src/components/Navbar.tsx` — add admin link

### Security Notes
- Edge functions will verify the user is authenticated before processing
- Admin access currently relies on being signed in (same as existing admin pages) — no role table yet. Can add role-based access as a follow-up.
- Shopify Admin API calls are server-side only via edge functions

