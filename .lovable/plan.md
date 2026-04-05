

# Add Notification Email & Shopify Admin Token Secrets

## What's Happening
You've provided the two secrets needed to complete the offer system:
1. **Notification email**: `offers@furniture100.co.uk` — stored as `ADMIN_NOTIFICATION_EMAIL`
2. **Shopify Admin Token**: stored as `SHOPIFY_ADMIN_TOKEN` — enables Draft Order creation when you accept an offer

## Steps

1. **Add `ADMIN_NOTIFICATION_EMAIL` secret** with value `offers@furniture100.co.uk`
2. **Add `SHOPIFY_ADMIN_TOKEN` secret** with the provided token
3. **Redeploy the `handle-offer` Edge Function** so it picks up the new secrets

No code changes needed — the edge function already reads both `ADMIN_NOTIFICATION_EMAIL` and `SHOPIFY_ADMIN_TOKEN` from environment variables.

