-- Complete Solution: Fix Constraint + Seed 20 Properties
-- Run this entire script in Supabase SQL Editor
-- This will fix the constraint issue and insert all 20 properties

-- ============================================
-- STEP 1: Fix the Constraint
-- ============================================

-- Drop the existing constraint if it exists
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS check_property_type;

-- Clean up any invalid property_type values
UPDATE properties
SET property_type = NULL
WHERE property_type IS NOT NULL
AND property_type NOT IN (
  'apartment', 'studio', 'condo', 'house', 'villa', 'penthouse',
  'office', 'shop', 'showroom', 'warehouse', 'hotel', 'guest_house', 'commercial_building',
  'land', 'farm', 'industrial_land'
);

-- Recreate the constraint with exact values
ALTER TABLE properties 
ADD CONSTRAINT check_property_type 
CHECK (property_type IS NULL OR property_type = ANY(ARRAY[
  'apartment', 'studio', 'condo', 'house', 'villa', 'penthouse',
  'office', 'shop', 'showroom', 'warehouse', 'hotel', 'guest_house', 'commercial_building',
  'land', 'farm', 'industrial_land'
]::text[]));

-- ============================================
-- STEP 2: Insert 20 Properties
-- ============================================

INSERT INTO properties (
  title, description, price, price_type, property_type,
  location, bedrooms, bathrooms, area, 
  furnished, parking, security, generator, 
  amenities, status, images, latitude, longitude
) VALUES

-- 1. Apartment (Rent)
('Modern 2BR Apartment in Kimihurura', 'Beautiful 2-bedroom apartment in the prestigious Greenland Plaza. This modern apartment features spacious rooms, modern finishes, and stunning views of Kigali. Perfect for professionals or small families looking for a comfortable living space in the heart of Kimihurura.', 800, 'rent', 'apartment', 'Kimihurura, Kigali', 2, 2, 120, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'WiFi Ready', 'Balcony', 'Swimming Pool Access'], 'available', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'], -1.9441, 30.0619),

-- 2. Studio (Rent)
('Cozy Studio Apartment in Kacyiru', 'Modern studio apartment perfect for singles or couples. Located in the heart of Kacyiru with easy access to shops, restaurants, and public transport. Fully furnished with all essential amenities.', 450, 'rent', 'studio', 'Kacyiru, Kigali', 1, 1, 55, true, true, true, false, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'WiFi Ready', 'Modern Kitchen'], 'available', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'], -1.9500, 30.0700),

-- 3. Condo (Sale)
('Luxury 3BR Condo in Nyarutarama', 'Premium 3-bedroom condo with high-end finishes and exclusive access to building amenities. Spacious living areas, modern kitchen, and private balcony with city views. Perfect investment opportunity.', 180000, 'sale', 'condo', 'Nyarutarama, Kigali', 3, 3, 180, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'Swimming Pool', 'Gym Access', 'Rooftop Terrace'], 'available', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'], -1.9300, 30.0800),

