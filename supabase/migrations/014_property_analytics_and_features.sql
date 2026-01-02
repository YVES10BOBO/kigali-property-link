-- Property Analytics and Additional Features
-- Adds view tracking, favorites, and analytics support

-- 1. Property views tracking table
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for property views
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON property_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_property_views_user_id ON property_views(user_id);

-- 2. Property favorites/bookmarks table
CREATE TABLE IF NOT EXISTS property_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, user_id) -- Prevent duplicate favorites
);

-- Indexes for favorites
CREATE INDEX IF NOT EXISTS idx_property_favorites_property_id ON property_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_property_favorites_user_id ON property_favorites(user_id);

-- 3. Update properties table to add views counter (for quick access)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Create index for views_count
CREATE INDEX IF NOT EXISTS idx_properties_views_count ON properties(views_count);

-- 4. Function to update views count
CREATE OR REPLACE FUNCTION update_property_views_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET views_count = (
    SELECT COUNT(*) 
    FROM property_views 
    WHERE property_id = NEW.property_id
  )
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update views count when view is recorded
DROP TRIGGER IF EXISTS trigger_update_property_views_count ON property_views;
CREATE TRIGGER trigger_update_property_views_count
  AFTER INSERT ON property_views
  FOR EACH ROW
  EXECUTE FUNCTION update_property_views_count();

-- 5. RLS Policies for property_views
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views (for tracking)
DROP POLICY IF EXISTS "Anyone can track property views" ON property_views;
CREATE POLICY "Anyone can track property views" ON property_views
  FOR INSERT
  WITH CHECK (true);

-- Property owners can view their property's view data
DROP POLICY IF EXISTS "Property owners can view their property views" ON property_views;
CREATE POLICY "Property owners can view their property views" ON property_views
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_views.property_id
      AND properties.owner_id = auth.uid()::text::uuid
    )
  );

-- Admins can view all views
DROP POLICY IF EXISTS "Admins can view all property views" ON property_views;
CREATE POLICY "Admins can view all property views" ON property_views
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 6. RLS Policies for property_favorites
ALTER TABLE property_favorites ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON property_favorites;
CREATE POLICY "Users can view their own favorites" ON property_favorites
  FOR SELECT
  USING (user_id = auth.uid()::text::uuid);

DROP POLICY IF EXISTS "Users can add their own favorites" ON property_favorites;
CREATE POLICY "Users can add their own favorites" ON property_favorites
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text::uuid);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON property_favorites;
CREATE POLICY "Users can delete their own favorites" ON property_favorites
  FOR DELETE
  USING (user_id = auth.uid()::text::uuid);

-- 7. Create function to get property analytics
CREATE OR REPLACE FUNCTION get_property_analytics(p_property_id UUID, p_date_from TIMESTAMP WITH TIME ZONE DEFAULT NULL, p_date_to TIMESTAMP WITH TIME ZONE DEFAULT NULL)
RETURNS TABLE (
  total_views BIGINT,
  unique_views BIGINT,
  total_inquiries BIGINT,
  views_over_time JSONB,
  inquiries_over_time JSONB,
  average_views_per_day NUMERIC,
  conversion_rate NUMERIC
) AS $$
DECLARE
  v_date_from TIMESTAMP WITH TIME ZONE;
  v_date_to TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Set default date range if not provided (last 30 days)
  v_date_from := COALESCE(p_date_from, NOW() - INTERVAL '30 days');
  v_date_to := COALESCE(p_date_to, NOW());

  RETURN QUERY
  WITH view_stats AS (
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT COALESCE(user_id::text, ip_address)) as unique_count,
      jsonb_agg(
        jsonb_build_object(
          'date', DATE(viewed_at),
          'count', COUNT(*)
        ) ORDER BY DATE(viewed_at)
      ) FILTER (WHERE viewed_at >= v_date_from AND viewed_at <= v_date_to) as views_timeline
    FROM property_views
    WHERE property_id = p_property_id
      AND viewed_at >= v_date_from
      AND viewed_at <= v_date_to
    GROUP BY DATE(viewed_at)
  ),
  inquiry_stats AS (
    SELECT 
      COUNT(*) as total,
      jsonb_agg(
        jsonb_build_object(
          'date', DATE(created_at),
          'count', COUNT(*)
        ) ORDER BY DATE(created_at)
      ) FILTER (WHERE created_at >= v_date_from AND created_at <= v_date_to) as inquiries_timeline
    FROM inquiries
    WHERE property_id = p_property_id
      AND created_at >= v_date_from
      AND created_at <= v_date_to
    GROUP BY DATE(created_at)
  )
  SELECT 
    COALESCE((SELECT SUM(total) FROM view_stats), 0)::BIGINT as total_views,
    COALESCE((SELECT SUM(unique_count) FROM view_stats), 0)::BIGINT as unique_views,
    COALESCE((SELECT SUM(total) FROM inquiry_stats), 0)::BIGINT as total_inquiries,
    COALESCE((SELECT jsonb_agg(views_timeline) FROM view_stats), '[]'::jsonb) as views_over_time,
    COALESCE((SELECT jsonb_agg(inquiries_timeline) FROM inquiry_stats), '[]'::jsonb) as inquiries_over_time,
    CASE 
      WHEN (v_date_to - v_date_from) > INTERVAL '0 days'
      THEN COALESCE((SELECT SUM(total) FROM view_stats), 0)::NUMERIC / EXTRACT(DAY FROM (v_date_to - v_date_from))
      ELSE 0
    END as average_views_per_day,
    CASE 
      WHEN COALESCE((SELECT SUM(total) FROM view_stats), 0) > 0
      THEN (COALESCE((SELECT SUM(total) FROM inquiry_stats), 0)::NUMERIC / COALESCE((SELECT SUM(total) FROM view_stats), 1)::NUMERIC * 100)
      ELSE 0
    END as conversion_rate;
END;
$$ LANGUAGE plpgsql;
