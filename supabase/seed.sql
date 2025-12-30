-- Seed data for Kigali Property Link
-- Run this in Supabase SQL Editor after creating tables
-- This script uses ON CONFLICT to prevent duplicates if run multiple times

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM properties;

-- Insert sample properties
-- Using ON CONFLICT DO NOTHING to prevent duplicates
-- Note: This requires a unique constraint. If you get an error, use the cleanup script first.
INSERT INTO properties (title, description, price, price_type, location, bedrooms, bathrooms, area, furnished, parking, security, generator, amenities, status, images) 
VALUES
(
  'Greenland Plaza 2BR Apartment',
  'Beautiful 2-bedroom apartment in the prestigious Greenland Plaza. This modern apartment features spacious rooms, modern finishes, and stunning views of Kigali. Perfect for professionals or small families looking for a comfortable living space in the heart of Kimihurura.',
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
  ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'WiFi Ready', 'Balcony'],
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
  ]
),
(
  'Greenland Plaza 3BR Penthouse',
  'Luxurious 3-bedroom penthouse with panoramic city views. This premium property features high-end finishes, spacious living areas, and exclusive access to building amenities. A perfect investment opportunity in one of Kigali''s most sought-after locations.',
  150000,
  'sale',
  'Kimihurura, Kigali',
  3,
  3,
  180,
  true,
  true,
  true,
  true,
  ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'Swimming Pool Access', 'Gym Access'],
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
  ]
),
(
  'Modern Studio Apartment',
  'Cozy and modern studio apartment perfect for singles or couples. Located in the heart of Kacyiru with easy access to shops, restaurants, and public transport.',
  450,
  'rent',
  'Kacyiru, Kigali',
  1,
  1,
  55,
  false,
  true,
  true,
  false,
  ARRAY['Parking Available', '24/7 Security', 'WiFi Ready'],
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  ]
),
(
  'Luxury Villa with Pool',
  'Stunning luxury villa with private pool and garden. Perfect for families seeking premium living with all modern amenities and security features.',
  280000,
  'sale',
  'Nyarutarama, Kigali',
  4,
  4,
  350,
  true,
  true,
  true,
  true,
  ARRAY['Fully Furnished', 'Private Pool', 'Garden', 'Parking Available', '24/7 Security', 'Generator Backup'],
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
  ]
),
(
  'Executive 3BR Apartment',
  'Spacious executive apartment with modern amenities. Ideal for professionals seeking comfort and convenience in Remera.',
  1200,
  'rent',
  'Remera, Kigali',
  3,
  2,
  150,
  true,
  true,
  true,
  true,
  ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'WiFi Ready'],
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  ]
),
(
  'Phoenix Plaza 1BR Suite',
  'Modern 1-bedroom suite in Phoenix Plaza. Perfect starter home with all essential amenities.',
  600,
  'rent',
  'Kicukiro, Kigali',
  1,
  1,
  75,
  false,
  true,
  true,
  false,
  ARRAY['Parking Available', '24/7 Security', 'WiFi Ready'],
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  ]
)
ON CONFLICT DO NOTHING
RETURNING id, title, price, price_type;
