-- Add property_units table for apartment buildings with multiple units
-- This allows a single property (building) to have multiple units with different prices

CREATE TABLE IF NOT EXISTS property_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL, -- e.g., "A1", "Studio 3", "Unit 101"
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  area DECIMAL(10, 2) NOT NULL,
  rent_price DECIMAL(12, 2), -- Monthly rent (NULL if not for rent)
  sale_price DECIMAL(12, 2), -- Sale price (NULL if not for sale)
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'rented')),
  images TEXT[], -- Unit-specific images (optional, falls back to building images)
  description TEXT, -- Unit-specific description (optional)
  furnished BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure unit_number is unique within a property
  UNIQUE(property_id, unit_number)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_property_units_property_id ON property_units(property_id);
CREATE INDEX IF NOT EXISTS idx_property_units_status ON property_units(status);
CREATE INDEX IF NOT EXISTS idx_property_units_bedrooms ON property_units(bedrooms);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_property_units_updated_at BEFORE UPDATE ON property_units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE property_units ENABLE ROW LEVEL SECURITY;

-- Allow public read access to property units (same as properties)
CREATE POLICY "Property units are viewable by everyone" ON property_units
  FOR SELECT USING (true);

-- Allow authenticated users to manage property units
CREATE POLICY "Authenticated users can manage property units" ON property_units
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Make price and price_type optional in properties table when property has units
-- (We'll handle this in application logic, but database allows NULL)
ALTER TABLE properties 
  ALTER COLUMN price DROP NOT NULL;

ALTER TABLE properties 
  ALTER COLUMN price_type DROP NOT NULL;

-- Add a check constraint: if price is NULL, price_type must also be NULL
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_price_type_check;

ALTER TABLE properties
  ADD CONSTRAINT properties_price_type_check
  CHECK (
    (price IS NULL AND price_type IS NULL) OR
    (price IS NOT NULL AND price_type IS NOT NULL AND price_type IN ('rent', 'sale'))
  );
