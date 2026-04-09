// Google Ads / gtag.js conversion tracking helpers
// Replace 'AW-XXXXXXXXX' with your real Google Ads conversion ID
// Replace conversion labels with your actual labels from Google Ads

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GOOGLE_ADS_ID = 'AW-18077126044';

// Ensure gtag is available
function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

/** Fire when a user adds an item to cart */
export function trackAddToCart({
  itemId,
  itemName,
  price,
  currency = 'GBP',
  quantity = 1,
}: {
  itemId: string;
  itemName: string;
  price: number;
  currency?: string;
  quantity?: number;
}) {
  gtag('event', 'add_to_cart', {
    currency,
    value: price * quantity,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        price,
        quantity,
      },
    ],
  });
}

/** Fire when a user begins checkout */
export function trackBeginCheckout({
  items,
  totalValue,
  currency = 'GBP',
}: {
  items: Array<{ itemId: string; itemName: string; price: number; quantity: number }>;
  totalValue: number;
  currency?: string;
}) {
  gtag('event', 'begin_checkout', {
    currency,
    value: totalValue,
    items: items.map((i) => ({
      item_id: i.itemId,
      item_name: i.itemName,
      price: i.price,
      quantity: i.quantity,
    })),
  });

  // Also fire Google Ads conversion event for checkout
  // Replace 'CHECKOUT_LABEL' with your actual conversion label
  gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/CHECKOUT_LABEL`,
    value: totalValue,
    currency,
  });
}

export { GOOGLE_ADS_ID };
