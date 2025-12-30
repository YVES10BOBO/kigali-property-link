-- Check Properties - Verify you have exactly 6 properties with no duplicates

-- 1. Count total properties (should be 6)
SELECT COUNT(*) as total_properties FROM properties;

-- 2. Show all properties
SELECT 
  id, 
  title, 
  location, 
  price, 
  price_type,
  bedrooms,
  bathrooms,
  created_at
FROM properties
ORDER BY created_at DESC;

-- 3. Check for duplicates (should return 0 rows if no duplicates)
SELECT 
  title, 
  location, 
  price, 
  price_type, 
  COUNT(*) as count
FROM properties
GROUP BY title, location, price, price_type
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- If the last query returns 0 rows, you have NO duplicates! ✅


