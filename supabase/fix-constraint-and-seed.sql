-- Fix Property Type Constraint and Seed Properties
-- Run this if you're getting constraint errors
-- This script will recreate the constraint and then insert properties

-- STEP 1: Drop the existing constraint if it exists
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS check_property_type;

-- STEP 2: Clean up any invalid property_type values
UPDATE properties
SET property_type = NULL
WHERE property_type IS NOT NULL
AND property_type NOT IN (
  -- Residential
  'apartment',
  'studio',
  'condo',
  'house',
  'villa',
  'penthouse',
  -- Commercial
  'office',
  'shop',
  'showroom',
  'warehouse',
  'hotel',
  'guest_house',
  'commercial_building',
  -- Land & Special
  'land',
  'farm',
  'industrial_land'
);

-- STEP 3: Recreate the constraint with exact values
ALTER TABLE properties 
ADD CONSTRAINT check_property_type 
CHECK (property_type IS NULL OR property_type IN (
  -- Residential
  'apartment',
  'studio',
  'condo',
  'house',
  'villa',
  'penthouse',
  -- Commercial
  'office',
  'shop',
  'showroom',
  'warehouse',
  'hotel',
  'guest_house',
  'commercial_building',
  -- Land & Special
  'land',
  'farm',
  'industrial_land'
));

-- STEP 4: Verify constraint was created
SELECT 
  constraint_name, 
  check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'check_property_type';

-- STEP 5: Now insert the properties (copy from seed-20-properties.sql starting from INSERT statement)
