// currency formatting utilities

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "RWF";

/**
 * Format a number as currency, defaulting to the configured currency string.
 * If the value is null/undefined returns "N/A".
 */
export function fmt(amount?: number | null): string {
  if (amount === null || amount === undefined) return "N/A";
  return `${CURRENCY} ${amount.toLocaleString()}`;
}

/**
 * Format a price plus a type (rent vs sale). Appends "/month" for rent.
 */
export function formatPrice(amount?: number | null, priceType?: string): string {
  const base = fmt(amount);
  if (priceType === "rent") {
    return `${base}/month`;
  }
  return base;
}
