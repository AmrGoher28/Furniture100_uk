

## Add Quantity to Make an Offer Modal

### What changes

**Database: Add `quantity` column to `offers` table**
- New migration: `ALTER TABLE public.offers ADD COLUMN quantity integer NOT NULL DEFAULT 1;`

**File: `src/components/MakeOfferModal.tsx`**

1. Add `quantity` state (default 1, min 1, max 10) with compact plus/minus controls — same style as the product page quantity selector (32px circles, small text)
2. Place the quantity selector between the product preview card and the "Your Offer" input
3. Label it "Quantity" in sentence case, small muted font
4. Update the "Your Offer" label to clarify it's per item: "Your Offer (per item)"
5. Show a dynamic total line below the offer input: "Total for {quantity} items: £{amount * quantity}" in muted text
6. Update suggestion pills to remain per-item (no change needed, they already calculate from `originalPrice`)
7. Pass `quantity` into the Supabase insert and the edge function notification body
8. Update discount helper text to remain per-item based

### Layout order in the form
```text
[Product thumbnail + name + price]
[Quantity: - 1 +]
[Your Offer (per item): £___]
[  That's 15% off per item  ]
[£237 (-5%)  £224 (-10%)  £212 (-15%)]
[Total for 2 items: £448.00]
[Name] [Email]
[Send My Offer]
```

### Files modified
- `src/components/MakeOfferModal.tsx` — quantity state, UI, data submission
- New migration — add `quantity` column to `offers` table