-- 4. House (Rent)
('Spacious 4BR Family House in Remera', 'Beautiful family home with large garden and modern amenities. Perfect for families seeking comfort and space. Located in a quiet neighborhood with excellent schools nearby.', 1500, 'rent', 'house', 'Remera, Kigali', 4, 3, 250, true, true, true, true, ARRAY['Fully Furnished', 'Private Garden', 'Parking Available', '24/7 Security', 'Generator Backup', 'Children Play Area'], 'available', ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80', 'https://images.unsplash.com/photo-1600585154526-990dbe4eb5f3?w=800&q=80', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80'], -1.9400, 30.0650),

-- 5. Villa (Sale)
('Luxury Villa with Private Pool in Nyarutarama', 'Stunning luxury villa with private pool and extensive garden. Premium finishes throughout, spacious living areas, and exclusive location. Perfect for families seeking the ultimate in luxury living.', 350000, 'sale', 'villa', 'Nyarutarama, Kigali', 5, 5, 450, true, true, true, true, ARRAY['Fully Furnished', 'Private Pool', 'Large Garden', 'Parking Available', '24/7 Security', 'Generator Backup', 'Maid Quarters', 'Home Office'], 'available', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80'], -1.9300, 30.0800),

-- 6. Penthouse (Sale)
('Exclusive Penthouse with Panoramic Views', 'Luxurious 3-bedroom penthouse with panoramic city views. This premium property features high-end finishes, spacious living areas, and exclusive access to building amenities. A perfect investment opportunity.', 250000, 'sale', 'penthouse', 'Kimihurura, Kigali', 3, 3, 200, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'Swimming Pool Access', 'Gym Access', 'Rooftop Terrace', 'City Views'], 'available', ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'], -1.9441, 30.0619),

-- 7. Office (Rent)
('Modern Office Space in Kacyiru Business District', 'Professional office space ideal for businesses and startups. Modern facilities, high-speed internet, meeting rooms, and excellent location in the heart of Kacyiru business district.', 1200, 'rent', 'office', 'Kacyiru, Kigali', 0, 2, 150, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'High-Speed Internet', 'Meeting Rooms', 'Reception Area'], 'available', ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80', 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80'], -1.9500, 30.0700),

