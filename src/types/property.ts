// Database property type (from Supabase)
export type PropertyStatus = 
  | "pending_approval"
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "unverified"
  | "rejected"
  | "needs_revision";

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  price_type: "rent" | "sale";
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean;
  parking: boolean;
  security: boolean;
  generator: boolean;
  amenities?: string[];
  status: PropertyStatus;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
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

// Helper to convert database property to display format
export function formatPropertyForDisplay(property: Property) {
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    priceType: property.price_type,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    image: getPropertyImage(property),
    images: property.images || [getPropertyImage(property)],
    badge: property.price_type,
    description: property.description,
    amenities: property.amenities || [],
    furnished: property.furnished,
    parking: property.parking,
    security: property.security,
    generator: property.generator,
  };
}
