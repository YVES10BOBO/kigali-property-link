/**
 * Industry-standard property types used in real estate websites
 * These match common property classifications used globally
 */

export type PropertyType = 
  | 'apartment'
  | 'house'
  | 'villa'
  | 'studio'
  | 'penthouse'
  | 'townhouse'
  | 'duplex'
  | 'bungalow';

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
    value: 'house',
    label: 'House',
    description: 'A standalone residential building with its own land',
    icon: 'fa-home',
  },
  {
    value: 'villa',
    label: 'Villa',
    description: 'A large, luxurious house, often with a garden',
    icon: 'fa-home',
  },
  {
    value: 'studio',
    label: 'Studio',
    description: 'A small apartment with combined living and sleeping area',
    icon: 'fa-couch',
  },
  {
    value: 'penthouse',
    label: 'Penthouse',
    description: 'A luxury apartment on the top floor of a building',
    icon: 'fa-building',
  },
  {
    value: 'townhouse',
    label: 'Townhouse',
    description: 'A multi-story house sharing walls with adjacent properties',
    icon: 'fa-home',
  },
  {
    value: 'duplex',
    label: 'Duplex',
    description: 'A house divided into two separate living units',
    icon: 'fa-home',
  },
  {
    value: 'bungalow',
    label: 'Bungalow',
    description: 'A single-story house, often with a veranda',
    icon: 'fa-home',
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