-- 8. Shop (Rent)
('Prime Retail Shop in Kimihurura', 'Prime retail space in high-traffic area. Perfect for retail businesses, cafes, or restaurants. Excellent visibility and foot traffic. Ready for immediate occupancy.', 800, 'rent', 'shop', 'Kimihurura, Kigali', 0, 1, 80, false, true, true, false, ARRAY['Parking Available', '24/7 Security', 'High Visibility', 'Street Frontage', 'Storage Space'], 'available', ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'], -1.9441, 30.0619),

-- 9. Showroom (Rent)
('Large Showroom Space for Display', 'Spacious showroom perfect for displaying products, cars, or furniture. High ceilings, excellent lighting, and prime location. Ideal for automotive, furniture, or electronics businesses.', 1500, 'rent', 'showroom', 'Remera, Kigali', 0, 2, 300, false, true, true, true, ARRAY['Parking Available', '24/7 Security', 'Generator Backup', 'High Ceilings', 'Excellent Lighting', 'Loading Bay'], 'available', ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'], -1.9400, 30.0650),

-- 10. Warehouse (Rent)
('Modern Warehouse for Storage & Logistics', 'Large warehouse space ideal for storage, distribution, or manufacturing. High ceilings, loading docks, and excellent access for trucks. Perfect for logistics and supply chain businesses.', 2000, 'rent', 'warehouse', 'Kicukiro, Kigali', 0, 1, 500, false, true, true, true, ARRAY['Parking Available', '24/7 Security', 'Generator Backup', 'Loading Docks', 'High Ceilings', 'Truck Access'], 'available', ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'], -1.9600, 30.0900),

-- 11. Hotel (Sale)
('Boutique Hotel for Sale in Kimihurura', 'Well-established boutique hotel with 15 rooms, restaurant, and conference facilities. Excellent location, fully operational, and ready for new ownership. Great investment opportunity.', 450000, 'sale', 'hotel', 'Kimihurura, Kigali', 15, 15, 800, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'Restaurant', 'Conference Room', 'Reception', 'Operational Business'], 'available', ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'], -1.9441, 30.0619),

-- 12. Guest House (Rent)
('Charming Guest House in Nyarutarama', 'Beautiful guest house with 8 rooms, perfect for short-term rentals or hospitality business. Well-maintained, fully furnished, and in excellent location near tourist attractions.', 1800, 'rent', 'guest_house', 'Nyarutarama, Kigali', 8, 8, 400, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'Common Areas', 'Kitchen Facilities', 'Garden'], 'available', ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'], -1.9300, 30.0800),

-- 13. Commercial Building (Sale)
('Mixed-Use Commercial Building', 'Multi-story commercial building with office spaces, retail shops, and parking. Excellent investment opportunity in prime location. Currently generating rental income.', 600000, 'sale', 'commercial_building', 'Kacyiru, Kigali', 0, 10, 1200, false, true, true, true, ARRAY['Parking Available', '24/7 Security', 'Generator Backup', 'Multiple Units', 'Prime Location', 'Income Generating'], 'available', ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'], -1.9500, 30.0700),

-- 14. Land / Plot (Sale)
('Prime Residential Plot in Nyarutarama', 'Well-located serviced plot ready for residential development. All utilities available, excellent location, and approved for residential construction. Perfect for building your dream home.', 85000, 'sale', 'land', 'Nyarutarama, Kigali', 0, 0, 500, false, false, false, false, ARRAY['Serviced Plot', 'Utilities Available', 'Approved for Construction', 'Prime Location', 'Clear Title'], 'available', ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'], -1.9300, 30.0800),

-- 15. Farm (Sale)
('Agricultural Farm Land in Kicukiro', 'Large agricultural land perfect for farming, livestock, or agribusiness. Fertile soil, water access, and excellent for various agricultural activities. Great investment opportunity.', 120000, 'sale', 'farm', 'Kicukiro, Kigali', 0, 0, 2000, false, false, false, false, ARRAY['Fertile Soil', 'Water Access', 'Large Area', 'Agricultural Zoning', 'Clear Title'], 'available', ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80'], -1.9600, 30.0900),

-- 16. Industrial Land (Sale)
('Industrial Land for Development', 'Prime industrial land zoned for factories, warehouses, or manufacturing facilities. Excellent access to main roads, utilities available, and perfect for industrial development.', 95000, 'sale', 'industrial_land', 'Kicukiro, Kigali', 0, 0, 800, false, false, false, false, ARRAY['Industrial Zoning', 'Road Access', 'Utilities Available', 'Large Area', 'Clear Title', 'Development Ready'], 'available', ARRAY['https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80'], -1.9600, 30.0900),

-- 17. Apartment (Sale)
('2BR Apartment for Sale in Remera', 'Well-maintained 2-bedroom apartment in excellent condition. Modern finishes, good location, and ready to move in. Great investment or home ownership opportunity.', 95000, 'sale', 'apartment', 'Remera, Kigali', 2, 2, 100, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'Balcony'], 'available', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'], -1.9400, 30.0650),

-- 18. House (Sale)
('3BR Family House in Kimihurura', 'Charming 3-bedroom family house with garden. Well-maintained, modern amenities, and in excellent location. Perfect for families looking for a comfortable home.', 180000, 'sale', 'house', 'Kimihurura, Kigali', 3, 2, 200, true, true, true, true, ARRAY['Fully Furnished', 'Private Garden', 'Parking Available', '24/7 Security', 'Generator Backup'], 'available', ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80', 'https://images.unsplash.com/photo-1600585154526-990dbe4eb5f3?w=800&q=80', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80'], -1.9441, 30.0619),

-- 19. Studio (Sale)
('Affordable Studio Apartment for Sale', 'Compact and modern studio apartment perfect for first-time buyers or investors. Well-located, good condition, and ready to move in or rent out.', 35000, 'sale', 'studio', 'Kacyiru, Kigali', 1, 1, 45, true, true, true, false, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Modern Kitchen'], 'available', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'], -1.9500, 30.0700),

-- 20. Condo (Rent)
('Luxury 2BR Condo in Nyarutarama', 'Premium 2-bedroom condo with modern amenities and exclusive access to building facilities. Spacious, well-designed, and in prime location. Perfect for professionals.', 1100, 'rent', 'condo', 'Nyarutarama, Kigali', 2, 2, 130, true, true, true, true, ARRAY['Fully Furnished', 'Parking Available', '24/7 Security', 'Generator Backup', 'Swimming Pool Access', 'Gym Access'], 'available', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'], -1.9300, 30.0800);

-- ============================================
-- STEP 3: Verify Results
-- ============================================

SELECT 
  property_type,
  COUNT(*) as count,
  STRING_AGG(DISTINCT price_type, ', ') as price_types
FROM properties 
WHERE status = 'available'
GROUP BY property_type
ORDER BY property_type;

SELECT 
  'Total Properties' as summary,
  COUNT(*) as count
FROM properties 
WHERE status = 'available';
