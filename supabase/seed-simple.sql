-- Simple seed data - Use this if the main seed.sql doesn't work
-- This inserts one property at a time

INSERT INTO properties (title, description, price, price_type, location, bedrooms, bathrooms, area, furnished, parking, security, generator, amenities, status, images) 
VALUES (
  'Greenland Plaza 2BR Apartment',
  'Beautiful 2-bedroom apartment in the prestigious Greenland Plaza.',
  800,
  'rent',
  'Kimihurura, Kigali',
  2,
  2,
  120,
  true,
  true,
  true,
  true,
  ARRAY['Fully Furnished', 'Parking Available', '24/7 Security'],
  'available',
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']
) RETURNING *;


