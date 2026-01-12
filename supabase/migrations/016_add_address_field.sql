-- Add address field (optional, can be hidden) separate from location
-- Location = public area (e.g., "Kimihurura, Kigali")
-- Address = specific street address (e.g., "KG 123 St, Kimihurura") - can be hidden

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS show_address BOOLEAN DEFAULT false;

-- Add index for address searches (if needed in future)
CREATE INDEX IF NOT EXISTS idx_properties_address ON properties(address) WHERE address IS NOT NULL;

-- Add comment explaining the difference
COMMENT ON COLUMN properties.location IS 'Public location/area (e.g., "Kimihurura, Kigali") - always visible to public';
COMMENT ON COLUMN properties.address IS 'Specific street address (e.g., "KG 123 St") - optional, can be hidden from public';
COMMENT ON COLUMN properties.show_address IS 'Whether to show the specific address to public (default: false - hidden)';
