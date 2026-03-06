export interface PriceRange {
  label: string;
  value: string;
}

export type Currency = "RWF" | "USD";

// RWF price ranges
export const priceRangesRWF: PriceRange[] = [
  { label: "RWF 0 - RWF 100,000", value: "0-100000" },
  { label: "RWF 100,000 - RWF 300,000", value: "100000-300000" },
  { label: "RWF 300,000 - RWF 500,000", value: "300000-500000" },
  { label: "RWF 500,000 - RWF 800,000", value: "500000-800000" },
  { label: "RWF 800,000 - RWF 1,200,000", value: "800000-1200000" },
  { label: "RWF 1,200,000+", value: "1200000+" },
];

// USD price ranges (converted approximate values)
export const priceRangesUSD: PriceRange[] = [
  { label: "$0 - $100", value: "0-100" },
  { label: "$100 - $300", value: "100-300" },
  { label: "$300 - $500", value: "300-500" },
  { label: "$500 - $800", value: "500-800" },
  { label: "$800 - $1,200", value: "800-1200" },
  { label: "$1,200+", value: "1200+" },
];

// Get price ranges based on currency
export function getPriceRanges(currency: Currency = "RWF"): PriceRange[] {
  return currency === "USD" ? priceRangesUSD : priceRangesRWF;
}

// Legacy export for backward compatibility
export const priceRanges = priceRangesRWF;


