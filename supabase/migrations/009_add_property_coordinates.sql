-- Add latitude and longitude to properties table for map integration
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create index for location queries
CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Update existing properties with approximate Kigali coordinates (you can update these manually)
-- Kimihurura coordinates (approximate)
UPDATE properties 
SET latitude = -1.9441, longitude = 30.0619
WHERE location ILIKE '%Kimihurura%' AND latitude IS NULL;

-- Nyarutarama coordinates (approximate)
UPDATE properties 
SET latitude = -1.9300, longitude = 30.0800
WHERE location ILIKE '%Nyarutarama%' AND latitude IS NULL;

-- Kacyiru coordinates (approximate)
UPDATE properties 
SET latitude = -1.9500, longitude = 30.0700
WHERE location ILIKE '%Kacyiru%' AND latitude IS NULL;

-- Kigali city center (default for others)
UPDATE properties 
SET latitude = -1.9441, longitude = 30.0619
WHERE latitude IS NULL;
