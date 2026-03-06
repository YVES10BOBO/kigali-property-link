// currency formatting utilities

export type Currency = "RWF" | "USD";

export const DEFAULT_CURRENCY: Currency = (process.env.NEXT_PUBLIC_CURRENCY as Currency) || "RWF";

/**
 * Format a number as currency with specified currency.
 * If the value is null/undefined returns "N/A".
 */
export function fmt(amount?: number | null, currency: Currency = DEFAULT_CURRENCY): string {
  if (amount === null || amount === undefined) return "N/A";
  const symbol = currency === "USD" ? "$" : "RWF";
  // Show whole numbers for both currencies to avoid confusing decimals
  const formatted = amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return `${symbol} ${formatted}`;
}

/**
 * Format a price plus a type (rent vs sale). Appends "/month" for rent.
 */
export function formatPrice(amount?: number | null, priceType?: string, currency: Currency = DEFAULT_CURRENCY): string {
  const base = fmt(amount, currency);
  if (priceType === "rent") {
    return `${base}/month`;
  }
  return base;
}
