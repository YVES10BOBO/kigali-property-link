-- Add 'rent_and_sale' as a valid price_type option
-- This allows properties to be listed for both rent and sale

ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_price_type_check;

ALTER TABLE properties
  ADD CONSTRAINT properties_price_type_check
  CHECK (
    (price IS NULL AND price_type IS NULL) OR
    (price IS NOT NULL AND price_type IS NOT NULL AND price_type IN ('rent', 'sale', 'rent_and_sale'))
  );
