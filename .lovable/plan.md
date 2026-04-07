

## AI-Powered Product Audit Tool

### Overview

Build a new admin page at `/admin/product-audit` with an edge function backend that uses Lovable AI (Gemini vision model) to scan all Shopify products, check image-description accuracy, infer missing details, and present a review dashboard.

### Architecture

```text
┌─────────────────────┐      ┌──────────────────────┐      ┌─────────────────┐
│  ProductAudit page  │─────▶│  audit-products       │─────▶│ Lovable AI      │
│  /admin/product-audit│      │  edge function        │      │ (Gemini 2.5 Pro)│
│                     │◀─────│                       │◀─────│ Vision model    │
│  - Run audit button │      │  - Fetches products   │      └─────────────────┘
│  - Progress bar     │      │    from Shopify Admin  │
│  - Report table     │      │  - Sends image+desc   │
│  - Approve/reject   │      │    to AI for analysis  │
│  - Before/after     │      │  - Returns findings   │
└─────────────────────┘      └──────────────────────┘
         │
         ▼
┌─────────────────────┐
│  product_audits     │
│  (Supabase table)   │
│  - product_handle   │
│  - original_desc    │
│  - suggested_desc   │
│  - flags[]          │
│  - inferred_specs   │
│  - status           │
│  - created_at       │
└─────────────────────┘
```

### Database

**New table: `product_audits`**
- `id` uuid PK
- `product_handle` text NOT NULL
- `product_title` text NOT NULL
- `product_image` text
- `original_description` text
- `suggested_description` text
- `image_match_score` integer (0-100)
- `image_match_notes` text — AI explanation of mismatches
- `inferred_specs` jsonb — `{dimensions, material, weight, color, care_instructions}`
- `flags` text[] — e.g. `['description_mismatch', 'missing_dimensions', 'missing_material']`
- `status` text DEFAULT 'pending' — pending / approved / dismissed
- `audit_batch_id` text — groups audits from the same run
- `created_at` timestamptz DEFAULT now()

RLS: service_role full access, authenticated users can SELECT.

### Edge Function: `audit-products`

**File: `supabase/functions/audit-products/index.ts`**

1. Accepts POST with optional `{ batchSize, offset }` for pagination
2. Fetches products from Shopify Storefront API (paginated, all products)
3. For each product, calls Lovable AI (google/gemini-2.5-pro — vision model) with:
   - The first product image URL
   - The current product description
   - A structured prompt asking to:
     - Rate image-description match (0-100)
     - List mismatches
     - Infer missing specs (dimensions, material, weight, color, care)
     - Suggest an improved description if needed
4. Uses tool calling to extract structured JSON response
5. Inserts results into `product_audits` table
6. Returns the batch results to the client
7. Processes products in batches of 3 to respect rate limits (with 2s delay between)

### Frontend: `src/pages/ProductAuditPage.tsx`

**Layout**: Uses existing `Layout` component, admin-style page similar to `AdminOffers`

**Sections**:
1. **Header** — "Product Audit" title + "Run Audit" button
2. **Progress** — During scan: progress bar showing X/Y products scanned
3. **Summary cards** — After scan: total scanned, flagged count, auto-filled count, match score average
4. **Report table** — Sortable/filterable table with columns:
   - Product thumbnail + title
   - Match score (color-coded: green >80, amber 50-80, red <50)
   - Flags (pills)
   - Actions: "Review" to expand before/after view
5. **Review drawer/modal** — Shows:
   - Product image
   - Original description vs suggested description (side-by-side diff)
   - Original specs vs inferred specs
   - "Approve" / "Dismiss" buttons (updates status in DB)

**How it works**:
- Clicking "Run Audit" calls the edge function in batches (e.g., 5 products at a time)
- Progress updates in real-time as batches complete
- Results are stored in DB and loaded on page revisit
- Filter by: All / Flagged / Pending / Approved

### Route

Add `/admin/product-audit` route in `App.tsx`, linking to the new page.

### Files Created/Modified

- `supabase/functions/audit-products/index.ts` — edge function
- `src/pages/ProductAuditPage.tsx` — audit dashboard page
- `src/App.tsx` — add route
- New migration — `product_audits` table

### Technical Notes

- Uses `google/gemini-2.5-pro` for vision capabilities (image analysis)
- Products are fetched server-side in the edge function using the Shopify Storefront token (already available as a secret)
- The audit is non-destructive — it only suggests changes, user must approve
- No changes are written back to Shopify automatically (that would require Admin API write access and is out of scope)

