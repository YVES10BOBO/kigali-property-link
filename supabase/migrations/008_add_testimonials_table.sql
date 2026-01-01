-- Add testimonials/reviews table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_property_id ON testimonials(property_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to make migration idempotent)
DROP POLICY IF EXISTS "Approved testimonials are viewable by everyone" ON testimonials;
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;

-- Everyone can view approved testimonials
CREATE POLICY "Approved testimonials are viewable by everyone" ON testimonials
  FOR SELECT
  USING (status = 'approved');

-- Anyone can submit testimonials (pending approval)
CREATE POLICY "Anyone can submit testimonials" ON testimonials
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all testimonials (including pending/rejected)
-- Note: This relies on application-level admin check, not RLS users table query
CREATE POLICY "Admins can view all testimonials" ON testimonials
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can update testimonials
CREATE POLICY "Admins can update testimonials" ON testimonials
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials" ON testimonials
  FOR DELETE
  USING (auth.role() = 'authenticated');
