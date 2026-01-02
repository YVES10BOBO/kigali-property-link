-- Property Verification and Availability System
-- Adds approval workflow, confirmation system, and status tracking

-- 1. Update properties table with new statuses and confirmation fields
ALTER TABLE properties 
  DROP CONSTRAINT IF EXISTS properties_status_check;

ALTER TABLE properties
  ADD CONSTRAINT properties_status_check 
  CHECK (status IN (
    'pending_approval',  -- New listing awaiting admin approval
    'available',          -- Approved and available
    'reserved',          -- Reserved but not yet sold/rented
    'sold',              -- Sold (hidden from public)
    'rented',            -- Rented (hidden from public)
    'unverified',        -- Availability not confirmed (hidden)
    'rejected',          -- Rejected by admin (hidden)
    'needs_revision'     -- Needs changes before approval
  ));

-- Add new fields for verification and confirmation
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_confirmed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS confirmation_due_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Set default status for new properties to pending_approval
ALTER TABLE properties
  ALTER COLUMN status SET DEFAULT 'pending_approval';

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_confirmation_due_date ON properties(confirmation_due_date);
CREATE INDEX IF NOT EXISTS idx_properties_pending_approval ON properties(status) WHERE status = 'pending_approval';

-- 2. Create property status history table
CREATE TABLE IF NOT EXISTS property_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for status history
CREATE INDEX IF NOT EXISTS idx_property_status_history_property_id ON property_status_history(property_id);
CREATE INDEX IF NOT EXISTS idx_property_status_history_created_at ON property_status_history(created_at);

-- 3. Function to log status changes
CREATE OR REPLACE FUNCTION log_property_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO property_status_history (
      property_id,
      old_status,
      new_status,
      changed_by,
      reason,
      notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.approved_by, -- Use approved_by or current user context
      NEW.rejection_reason,
      NEW.admin_notes
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log status changes
DROP TRIGGER IF EXISTS trigger_log_property_status_change ON properties;
CREATE TRIGGER trigger_log_property_status_change
  AFTER UPDATE OF status ON properties
  FOR EACH ROW
  EXECUTE FUNCTION log_property_status_change();

-- 4. Function to set confirmation due date
CREATE OR REPLACE FUNCTION set_confirmation_due_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Set confirmation due date to 30 days from now when status becomes 'available'
  IF NEW.status = 'available' AND (OLD.status IS NULL OR OLD.status != 'available') THEN
    NEW.confirmation_due_date = NOW() + INTERVAL '30 days';
    NEW.last_confirmed_at = NOW();
  END IF;
  
  -- Update confirmation due date when owner confirms
  IF NEW.last_confirmed_at IS NOT NULL AND (OLD.last_confirmed_at IS NULL OR OLD.last_confirmed_at != NEW.last_confirmed_at) THEN
    NEW.confirmation_due_date = NOW() + INTERVAL '30 days';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set confirmation due date
DROP TRIGGER IF EXISTS trigger_set_confirmation_due_date ON properties;
CREATE TRIGGER trigger_set_confirmation_due_date
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION set_confirmation_due_date();

-- 5. Update existing properties to have owner_id if they don't have one
-- (This assumes properties created by admin users)
-- You may want to set this manually or leave NULL for existing properties

-- 6. RLS Policies for property owners
-- Allow property owners to view their own properties
DROP POLICY IF EXISTS "Property owners can view their own properties" ON properties;
CREATE POLICY "Property owners can view their own properties" ON properties
  FOR SELECT
  USING (
    owner_id IS NOT NULL AND 
    owner_id = auth.uid()::text::uuid
  );

-- Allow property owners to update their own properties (with restrictions)
DROP POLICY IF EXISTS "Property owners can update their own properties" ON properties;
CREATE POLICY "Property owners can update their own properties" ON properties
  FOR UPDATE
  USING (
    owner_id IS NOT NULL AND 
    owner_id = auth.uid()::text::uuid
  )
  WITH CHECK (
    owner_id IS NOT NULL AND 
    owner_id = auth.uid()::text::uuid
  );

-- Allow property owners to insert their own properties
DROP POLICY IF EXISTS "Property owners can insert their own properties" ON properties;
CREATE POLICY "Property owners can insert their own properties" ON properties
  FOR INSERT
  WITH CHECK (
    owner_id = auth.uid()::text::uuid
  );

-- Note: Admin policies should already exist from previous migrations
-- This adds owner-specific policies while maintaining admin access
