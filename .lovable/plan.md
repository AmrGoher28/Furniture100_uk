

# Product Category Management Dashboard

## The Problem
Right now, when a product is added to Shopify, the site tries to match it to a category by checking if the product title or description contains category keywords like "Lounge Chairs" or "Sofas". This is unreliable — products can land in the wrong category or none at all.

## The Solution
Create a **Product Category Manager** page at `/admin/categories` where you can:
- See all your Shopify products listed alongside their current (auto-detected) category
- Manually assign each product to the correct category and subcategory
- Override the keyword-based matching with explicit mappings stored in the database

## How It Works

### 1. New database table: `product_categories`
Stores explicit product-to-category mappings:
- `product_handle` (text, unique) — the Shopify product handle
- `category_slug` (text) — which category it belongs to
- `subcategory_slug` (text, optional) — which subcategory
- `is_best_seller` (boolean) — flag to feature on homepage

### 2. New admin page: `/admin/categories`
A table showing all Shopify products with:
- Product image and title
- Dropdown to select category
- Dropdown to select subcategory (filtered by chosen category)
- Best seller toggle
- Save button per row (or auto-save on change)
- Unassigned products highlighted so you can spot what needs attention

### 3. Update category filtering logic
- `CategoryPage.tsx` will first check the `product_categories` table for explicit mappings
- Falls back to the current keyword matching for any unmapped products
- `BestSellers.tsx` will query products flagged as best sellers instead of just showing the first 4

### 4. Files changed
- **New migration**: Create `product_categories` table with RLS (public read, authenticated write)
- **New page**: `src/pages/AdminCategories.tsx`
- **Update**: `src/App.tsx` — add route `/admin/categories`
- **Update**: `src/CategoryPage.tsx` — fetch mappings from DB, filter by them
- **Update**: `src/BestSellers.tsx` — optionally use best seller flags
- **New helper**: `src/lib/productCategories.ts` — functions to read/write mappings

