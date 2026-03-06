export interface PriceRange {
  label: string;
  value: string;
}

// RWF amounts – any updates here will automatically reflect in dropdowns
export const priceRanges: PriceRange[] = [
  // lower tiers
  { label: "RWF 0 - RWF 100,000", value: "0-100000" },
  { label: "RWF 100,000 - RWF 300,000", value: "100000-300000" },
  // previous ranges
  { label: "RWF 300,000 - RWF 500,000", value: "300000-500000" },
  { label: "RWF 500,000 - RWF 800,000", value: "500000-800000" },
  { label: "RWF 800,000 - RWF 1,200,000", value: "800000-1200000" },
  { label: "RWF 1,200,000+", value: "1200000+" },
];


