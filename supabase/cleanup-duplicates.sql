-- Clean up duplicate properties
-- This script will help you remove duplicate properties

-- First, let's see how many duplicates you have
SELECT title, location, price, price_type, COUNT(*) as count
FROM properties
GROUP BY title, location, price, price_type
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Option 1: Delete ALL properties and start fresh
-- WARNING: This will delete ALL properties!
-- DELETE FROM properties;

-- Option 2: Keep only the newest property for each unique combination
-- This keeps the most recent entry and deletes older duplicates
DELETE FROM properties
WHERE id NOT IN (
  SELECT DISTINCT ON (title, location, price, price_type) id
  FROM properties
  ORDER BY title, location, price, price_type, created_at DESC
);

-- After cleanup, verify you have 6 properties
SELECT COUNT(*) as total_properties FROM properties;

-- View all remaining properties
SELECT id, title, location, price, price_type, created_at
FROM properties
ORDER BY created_at DESC;


