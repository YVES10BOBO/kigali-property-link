import { formatPrice } from "@/lib/currency";

// Database property status (from Supabase)
export type PropertyStatus = 
  | "pending_approval"
  | "available"
  | "off_plan"
  | "reserved"
  | "sold"
  | "rented"
  | "unverified"
  | "rejected"
  | "needs_revision";

// Matches Supabase check constraint in 015_add_property_type.sql
export type PropertyType = 
  // Residential
  | 'apartment'
  | 'studio'
  | 'condo'
  | 'house'
  | 'villa'
  | 'penthouse'
  // Commercial
  | 'office'
  | 'shop'
  | 'showroom'
  | 'warehouse'
  | 'hotel'
  | 'guest_house'
  | 'commercial_building'
  // Land & special
  | 'land'
  | 'farm'
  | 'industrial_land';

// Unit within a property (apartment building)
export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string; // e.g., "A1", "Studio 3", "Unit 101"
  bedrooms: number;
  bathrooms: number;
  area: number;
  rent_price?: number | null; // Monthly rent (null if not for rent)
  sale_price?: number | null; // Sale price (null if not for sale)
  currency?: "RWF" | "USD"; // Currency for this unit (defaults to property currency)
  status: "available" | "reserved" | "sold" | "rented";
  images?: string[]; // Unit-specific images (optional)
  description?: string; // Unit-specific description (optional)
  furnished: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  price?: number; // Optional - not needed if property has units
  price_type?: "rent" | "sale" | "rent_and_sale"; // Optional - not needed if property has units
  currency?: "RWF" | "USD"; // Currency for this property (defaults to RWF)
  property_type?: PropertyType | null;
  location: string; // Public area (e.g., "Kimihurura, Kigali") - always visible
  address?: string | null; // Specific street address (e.g., "KG 123 St") - optional, can be hidden
  show_address?: boolean; // Whether to show address to public (default: false)
  bedrooms: number; // Default/primary bedrooms (for single properties or building overview)
  bathrooms: number; // Default/primary bathrooms (for single properties or building overview)
  area: number; // Default/primary area (for single properties or building overview)
  furnished: boolean;
  parking: boolean;
  security: boolean;
  generator: boolean;
  amenities?: string[];
  status: PropertyStatus;
  images?: string[]; // Building images (used if units don't have their own images)
  latitude?: number | string;
  longitude?: number | string;
  // Units system - for apartment buildings with multiple units
  units?: PropertyUnit[]; // Array of units within this property
  // Verification system fields
  owner_id?: string;
  last_confirmed_at?: string;
  confirmation_due_date?: string;
  admin_notes?: string;
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper to get first image or default
export function getPropertyImage(property: Property): string {
  if (property.images && property.images.length > 0) {
    return property.images[0];
  }
  return "/images/default-property.jpg";
}

// Helper to get price display for property (handles units)
export function getPropertyPriceDisplay(property: Property): { price: number; type: "rent" | "sale" | "rent_and_sale"; label: string } | null {
  // If property has units, show FIRST unit's price on card
  if (property.units && property.units.length > 0) {
    const availableUnits = property.units.filter(u => u.status === 'available');
    if (availableUnits.length === 0) return null;
    
    // Get FIRST available unit (the first one added/selected)
    const firstUnit = availableUnits[0];
    const unitCurrency = firstUnit.currency || property.currency || "RWF";
    const currencySymbol = unitCurrency === "USD" ? "$" : "RWF";
    
    // Show first unit's price - prioritize rent if both exist
    if (firstUnit.rent_price) {
      return {
        price: firstUnit.rent_price,
        type: "rent",
        label: `${currencySymbol} ${firstUnit.rent_price.toLocaleString()}/month`
      };
    } else if (firstUnit.sale_price) {
      return {
        price: firstUnit.sale_price,
        type: "sale",
        label: `${currencySymbol} ${firstUnit.sale_price.toLocaleString()}`
      };
    }
    
    // If first unit has no price, check other units for price range
    const rentPrices = availableUnits.map(u => u.rent_price).filter((p): p is number => p !== null && p !== undefined);
    const salePrices = availableUnits.map(u => u.sale_price).filter((p): p is number => p !== null && p !== undefined);
    
    if (rentPrices.length > 0) {
      const minRent = Math.min(...rentPrices);
      return {
        price: minRent,
        type: "rent",
        label: `${currencySymbol} ${minRent.toLocaleString()}/month`
      };
    } else if (salePrices.length > 0) {
      const minSale = Math.min(...salePrices);
      return {
        price: minSale,
        type: "sale",
        label: `${currencySymbol} ${minSale.toLocaleString()}`
      };
    }
  }
  
  // Single property (no units) - use existing price/price_type
  if (property.price && property.price_type) {
    const currency = property.currency || "RWF";
    const formatted = formatPrice(property.price, property.price_type, currency);
    return {
      price: property.price,
      type: property.price_type as "rent" | "sale" | "rent_and_sale",
      label: formatted,
    };
  }
  
  return null;
}

// Helper to convert database property to display format
export function formatPropertyForDisplay(property: Property) {
  const priceDisplay = getPropertyPriceDisplay(property);
  
  // Get currency from units if property has units, otherwise from property
  let displayCurrency = property.currency || "RWF";
  if (property.units && property.units.length > 0) {
    const availableUnits = property.units.filter(u => u.status === 'available');
    if (availableUnits.length > 0) {
      displayCurrency = availableUnits[0]?.currency || property.currency || "RWF";
    }
  }
  
  return {
    id: property.id,
    title: property.title,
    price: priceDisplay?.price ?? property.price ?? null, // Use null instead of 0
    priceType: priceDisplay?.type || property.price_type || "rent",
    priceLabel: priceDisplay?.label || "",
    currency: displayCurrency, // Add currency to the return object
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    image: getPropertyImage(property),
    images: property.images || [getPropertyImage(property)],
    badge: priceDisplay?.type || property.price_type || "rent",
    status: property.status,
    description: property.description,
    amenities: property.amenities || [],
    furnished: property.furnished,
    parking: property.parking,
    security: property.security,
    generator: property.generator,
    units: property.units || [],
    hasUnits: (property.units && property.units.length > 0) || false,
  };
}
