-- Add property_type column to properties table
-- Industry-standard property types for real estate websites

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_type TEXT;

-- Add constraint for valid property types
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS check_property_type;

ALTER TABLE properties 
ADD CONSTRAINT check_property_type 
CHECK (property_type IS NULL OR property_type IN (
  'apartment',
  'house',
  'villa',
  'studio',
  'penthouse',
  'townhouse',
  'duplex',
  'bungalow'
));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);

-- Add comment for documentation
COMMENT ON COLUMN properties.property_type IS 'Type of property: apartment, house, villa, studio, penthouse, townhouse, duplex, or bungalow';
