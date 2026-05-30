/**
 * Deterministic pseudo-random rating between 4.0 and 5.0 (in 0.5 steps)
 * and a review count between 12 and 240, derived from the product id/handle.
 */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function productRating(key: string): { rating: number; count: number } {
  const h = hashString(key || "x");
  // 0..2 => 4.0, 4.5, 5.0
  const step = h % 3;
  const rating = 4 + step * 0.5;
  const count = 12 + ((h >>> 4) % 229);
  return { rating, count };
}
