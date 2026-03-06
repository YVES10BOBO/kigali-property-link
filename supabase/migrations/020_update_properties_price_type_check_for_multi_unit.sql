-- Allow price_type to be set even when price is NULL.
-- This supports "Building + Units" listings where unit prices live in property_units,
-- but we still want a property-level price_type to control public badges/labels.

ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_price_type_check;

ALTER TABLE properties
  ADD CONSTRAINT properties_price_type_check
  CHECK (
    -- No pricing at all
    (price IS NULL AND price_type IS NULL)
    OR
    -- Single-property pricing: both fields present
    (price IS NOT NULL AND price_type IS NOT NULL AND price_type IN ('rent', 'sale', 'rent_and_sale'))
    OR
    -- Multi-unit pricing: property has no single price, but still has a price_type
    (price IS NULL AND price_type IS NOT NULL AND price_type IN ('rent', 'sale', 'rent_and_sale'))
  );

