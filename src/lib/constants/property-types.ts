/**
 * Industry-standard property types used in real estate websites
 * These match common property classifications used globally
 */

// Keep in sync with src/types/property.ts and DB constraint
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

export interface PropertyTypeOption {
  value: PropertyType;
  label: string;
  description: string;
  icon: string;
}

/**
 * Standard property types with descriptions
 * Used across the application for consistency
 */
export const PROPERTY_TYPES: PropertyTypeOption[] = [
  {
    value: 'apartment',
    label: 'Apartment',
    description: 'A self-contained residential unit within a building',
    icon: 'fa-building',
  },
  {
    value: 'studio',
    label: 'Studio',
    description: 'A small apartment with combined living and sleeping area',
    icon: 'fa-couch',
  },
  {
    value: 'condo',
    label: 'Condo',
    description: 'A private residential unit in a larger building with shared areas',
    icon: 'fa-building',
  },
  {
    value: 'house',
    label: 'House',
    description: 'A standalone residential building with its own land',
    icon: 'fa-home',
  },
  {
    value: 'villa',
    label: 'Villa',
    description: 'A large, often luxury standalone house, frequently with a garden',
    icon: 'fa-home',
  },
  {
    value: 'penthouse',
    label: 'Penthouse',
    description: 'A luxury apartment on the top floor of a building',
    icon: 'fa-building',
  },
  // Commercial
  {
    value: 'office',
    label: 'Office',
    description: 'Commercial office space for businesses and professionals',
    icon: 'fa-briefcase',
  },
  {
    value: 'shop',
    label: 'Shop',
    description: 'Retail shop or store space for selling products',
    icon: 'fa-store',
  },
  {
    value: 'showroom',
    label: 'Showroom',
    description: 'Display space for products, cars, or furniture',
    icon: 'fa-warehouse',
  },
  {
    value: 'warehouse',
    label: 'Warehouse',
    description: 'Storage or logistics space for goods',
    icon: 'fa-warehouse',
  },
  {
    value: 'hotel',
    label: 'Hotel',
    description: 'Hospitality property offering rooms for guests',
    icon: 'fa-hotel',
  },
  {
    value: 'guest_house',
    label: 'Guest House',
    description: 'Smaller hospitality property or lodge for guests',
    icon: 'fa-bed',
  },
  {
    value: 'commercial_building',
    label: 'Commercial Building',
    description: 'Mixed or multi-use commercial property (offices, shops, etc.)',
    icon: 'fa-building',
  },
  // Land & special
  {
    value: 'land',
    label: 'Land / Plot',
    description: 'Vacant land or serviced plot for development',
    icon: 'fa-tree',
  },
  {
    value: 'farm',
    label: 'Farm',
    description: 'Agricultural land or farm property',
    icon: 'fa-tractor',
  },
  {
    value: 'industrial_land',
    label: 'Industrial Land',
    description: 'Land zoned for factories, warehouses, or industrial use',
    icon: 'fa-industry',
  },
];

/**
 * Get property type label by value
 */
export function getPropertyTypeLabel(value: PropertyType | string | null | undefined): string {
  if (!value) return 'All Types';
  const type = PROPERTY_TYPES.find(t => t.value === value);
  return type?.label || value;
}

/**
 * Get property type description by value
 */
export function getPropertyTypeDescription(value: PropertyType | string | null | undefined): string {
  if (!value) return '';
  const type = PROPERTY_TYPES.find(t => t.value === value);
  return type?.description || '';
}

/**
 * Get property type icon by value
 */
export function getPropertyTypeIcon(value: PropertyType | string | null | undefined): string {
  if (!value) return 'fa-home';
  const type = PROPERTY_TYPES.find(t => t.value === value);
  return type?.icon || 'fa-home';
}

/**
 * Check if a property type is valid
 */
export function isValidPropertyType(value: string | null | undefined): value is PropertyType {
  if (!value) return false;
  return PROPERTY_TYPES.some(t => t.value === value);
}