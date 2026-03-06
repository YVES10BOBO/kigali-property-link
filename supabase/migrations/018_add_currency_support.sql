-- Add currency support to properties and property_units tables
-- Supports RWF (Rwandan Franc) and USD (US Dollar)

-- Add currency column to properties table
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'RWF' CHECK (currency IN ('RWF', 'USD'));

-- Add currency column to property_units table
ALTER TABLE property_units
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'RWF' CHECK (currency IN ('RWF', 'USD'));

-- Update existing records to have RWF as default (if any exist)
UPDATE properties SET currency = 'RWF' WHERE currency IS NULL;
UPDATE property_units SET currency = 'RWF' WHERE currency IS NULL;

-- Make currency NOT NULL after setting defaults
ALTER TABLE properties
  ALTER COLUMN currency SET NOT NULL;

ALTER TABLE property_units
  ALTER COLUMN currency SET NOT NULL;
